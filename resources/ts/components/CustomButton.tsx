interface CustomButtonProps {
  onClick: () => void;
  label: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export default function CustomButton({
  onClick,
  label,
  style,
  disabled = false,
}: CustomButtonProps) {
  return (
    <button style={style} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
