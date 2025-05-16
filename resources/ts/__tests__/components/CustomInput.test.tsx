import { render } from "@testing-library/react";
import CustomInput from "../../components/CustomInput";

jest.mock("@css/CustomInput.css", () => ({}));

describe("CustomInput", () => {
  test("renders with correct label", () => {
    const { getByText } = render(<CustomInput label="Email" />);
    expect(getByText("Email")).toBeInTheDocument();
  });

  test("renders input with correct attributes", () => {
    const { getByTestId } = render(
      <CustomInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        data-testid="email-input"
      />
    );

    const input = getByTestId("email-input");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "Enter your email");
  });

  test("displays error message when provided", () => {
    const { getByText } = render(
      <CustomInput label="Email" error="Email is required" />
    );
    expect(getByText("Email is required")).toBeInTheDocument();
  });

  test("adds error class to input when error is provided", () => {
    const { getByTestId } = render(
      <CustomInput
        label="Email"
        error="Email is required"
        data-testid="email-input"
      />
    );

    const input = getByTestId("email-input");
    expect(input.className).toContain("input-error");
  });

  test("renders password toggle icon for password inputs", () => {
    const onClickIcon = jest.fn();
    const { container } = render(
      <CustomInput
        label="Password"
        type="password"
        isPasswordInput
        showPassword={false}
        onClickIcon={onClickIcon}
      />
    );

    const icon = container.querySelector(".password-icon");
    expect(icon).toBeInTheDocument();
  });

  test("calls onClickIcon when password icon is clicked", () => {
    const onClickIcon = jest.fn();
    const { container } = render(
      <CustomInput
        label="Password"
        type="password"
        isPasswordInput
        showPassword={false}
        onClickIcon={onClickIcon}
      />
    );

    const icon = container.querySelector(".password-icon");
    icon?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClickIcon).toHaveBeenCalledTimes(1);
  });
});
