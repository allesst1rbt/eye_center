import CustomButton from "@/components/CustomButton";
import OrderActions from "@/components/OrderActions";
import OrderModal from "@/components/OrderForm";
import { useLens } from "@/contexts/lens/LensContext";
import { useOrderContext } from "@/contexts/orders/OrderContext";
import { Order } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import "@css/Home.css";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import SignatureCanvas from "react-signature-canvas";

export default function Home() {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  const { lens, terms } = useLens();
  const { orders, getOrders, createOrder, updateOrder, deleteOrder } =
    useOrderContext();

  const resetedOrder = {
    customer_name: "",
    customer_email: "",
    customer_birthdate: "",
    customer_number: "",
    lens_id: null,
    customer_signature: "",
    terms_id: null,
  };

  const [newOrder, setNewOrder] = useState<Omit<Order, "id">>(resetedOrder);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      [name]: name === "customer_birthdate" ? formatDate(value) : value,
    }));
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        customer_signature: "",
      }));
    }
  };

  const handleSaveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        customer_signature: signatureRef.current!.toDataURL("image/png"),
      }));
    }
  };

  const onCloseModal = () => {
    setNewOrder(resetedOrder);

    signatureRef.current?.clear();
    setAddModalOpen(false);
    setIsEdit(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      customer_number: formatPhoneNumber(value),
    }));
  };

  const handleEdit = (id: number) => {
    const orderToEdit = orders.find((order) => order.id === id);
    if (orderToEdit) {
      setEditOrder(orderToEdit);
      setNewOrder({ ...orderToEdit });
      setIsEdit(true);
      setAddModalOpen(true);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "customer_name",
      headerName: "Cliente",
      width: 180,
    },
    {
      field: "lens_id",
      headerName: "Lente",
      width: 180,
      valueGetter: (_, row: Order) =>
        lens.find((l) => String(l.id) === String(row.lens_id))?.name,
    },
    {
      field: "term_id",
      headerName: "Prazo",
      width: 130,
      valueGetter: (_, row: Order) =>
        terms.find((d) => String(d.id) === String(row.terms_id))?.expire_date ||
        "N/A",
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <OrderActions
          onDelete={handleDelete}
          onEdit={handleEdit}
          orderId={params.row.id}
        />
      ),
    },
  ];

  const handleAddOrder = async () => {
    if (
      !newOrder.customer_name ||
      !newOrder.customer_number ||
      !newOrder.lens_id ||
      !newOrder.terms_id ||
      !newOrder.customer_signature
    ) {
      alert("Preencha todos os campos corretamente e assine o pedido!");
      return;
    }

    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        customer_signature: signatureRef.current!.toDataURL("image/png"),
      }));
    }

    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!phoneRegex.test(newOrder.customer_number)) {
      alert("O número de telefone deve estar no formato (xx) xxxxx-xxxx.");
      return;
    }

    if (newOrder.customer_email && !emailRegex.test(newOrder.customer_email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    console.log("New Order:", JSON.stringify(newOrder));

    if (confirm("Deseja realmente adicionar essa compra?")) {
      toast.promise(
        createOrder({
          ...newOrder,
          customer_number: `55${newOrder.customer_number.replace(/\D/g, "")}`,
        }),
        {
          loading: "Adicionando...",
          success: "Pedido adicionado com sucesso! :D",
          error: "Erro ao adicionar pedido. :(",
        }
      );

      await getOrders();
      setAddModalOpen(false);
      setNewOrder(resetedOrder);

      if (signatureRef.current) {
        signatureRef.current.clear();
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editOrder) return;

    if (
      !newOrder.customer_name ||
      !newOrder.customer_number ||
      !newOrder.lens_id ||
      !newOrder.terms_id ||
      !newOrder.customer_signature
    ) {
      alert("Preencha todos os campos corretamente e assine o pedido!");
      return;
    }

    const formattedPhone = formatPhoneNumber(newOrder.customer_number);

    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!phoneRegex.test(formattedPhone)) {
      alert("O número de telefone deve estar no formato (xx) xxxxx-xxxx.");
      return;
    }

    if (newOrder.customer_email && !emailRegex.test(newOrder.customer_email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    if (confirm("Deseja confirmar a edição da compra?")) {
      toast.promise(
        async () => {
          await updateOrder(editOrder.id!, {
            ...newOrder,
            customer_number: `55${formattedPhone}`,
          });
          await getOrders();
          setAddModalOpen(false);
          setIsEdit(false);
          setEditOrder(null);
          setNewOrder(resetedOrder);
        },
        {
          loading: "Atualizando pedido...",
          success: "Pedido atualizado com sucesso! :D",
          error: "Erro ao atualizar pedido. :(",
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
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
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (!editOrder) return;

    setIsModified(
      newOrder.customer_name !== editOrder.customer_name ||
        newOrder.customer_email !== editOrder.customer_email ||
        newOrder.customer_number !== editOrder.customer_number ||
        newOrder.lens_id !== editOrder.lens_id
    );
  }, [newOrder, editOrder]);

  return (
    <>
      <div className="home-container">
        <div className="home-title-container">
          <h1 className="home-title">Pedidos</h1>
          <CustomButton
            label="Adicionar pedido"
            onClick={() => setAddModalOpen(true)}
            style={{
              color: "#fff",
              backgroundColor: "#00c3b5",
              borderRadius: "5px",
              fontSize: "1.1rem",
              padding: "0.5vh 2vh",
            }}
          />
        </div>

        <Paper sx={{ height: "85%", width: "100%", marginTop: "5vh" }}>
          <DataGrid
            rows={orders}
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
        signatureRef={signatureRef}
        handleChange={handleChange}
        handlePhoneChange={handlePhoneChange}
        handleSaveSignature={handleSaveSignature}
        handleClearSignature={handleClearSignature}
        handleSaveEdit={handleSaveEdit}
        handleAddOrder={handleAddOrder}
        formatPhoneNumber={formatPhoneNumber}
      />
    </>
  );
}
