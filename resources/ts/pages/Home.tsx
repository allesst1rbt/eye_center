import CustomButton from "@/components/CustomButton";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import "@css/Home.css";
import {
  Autocomplete,
  Box,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerNumber: string;
  lensId: string;
  customerSignature: string;
}

export default function Home() {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const signatureRef = useRef<SignatureCanvas | null>(null);

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

  const [isSigned, setIsSigned] = useState(false);

  const [newOrder, setNewOrder] = useState<Omit<Order, "id">>({
    customerName: "",
    customerEmail: "",
    customerNumber: "",
    lensId: "",
    customerSignature: "",
  });

  const handleAddOrder = () => {
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
    };

    setOrders((prevOrders) => [...prevOrders, newOrderWithId]);
    setAddModalOpen(false);
    setNewOrder({
      customerName: "",
      customerEmail: "",
      customerNumber: "",
      lensId: "",
      customerSignature: "",
    });

    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsSigned(false);
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
      setIsSigned(false);
    }
  };

  const handleSaveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        customerSignature: signatureRef.current!.toDataURL("image/png"),
      }));
      setIsSigned(true);
    }
  };

  const onCloseModal = () => {
    setNewOrder({
      customerName: "",
      customerEmail: "",
      customerNumber: "",
      lensId: "",
      customerSignature: "",
    });

    signatureRef.current?.clear();
    setIsSigned(false);
    setAddModalOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      customerNumber: formatPhoneNumber(value),
    }));
  };

  const options = [
    { label: "The Godfather", id: 1 },
    { label: "Pulp Fiction", id: 2 },
  ];

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
            columns={[]}
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
            value={newOrder.customerNumber}
            onChange={handlePhoneChange}
            margin="dense"
          />

          <Autocomplete
            disablePortal
            options={options}
            sx={{ marginTop: 1 }}
            renderInput={(params) => <TextField {...params} label="Lente" />}
          />

          <>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="subtitle1" sx={{ mt: 2, color: "GrayText" }}>
                Assinatura do Cliente
              </Typography>

              <Typography
                variant="subtitle1"
                onClick={handleClearSignature}
                sx={{ mt: 2, color: "red", cursor: "pointer" }}
              >
                Limpar
              </Typography>
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
            </Box>
            {!isSigned && (
              <Box sx={{ color: "red", mt: 1 }}>Assinatura obrigatória!</Box>
            )}
          </>

          <CustomButton
            label="Adicionar Pedido"
            onClick={handleAddOrder}
            style={{
              marginTop: "10px",
              width: "100%",
              borderRadius: "5px",
              backgroundColor: "#00c3b5",
              color: "#fff",
              padding: "0.5vh 2vh",
            }}
          />
        </Box>
      </Modal>
    </>
  );
}
