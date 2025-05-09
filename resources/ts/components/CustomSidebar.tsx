import { routePaths } from "@/routes";
import { useAuthStore } from "@/stores/authStore";
import { useLensStore } from "@/stores/lensStore";
import Logo from "@assets/eye-center-logo.svg";
import "@css/CustomSidebar.css";
import FormData from "form-data";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { GiSpectacleLenses } from "react-icons/gi";
import { IoMdHome } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import SidebarItem from "./SidebarItem";

export function CustomSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { getLens, updateLens } = useLensStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const selectedFile = event.target.files[0];

        try {
          const buffer = await selectedFile.arrayBuffer();
          const blob = new Blob([buffer], { type: selectedFile.type });

          const formData = new FormData();
          formData.append("excel", blob, selectedFile.name);

          toast.promise(
            async () => {
              await updateLens(formData);
              await getLens();
            },
            {
              loading: "Atualizando...",
              success: <b>Lentes atualizadas com sucesso! :D</b>,
              error: <b>Erro ao atualizar lentes. :(</b>,
            },
            { duration: 1500 }
          );
        } catch (error) {
          console.error("Erro ao atualizar lentes: ", error);
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
          onChange={onSubmit}
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
