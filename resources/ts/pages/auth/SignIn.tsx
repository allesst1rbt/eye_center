import styles from "@css/SignIn.module.css";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
    const [isClient, setIsClient] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Entre na sua conta</h1>
                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.toggleButton} ${
                                isClient ? styles.active : ""
                            }`}
                            onClick={() => setIsClient(true)}
                        >
                            Sou cliente
                        </button>
                        <button
                            className={`${styles.toggleButton} ${
                                !isClient ? styles.active : ""
                            }`}
                            onClick={() => setIsClient(false)}
                        >
                            Sou funcionário
                        </button>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input type="email" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Senha</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={styles.input}
                            />
                            <button
                                className={styles.eyeButton}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <a href="#" className={styles.forgotPassword}>
                        Esqueci a senha
                    </a>
                    <button className={styles.submitButton}>Entrar</button>
                    <p className={styles.newUser}>
                        Novo aqui?{" "}
                        <a href="#" className={styles.bold}>
                            Solicite seu acesso
                        </a>
                    </p>
                </div>
                <div className={styles.imageContainer}></div>
            </div>
        </div>
    );
};

export default SignIn;
