import CustomInput from "@/components/CustomInput";
import { useAuthStore } from "@/stores/authStore";
import Logo from "@assets/eye-center-logo.svg";
import "@css/SignIn.css";
import { zodResolver } from "@hookform/resolvers/zod";
import SignInSchema from "@schemas/SignInSchema";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type FormData = z.infer<typeof SignInSchema>;

type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleLogin = useCallback(
    async (data: FormData) => {
      await login(data);
      navigate("/home", { replace: true });
    },
    [login, navigate]
  );

  const onSubmit = async (data: FormData) => {
    try {
      await toast.promise(
        handleLogin(data),
        {
          loading: "Fazendo login...",
          success: <b>Login realizado com sucesso!</b>,
          error: <b>Usuário e/ou senha incorretos :(</b>,
        },
        { duration: 1500 }
      );
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="root">
      <img src={Logo} alt="eye-center-logo" width={"25%"} />
      <section className="main-section">
        <div className="text-container">
          <h1 className="welcome-text">SEJA BEM VINDO</h1>
          <h2 className="sign-in-text">Entre na sua conta</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="inputs-container"
          noValidate
        >
          <CustomInput
            label="E-mail"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            onChange={() => clearErrors("email")}
          />

          <CustomInput
            label="Senha"
            type={showPassword ? "text" : "password"}
            isPasswordInput
            showPassword={showPassword}
            onClickIcon={toggleShowPassword}
            {...register("password", {
              onBlur: () => {},
            })}
            error={errors.password?.message}
            onChange={() => clearErrors("password")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          />

          <div className="submit-container">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SignIn;
