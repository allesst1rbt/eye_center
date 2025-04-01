import CustomButton from "@/components/CustomButton";
import OrderActions from "@/components/OrderActions";
import OrderModal from "@/components/OrderForm";
import { useLens } from "@/contexts/lens/LensContext";
import { Order } from "@/types";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import "@css/Home.css";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function Home() {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  const { lens, dates } = useLens();

  const [newOrder, setNewOrder] = useState<Omit<Order, "id">>({
    customerName: "",
    customerEmail: "",
    customerNumber: "",
    lensId: "",
    dateId: "",
    customerSignature: "",
    date: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        customerSignature: "",
      }));
    }
  };

  const handleSaveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        customerSignature: signatureRef.current!.toDataURL("image/png"),
      }));
    }
  };

  const onCloseModal = () => {
    setNewOrder({
      customerName: "",
      customerEmail: "",
      customerNumber: "",
      lensId: "",
      dateId: "",
      customerSignature: "",
      date: null,
    });

    signatureRef.current?.clear();
    setAddModalOpen(false);
    setIsEdit(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      customerNumber: formatPhoneNumber(value),
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

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este pedido?"
    );
    if (confirmDelete) {
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      console.log("Pedido excluído:", id);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "customerName",
      headerName: "Cliente",
      width: 180,
    },
    {
      field: "lensId",
      headerName: "Lente",
      width: 180,
      valueGetter: (_, row: Order) =>
        lens.find((lens) => String(lens.id) === String(row.lensId))?.name,
    },
    {
      field: "date",
      headerName: "Data da compra",
      width: 140,
      valueGetter: (_, row: Order) => format(row.date!, "dd/MM/yyyy"),
    },
    {
      field: "dateId",
      headerName: "Prazo",
      width: 130,
      valueGetter: (_, row: Order) =>
        dates.find((value) => String(value.id) === String(row.dateId))
          ?.expire_date || "N/A",
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

  const handleAddOrder = () => {
    if (
      !newOrder.customerName ||
      !newOrder.customerNumber ||
      !newOrder.lensId ||
      !newOrder.dateId ||
      !newOrder.customerSignature
    ) {
      alert("Preencha todos os campos corretamente e assine o pedido!");
      return;
    }

    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        customerSignature: signatureRef.current!.toDataURL("image/png"),
      }));
    }

    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!phoneRegex.test(newOrder.customerNumber)) {
      alert("O número de telefone deve estar no formato (xx) xxxxx-xxxx.");
      return;
    }

    if (newOrder.customerEmail && !emailRegex.test(newOrder.customerEmail)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    if (confirm("Deseja realmente adicionar essa compra?")) {
      const newOrderWithId: Order = {
        id: orders.length ? orders[orders.length - 1].id + 1 : 1,
        ...newOrder,
        customerNumber: newOrder.customerNumber.replace(/\D/g, ""),
        date: new Date(),
      };

      setOrders((prevOrders) => [...prevOrders, newOrderWithId]);
      setAddModalOpen(false);
      setNewOrder({
        customerName: "",
        customerEmail: "",
        customerNumber: "",
        lensId: "",
        dateId: "",
        customerSignature: "",
        date: null,
      });

      if (signatureRef.current) {
        signatureRef.current.clear();
      }
    }
  };

  const handleSaveEdit = () => {
    if (!editOrder) return;

    if (
      !newOrder.customerName ||
      !newOrder.customerNumber ||
      !newOrder.lensId ||
      !newOrder.dateId ||
      !newOrder.customerSignature
    ) {
      alert("Preencha todos os campos corretamente e assine o pedido!");
      return;
    }

    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!phoneRegex.test(newOrder.customerNumber)) {
      alert("O número de telefone deve estar no formato (xx) xxxxx-xxxx.");
      return;
    }

    if (newOrder.customerEmail && !emailRegex.test(newOrder.customerEmail)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    if (confirm("Deseja confirmar a edição da compra?")) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === editOrder.id ? { ...editOrder, ...newOrder } : order
        )
      );

      setAddModalOpen(false);
      setIsEdit(false);
      setEditOrder(null);
      setNewOrder({
        customerName: "",
        customerEmail: "",
        customerNumber: "",
        lensId: "",
        dateId: "",
        customerSignature: "",
        date: null,
      });
    }
  };

  useEffect(() => {
    if (!editOrder) return;

    setIsModified(
      newOrder.customerName !== editOrder.customerName ||
        newOrder.customerEmail !== editOrder.customerEmail ||
        newOrder.customerNumber !== editOrder.customerNumber ||
        newOrder.lensId !== editOrder.lensId
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
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        isEdit={isEdit}
        isModified={isModified}
        lenses={lens}
        dates={dates}
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
