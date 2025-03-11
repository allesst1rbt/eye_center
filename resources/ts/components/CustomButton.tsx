interface CustomButtonProps {
  onClick: () => void;
  label: string;
  style?: React.CSSProperties;
}

export default function CustomButton({
  onClick,
  label,
  style,
}: CustomButtonProps) {
  return (
    <button style={style} onClick={onClick}>
      {label}
    </button>
  );
}
