import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./style.css";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    isPasswordInput?: boolean;
    showPassword?: boolean;
    onClickIcon?: () => void;
    onForgotPassword?: () => void;
    error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    isPasswordInput = false,
    showPassword,
    onClickIcon,
    onForgotPassword,
    error,
    ...props
}) => {
    return (
        <div className="input-container">
            <label className="label">{label}</label>
            <div className="input-wrapper">
                <input
                    className={`input ${error ? "input-error" : ""}`}
                    {...props}
                />
                {isPasswordInput && onClickIcon && (
                    <span className="password-icon" onClick={onClickIcon}>
                        {showPassword ? (
                            <FaEyeSlash size={20} />
                        ) : (
                            <FaEye size={20} />
                        )}
                    </span>
                )}
            </div>
            {error && <span className="error-message">{error}</span>}
            {isPasswordInput && onForgotPassword && (
                <span className="forgot-password" onClick={onForgotPassword}>
                    Esqueci a senha
                </span>
            )}
        </div>
    );
};

export default CustomInput;
