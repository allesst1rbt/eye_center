import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignIn from "../../pages/auth/SignIn";
import { useAuthStore } from "../../stores/authStore";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../stores/authStore");

jest.mock("react-hot-toast", () => ({
  promise: jest.fn(async (promise) => {
    await promise;
  }),
  error: jest.fn(),
}));

const mockedUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

const mockLogin = jest.fn();

describe("SignIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuthStore.mockReturnValue({
      login: mockLogin,
      token: null,
      user: null,
      logout: jest.fn(),
    });
  });

  test("renders email and password labels", () => {
    render(<SignIn />);
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Senha")).toBeInTheDocument();
  });

  test("renders submit button", () => {
    render(<SignIn />);
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  test("shows validation error for empty email on submit", async () => {
    render(<SignIn />);

    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
    });
  });

  test("shows validation error for invalid email", async () => {
    render(<SignIn />);

    await userEvent.type(screen.getByLabelText(/e-mail/i) ?? screen.getAllByRole("textbox")[0], "notanemail");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
    });
  });

  test("shows validation error for short password", async () => {
    render(<SignIn />);

    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0], "test@test.com");

    const passwordInput = document.querySelector("input[type='password']") as HTMLElement;
    await userEvent.type(passwordInput, "123");

    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/pelo menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  test("calls login with correct credentials on valid submit", async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<SignIn />);

    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0], "test@test.com");

    const passwordInput = document.querySelector("input[type='password']") as HTMLElement;
    await userEvent.type(passwordInput, "123456");

    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "123456",
      });
    });
  });

  test("navigates to /home on successful login", async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<SignIn />);

    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0], "test@test.com");

    const passwordInput = document.querySelector("input[type='password']") as HTMLElement;
    await userEvent.type(passwordInput, "123456");

    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
    });
  });
});
