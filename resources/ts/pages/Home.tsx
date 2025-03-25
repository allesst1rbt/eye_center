import CustomButton from "@/components/CustomButton";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import "@css/Home.css";
import { Delete, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
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
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
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

      <Modal open={addModalOpen} onClose={onCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: "4px 4px 20px 0px rgba(0,0,0,0.35)",
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6">
            Adicionar Pedido
          </Typography>

          <TextField
            fullWidth
            label="Nome do Cliente"
            name="customerName"
            value={newOrder.customerName}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Email do Cliente"
            name="customerEmail"
            value={newOrder.customerEmail}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Telefone do Cliente"
            name="customerNumber"
            value={
              !isEdit
                ? newOrder.customerNumber
                : formatPhoneNumber(newOrder.customerNumber)
            }
            onChange={handlePhoneChange}
            margin="dense"
          />

          <Autocomplete
            disablePortal
            options={lenses}
            defaultValue={
              !isEdit
                ? null
                : lenses.find((lens) => String(lens.id) === newOrder.lensId) ||
                  null
            }
            getOptionLabel={(option) => option.name}
            onChange={(_, value) =>
              setNewOrder((prevOrder) => ({
                ...prevOrder,
                lensId: value ? String(value.id) : "",
              }))
            }
            sx={{ marginTop: 1 }}
            renderInput={(params) => <TextField {...params} label="Lente" />}
          />

          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              <Typography variant="subtitle1" sx={{ mt: 2, color: "GrayText" }}>
                Assinatura do Cliente
              </Typography>

              {!isEdit && (
                <Typography
                  variant="subtitle1"
                  onClick={handleClearSignature}
                  sx={{ mt: 2, color: "red", cursor: "pointer" }}
                >
                  Limpar
                </Typography>
              )}
            </div>

            <Box
              sx={{
                width: "100%",
                height: 150,
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexDirection: "column",
              }}
            >
              {!isEdit ? (
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    width: 380,
                    height: 150,
                    className: "sigCanvas",
                  }}
                  penColor="black"
                  backgroundColor="transparent"
                  onEnd={handleSaveSignature}
                />
              ) : (
                <img
                  src={newOrder.customerSignature}
                  alt="Assinatura do Cliente"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              )}
            </Box>
          </>

          <CustomButton
            label={isEdit ? "Salvar Alterações" : "Adicionar Pedido"}
            onClick={isEdit ? handleSaveEdit : handleAddOrder}
            disabled={isEdit && !isModified}
            style={{
              marginTop: "25px",
              width: "100%",
              fontSize: "1.1rem",
              borderRadius: "5px",
              backgroundColor: isEdit && !isModified ? "gray" : "#00c3b5",
              color: "#fff",
              padding: "0.5vh 2vh",
            }}
          />
        </Box>
      </Modal>
    </>
  );
}
