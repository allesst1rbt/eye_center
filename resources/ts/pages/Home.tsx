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
    orders.length > 1 ? "pedido encontrado" : "pedidos encontrados"
  }`;

  return (
    <div className="home-container">
      <div className="title-container">
        <h1>Pedidos</h1>
        <h2>{subtitle}</h2>
      </div>
    </div>
  );
}
