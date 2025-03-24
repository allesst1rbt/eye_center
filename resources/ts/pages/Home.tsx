import CustomButton from "@/components/CustomButton";
import "@css/Home.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerNumber: string;
  lensName: string;
  lensFabricant: string;
  lensFamily: string;
  lensDurability: number;
}

export default function Home() {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customerName: "Bruno Dias",
      customerEmail: "bdd.vasconcelos@email.com",
      customerNumber: "(92) 98170-5996",
      lensName: "Lente XYZ",
      lensFabricant: "Fabricante A",
      lensDurability: 20,
      lensFamily: "Família 1",
    },
  ]);

  const [newOrder, setNewOrder] = useState<Omit<Order, "id">>({
    customerName: "",
    customerEmail: "",
    customerNumber: "",
    lensName: "",
    lensFabricant: "",
    lensFamily: "",
    lensDurability: 0,
  });

  const handleEdit = (id: number) => {
    console.log("Editar pedido:", id);
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

  const handleAddOrder = () => {
    if (
      !newOrder.customerName ||
      !newOrder.customerEmail ||
      !newOrder.customerNumber ||
      !newOrder.lensName ||
      !newOrder.lensFabricant ||
      !newOrder.lensFamily ||
      newOrder.lensDurability <= 0
    ) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    const newOrderWithId: Order = {
      id: orders.length ? orders[orders.length - 1].id + 1 : 1,
      ...newOrder,
    };

    setOrders((prevOrders) => [...prevOrders, newOrderWithId]);
    setAddModalOpen(false);
    setNewOrder({
      customerName: "",
      customerEmail: "",
      customerNumber: "",
      lensName: "",
      lensFabricant: "",
      lensFamily: "",
      lensDurability: 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      [name]: name === "lensDurability" ? Number(value) : value,
    }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "customerName",
      headerName: "Cliente",
      width: 180,
    },
    {
      field: "lensName",
      headerName: "Lente",
      width: 180,
    },
    { field: "lensDurability", headerName: "Prazo", width: 120 },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const subtitle = `${orders.length} ${
    orders.length === 1 ? "pedido encontrado" : "pedidos encontrados"
  }`;

  return (
    <>
      <div className="home-container">
        <div className="home-title-container">
          <div className="first-home-row">
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
          <h2 className="home-subtitle">{subtitle}</h2>
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

      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
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
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Nome da Lente"
            name="lensName"
            value={newOrder.lensName}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Fabricante da Lente"
            name="lensFabricant"
            value={newOrder.lensFabricant}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Família da Lente"
            name="lensFamily"
            value={newOrder.lensFamily}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            type="number"
            label="Durabilidade (dias)"
            name="lensDurability"
            value={newOrder.lensDurability}
            onChange={handleChange}
            margin="dense"
          />

          <CustomButton
            label="Adicionar"
            onClick={handleAddOrder}
            style={{
              marginTop: "10px",
              width: "100%",
              backgroundColor: "#00c3b5",
              color: "#fff",
            }}
          />
        </Box>
      </Modal>
    </>
  );
}
