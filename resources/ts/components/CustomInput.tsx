import "@css/CustomInput.css";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isPasswordInput?: boolean;
  showPassword?: boolean;
  onClickIcon?: () => void;
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  isPasswordInput = false,
  showPassword,
  onClickIcon,
  error,
  ...props
}) => {
  return (
    <div className="input-container">
      <label className="label">{label}</label>
      <div className="input-wrapper">
        <input className={`input ${error ? "input-error" : ""}`} {...props} />
        {isPasswordInput && onClickIcon && (
          <span className="password-icon" onClick={onClickIcon}>
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default CustomInput;
