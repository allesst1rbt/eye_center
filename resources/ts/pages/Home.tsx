import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CustomButton from "@/components/CustomButton";
import OrderActions from "@/components/OrderActions";
import OrderModal from "@/components/OrderForm";
import { useLensStore } from "@/stores/lensStore";
import { useOrderStore } from "@/stores/orderStore";
import { Order } from "@/types";
import { formatDate, formatISODate } from "@/utils/formatDate";
import { formatPhoneNumber, onlyNumbers } from "@/utils/formatPhoneNumber";
import "@css/Home.css";

const INITIAL_ORDER_STATE: Omit<Order, "id"> = {
  customer_name: "",
  customer_email: "",
  customer_birthdate: "",
  customer_number: "",
  lens_id: null,
  terms_id: null,
};

const PHONE_REGEX = /^\(\d{2}\) \d{5}-\d{4}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Home() {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [newOrder, setNewOrder] =
    useState<Omit<Order, "id">>(INITIAL_ORDER_STATE);

  const { lens, terms, getLens } = useLensStore();
  const { orders, getOrders, createOrder, updateOrder, deleteOrder } =
    useOrderStore();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      [name]: name === "customer_birthdate" ? formatDate(value) : value,
    }));
  }, []);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const numbersOnly = value.replace(/\D/g, "");
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        customer_number: formatPhoneNumber(numbersOnly),
      }));
    },
    []
  );

  const onCloseModal = useCallback(() => {
    setNewOrder(INITIAL_ORDER_STATE);
    setAddModalOpen(false);
    setIsEdit(false);
  }, []);

  const handleEdit = useCallback(
    (id: number) => {
      const orderToEdit = orders.find((order) => order.id === id);
      if (orderToEdit) {
        const formattedOrder = {
          ...orderToEdit,
          customer_number: orderToEdit.customer_number.startsWith("55")
            ? formatPhoneNumber(orderToEdit.customer_number.slice(2))
            : formatPhoneNumber(orderToEdit.customer_number),
        };

        setEditOrder(orderToEdit);
        setNewOrder(formattedOrder);
        setIsEdit(true);
        setAddModalOpen(true);
      }
    },
    [orders]
  );

  const validateOrderForm = useCallback(
    (order: Omit<Order, "id">): string | null => {
      if (
        !order.customer_name ||
        !order.customer_number ||
        !order.lens_id ||
        !order.terms_id
      ) {
        return "Preencha todos os campos corretamente e assine o pedido!";
      }

      const phoneDigits = onlyNumbers(order.customer_number);
      if (phoneDigits.length < 11) {
        return "O número de telefone deve ter 11 dígitos (DDD + número).";
      }

      if (order.customer_email && !EMAIL_REGEX.test(order.customer_email)) {
        return "Por favor, insira um email válido.";
      }

      return null;
    },
    []
  );

  const formatPhoneForApi = useCallback((phone: string): string => {
    return `55${onlyNumbers(phone)}`;
  }, []);

  const handleOrderSubmit = useCallback(
    async (isEditing: boolean) => {
      if (isEditing && !editOrder) return;

      console.log("new order customer number: ", newOrder.customer_number);

      const validationError = validateOrderForm(newOrder);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const confirmMessage = isEditing
        ? "Deseja confirmar a edição da compra?"
        : "Deseja realmente adicionar essa compra?";

      if (window.confirm(confirmMessage)) {
        const orderData = {
          ...newOrder,
          customer_number: formatPhoneForApi(newOrder.customer_number),
        };

        toast.promise(
          async () => {
            if (isEditing && editOrder) {
              await updateOrder(editOrder.id!, orderData);
            } else {
              await createOrder(orderData);
            }
            await getOrders();

            if (isEditing) {
              setEditOrder(null);
            }
            onCloseModal();
          },
          {
            loading: isEditing ? "Atualizando pedido..." : "Adicionando...",
            success: isEditing
              ? "Pedido atualizado com sucesso! :D"
              : "Pedido adicionado com sucesso! :D",
            error: isEditing
              ? "Erro ao atualizar pedido. :("
              : "Erro ao adicionar pedido. :(",
          }
        );
      }
    },
    [
      editOrder,
      newOrder,
      createOrder,
      updateOrder,
      getOrders,
      validateOrderForm,
      formatPhoneForApi,
      onCloseModal,
    ]
  );

  const handleAddOrder = useCallback(
    () => handleOrderSubmit(false),
    [handleOrderSubmit]
  );
  const handleSaveEdit = useCallback(
    () => handleOrderSubmit(true),
    [handleOrderSubmit]
  );

  const handleDelete = useCallback(
    (id: number) => {
      if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
        toast.promise(
          async () => {
            await deleteOrder(id);
            await getOrders();
          },
          {
            loading: "Deletando pedido...",
            success: "Pedido deletado com sucesso! :D",
            error: "Erro ao deletar pedido. :(",
          }
        );
      }
    },
    [deleteOrder, getOrders]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      {
        field: "customer_name",
        headerName: "Cliente",
        width: 300,
      },
      {
        field: "lens_id",
        headerName: "Lente",
        width: 200,
        valueGetter: (_, row: Order) =>
          lens.find((l) => String(l.id) === String(row.lens_id))?.name,
      },
      {
        field: "term_id",
        headerName: "Prazo",
        width: 150,
        valueGetter: (_, row: Order) =>
          terms.find((d) => String(d.id) === String(row.terms_id))
            ?.expire_date || "N/A",
      },
      {
        field: "created_at",
        headerName: "Data do Pedido",
        width: 150,
        valueGetter: (_, row: Order) =>
          row.created_at && formatISODate(row.created_at),
      },
      {
        field: "actions",
        headerName: "Ações",
        width: 100,
        sortable: false,
        renderCell: (params) => (
          <OrderActions
            onDelete={handleDelete}
            onEdit={handleEdit}
            orderId={params.row.id}
          />
        ),
      },
    ],
    [lens, terms, handleDelete, handleEdit]
  );

  const paperStyle = useMemo(
    () => ({ height: "85%", width: "100%", marginTop: "5vh" }),
    []
  );

  const buttonStyle = useMemo(
    () => ({
      color: "#fff",
      backgroundColor: "#00c3b5",
      borderRadius: "5px",
      fontSize: "1.1rem",
      padding: "0.5vh 2vh",
    }),
    []
  );

  const isModifiedCheck = useCallback(() => {
    if (!editOrder) return;

    setIsModified(
      newOrder.customer_name !== editOrder.customer_name ||
        newOrder.customer_email !== editOrder.customer_email ||
        newOrder.customer_number !== editOrder.customer_number ||
        newOrder.lens_id !== editOrder.lens_id ||
        newOrder.terms_id !== editOrder.terms_id
    );
  }, [newOrder, editOrder]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    getLens();
  }, [getLens]);

  useEffect(() => {
    isModifiedCheck();
  }, [isModifiedCheck]);

  return (
    <>
      <div className="home-container">
        <div className="home-title-container">
          <h1 className="home-title">Pedidos</h1>
          <CustomButton
            label="Adicionar pedido"
            onClick={() => setAddModalOpen(true)}
            style={buttonStyle}
          />
        </div>

        <Paper sx={paperStyle}>
          <DataGrid
            rows={orders.toReversed()}
            columns={columns}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>

      <OrderModal
        open={addModalOpen}
        onClose={onCloseModal}
        orderId={editOrder?.id}
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        isEdit={isEdit}
        isModified={isModified}
        lenses={lens}
        terms={terms}
        handleChange={handleChange}
        handlePhoneChange={handlePhoneChange}
        handleSaveEdit={handleSaveEdit}
        handleAddOrder={handleAddOrder}
        formatPhoneNumber={formatPhoneNumber}
      />
    </>
  );
}
