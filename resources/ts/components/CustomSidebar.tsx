import { useAuth } from "@/contexts/auth/AuthContext";
import { useLens } from "@/contexts/lens/LensContext";
import { routePaths } from "@/routes";
import Logo from "@assets/eye-center-logo.svg";
import "@css/CustomSidebar.css";
import { useCallback, useRef } from "react";
import { GiSpectacleLenses } from "react-icons/gi";
import { IoMdHome } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import SidebarItem from "./SidebarItem";

export function CustomSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { updateLens } = useLens();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateLens = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const selectedFile = event.target.files[0];

        try {
          const buffer = await selectedFile.arrayBuffer(); // Obtém o ArrayBuffer
          const blob = new Blob([buffer], { type: selectedFile.type }); // Converte para Blob

          const formData = new FormData();
          formData.append("excel", blob, selectedFile.name); // Adiciona ao FormData

          // Exibir conteúdo do FormData corretamente
          for (const [key, value] of formData.entries()) {
            console.log(`FormData -> ${key}:`, value);
          }

          updateLens(formData); // Envia para a API
        } catch (error) {
          console.error("Erro ao processar o arquivo:", error);
        }
      }
    },
    [updateLens]
  );

  return (
    <div className="custom-sidebar">
      <img src={Logo} alt="logo" className="logo" />

      <div className="items-container">
        <SidebarItem
          itemName="Dashboard"
          onClick={() => navigate(routePaths.home, { replace: true })}
        >
          <IoMdHome color={"#fff"} size={32} />
        </SidebarItem>

        <SidebarItem
          itemName="Atualizar lentes"
          onClick={() => fileInputRef.current?.click()}
        >
          <GiSpectacleLenses color={"#fff"} size={32} />
        </SidebarItem>

        <input
          type="file"
          accept=".xlsx"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleUpdateLens}
        />
      </div>

      <CustomButton
        onClick={logout}
        label="Sair"
        style={{
          color: "#fff",
          backgroundColor: "#00c3b5",
          borderRadius: "5px",
          fontSize: "1.2rem",
          padding: "0.5vh 2vh",
        }}
      />
    </div>
  );
}
