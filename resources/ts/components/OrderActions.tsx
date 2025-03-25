import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface OrderActionsProps {
  orderId: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function OrderActions({
  orderId,
  onEdit,
  onDelete,
}: OrderActionsProps) {
  return (
    <>
      <IconButton onClick={() => onEdit(orderId)} color="primary">
        <Edit />
      </IconButton>
      <IconButton onClick={() => onDelete(orderId)} color="error">
        <Delete />
      </IconButton>
    </>
  );
}
