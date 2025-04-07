import { Lens, Order, Terms } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { Autocomplete, Box, Modal, TextField, Typography } from "@mui/material";
import SignatureCanvas from "react-signature-canvas";
import CustomButton from "./CustomButton";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId?: number;
  newOrder: Omit<Order, "id">;
  setNewOrder: React.Dispatch<React.SetStateAction<Omit<Order, "id">>>;
  isEdit: boolean;
  isModified: boolean;
  lenses: Lens[];
  terms: Terms[];
  signatureRef: React.RefObject<SignatureCanvas | null>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveSignature: () => void;
  handleClearSignature: () => void;
  handleSaveEdit: () => void;
  handleAddOrder: () => void;
  formatPhoneNumber: (phone: string) => string;
}

export default function OrderModal({
  open,
  onClose,
  newOrder,
  setNewOrder,
  isEdit,
  isModified,
  lenses,
  terms,
  signatureRef,
  handleChange,
  handlePhoneChange,
  handleSaveSignature,
  handleClearSignature,
  handleSaveEdit,
  handleAddOrder,
  formatPhoneNumber,
}: OrderModalProps) {
  const styles = {
    container: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      borderRadius: 2,
      bgcolor: "background.paper",
      boxShadow: "4px 4px 20px 0px rgba(0,0,0,0.35)",
      p: 4,
    },
    autocomplete: { marginTop: 1 },
    signatureBox: {
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
    },
    signatureTitle: { mt: 2, color: "GrayText" },
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.container}>
        <Typography id="modal-title" variant="h6">
          {isEdit ? "Editar pedido" : "Adicionar Pedido"}
        </Typography>

        <TextField
          fullWidth
          label="Nome do Cliente"
          name="customer_name"
          value={newOrder.customer_name}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Data de Nascimento do Cliente"
          name="customer_birthdate"
          value={
            !isEdit
              ? newOrder.customer_birthdate
              : formatDate(newOrder.customer_birthdate)
          }
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Email do Cliente (Opcional)"
          name="customer_email"
          value={newOrder.customer_email}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Telefone do Cliente (WhatsApp)"
          name="customer_number"
          value={
            !isEdit
              ? newOrder.customer_number
              : formatPhoneNumber(newOrder.customer_number.slice(2, 13))
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
              : lenses.find((lens) => lens.id === newOrder.lens_id) || null
          }
          getOptionLabel={(option) => option.name}
          onChange={(_, value) =>
            setNewOrder((prevOrder) => ({
              ...prevOrder,
              lens_id: value ? value.id : null,
            }))
          }
          sx={styles.autocomplete}
          renderInput={(params) => <TextField {...params} label="Lente" />}
        />

        <Autocomplete
          disablePortal
          options={terms}
          defaultValue={
            !isEdit
              ? null
              : terms.find((term) => term.id === newOrder.terms_id) || null
          }
          getOptionLabel={(option) => option.expire_date}
          onChange={(_, value) =>
            setNewOrder((prevOrder) => ({
              ...prevOrder,
              terms_id: value ? value.id : null,
            }))
          }
          sx={styles.autocomplete}
          renderInput={(params) => <TextField {...params} label="Validade" />}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 10,
          }}
        >
          <Typography variant="subtitle1" sx={styles.signatureTitle}>
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

        <Box sx={styles.signatureBox}>
          {!isEdit ? (
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{ width: 380, height: 150, className: "sigCanvas" }}
              penColor="black"
              backgroundColor="transparent"
              onEnd={handleSaveSignature}
            />
          ) : (
            <img
              src={newOrder.customer_signature}
              alt="Assinatura do Cliente"
              className="signature-image"
            />
          )}
        </Box>

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
  );
}
