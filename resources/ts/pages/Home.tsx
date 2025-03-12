import CustomButton from "@/components/CustomButton";
import "@css/Home.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Paper } from "@mui/material";
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

const handleEdit = (id: number) => {
  console.log("Editar pedido:", id);
};

const handleDelete = (id: number) => {
  console.log("Excluir pedido:", id);
};

export default function Home() {
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
    {
      id: 2,
      customerName: "Bruno Dias",
      customerEmail: "bdd.vasconcelos@email.com",
      customerNumber: "(92) 98170-5996",
      lensName: "Lente XYZ",
      lensFabricant: "Fabricante A",
      lensDurability: 20,
      lensFamily: "Família 1",
    },
  ]);

  const subtitle = `${orders.length} ${
    orders.length === 1 ? "pedido encontrado" : "pedidos encontrados"
  }`;

  return (
    <div className="home-container">
      <div className="home-title-container">
        <div className="first-home-row">
          <h1 className="home-title">Pedidos</h1>
          <CustomButton
            label="Adicionar pedido"
            onClick={() => {}}
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
  );
}
