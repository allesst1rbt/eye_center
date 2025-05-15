import { Lens, Order, Terms } from "@/types";
import { formatDate, formatISODate } from "@/utils/formatDate";
import {
  Autocomplete,
  Box,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  handleChange,
  handlePhoneChange,
  handleSaveEdit,
  handleAddOrder,
  formatPhoneNumber,
}: OrderModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const styles = {
    container: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: {
        xs: "75%",
        sm: "65%",
        md: "55%",
        lg: "75%",
      },
      maxHeight: {
        xs: "90vh",
        md: "auto",
      },
      overflowY: {
        xs: "auto",
        md: "visible",
      },
      borderRadius: 2,
      bgcolor: "background.paper",
      boxShadow: "4px 4px 20px 0px rgba(0,0,0,0.35)",
      p: 4,
    },
    formContainer: {
      display: {
        xs: "block",
        md: "flex",
      },
      gap: 2,
      justifyContent: "space-between",
    },
    leftSection: {
      flex: 1,
      marginRight: {
        xs: 0,
        md: 2,
      },
    },
    rightSection: {
      flex: 1,
      marginLeft: {
        xs: 0,
        md: 2,
      },
    },
    autocomplete: {
      marginTop: 2,
    },
    formField: { marginBottom: 2 },
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.container}>
        <Typography id="modal-title" variant="h6" sx={{ marginBottom: 3 }}>
          {isEdit ? "Editar pedido" : "Adicionar Pedido"}
        </Typography>

        <Box sx={styles.formContainer}>
          <Box sx={styles.leftSection}>
            <TextField
              fullWidth
              label="Nome do Cliente"
              name="customer_name"
              value={newOrder.customer_name}
              onChange={handleChange}
              margin="dense"
              sx={styles.formField}
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
              sx={styles.formField}
            />
            <TextField
              fullWidth
              label="Email do Cliente (Opcional)"
              name="customer_email"
              value={newOrder.customer_email}
              onChange={handleChange}
              margin="dense"
              sx={styles.formField}
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
              sx={styles.formField}
            />
          </Box>

          <Box sx={styles.rightSection}>
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
              renderInput={(params) => (
                <TextField {...params} label="Validade" />
              )}
            />

            {isEdit && newOrder.created_at && (
              <TextField
                fullWidth
                label="Data do Pedido"
                value={formatISODate(newOrder.created_at)}
                margin="dense"
                disabled
                sx={{
                  marginTop: 2,
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
                  },
                }}
              />
            )}
          </Box>
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
