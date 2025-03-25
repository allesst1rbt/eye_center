import CustomButton from "@/components/CustomButton";
import OrderActions from "@/components/OrderActions";
import OrderModal from "@/components/OrderForm";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import "@css/Home.css";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerNumber: string;
  lensId: string;
  customerSignature: string;
  date: Date | null;
}

export default function Home() {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  const [lenses, setLenses] = useState<{ id: number; name: string }[]>([
    {
      id: 1,
      name: "Lente Blue Light - Zeiss - Digital - 365 dias",
    },
    {
      id: 2,
      name: "Lente Transitions - Essilor - Fotossensível - 730 dias",
    },
  ]);

  const [newOrder, setNewOrder] = useState<Omit<Order, "id">>({
    customerName: "",
    customerEmail: "",
    customerNumber: "",
    lensId: "",
    customerSignature: "",
    date: null,
  });

  const handleAddOrder = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        customerSignature: signatureRef.current!.toDataURL("image/png"),
      }));
    }

    if (
      !newOrder.customerName ||
      !newOrder.customerEmail ||
      !newOrder.customerNumber ||
      !newOrder.lensId ||
      !newOrder.customerSignature
    ) {
      alert("Preencha todos os campos corretamente e assine o pedido!");
      return;
    }

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
      customerSignature: "",
      date: null,
    });

    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

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
      field: "date",
      headerName: "Data da compra",
      width: 180,
      valueGetter: (value, row: Order) => format(row.date!, "dd/MM/yyyy"),
    },
    // { field: "lensDurability", headerName: "Prazo", width: 120 },
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

  const handleSaveEdit = () => {
    if (!editOrder) return;

    if (
      !newOrder.customerName ||
      !newOrder.customerEmail ||
      !newOrder.customerNumber ||
      !newOrder.lensId ||
      !newOrder.customerSignature
    ) {
      alert("Preencha todos os campos corretamente e assine o pedido!");
      return;
    }

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
      customerSignature: "",
      date: null,
    });
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
        lenses={lenses}
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
