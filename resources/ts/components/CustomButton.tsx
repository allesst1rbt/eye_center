interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function CustomButton({ label, ...props }: CustomButtonProps) {
  return <button {...props}>{label}</button>;
}
