import CustomButton from "@/components/CustomButton";
import "@css/Home.css";
import { useState } from "react";

interface Client {
  name: string;
  email: string;
  number: string;
}

interface Lens {
  name: string;
  fabricant: string;
  family: string;
  durability: number;
}
interface Order {
  client: Client;
  lens: Lens;
}

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([
    {
      client: {
        email: "bdd.vasconcelos@gmail.com",
        name: "Bruno Dias de Vasconcelos",
        number: "(92) 98170-5996",
      },
      lens: {
        name: "",
        fabricant: "",
        durability: 20,
        family: "",
      },
    },
  ]);

  const subtitle = `${orders.length} ${
    orders.length == 1 ? "pedido encontrado" : "pedidos encontrados"
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
              fontSize: "1rem",
              padding: "0.5vh 2vh",
            }}
          />
        </div>
        <h2 className="home-subtitle">{subtitle}</h2>
      </div>
    </div>
  );
}
