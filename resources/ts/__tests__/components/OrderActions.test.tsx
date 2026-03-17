import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderActions from "../../components/OrderActions";

describe("OrderActions", () => {
  test("renders two action buttons", () => {
    render(<OrderActions orderId={1} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  test("calls onEdit with correct orderId when edit is clicked", async () => {
    const onEdit = jest.fn();
    render(<OrderActions orderId={42} onEdit={onEdit} onDelete={jest.fn()} />);

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);

    expect(onEdit).toHaveBeenCalledWith(42);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  test("calls onDelete with correct orderId when delete is clicked", async () => {
    const onDelete = jest.fn();
    render(<OrderActions orderId={42} onEdit={jest.fn()} onDelete={onDelete} />);

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[1]);

    expect(onDelete).toHaveBeenCalledWith(42);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test("does not call onDelete when edit is clicked", async () => {
    const onDelete = jest.fn();
    render(<OrderActions orderId={1} onEdit={jest.fn()} onDelete={onDelete} />);

    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);

    expect(onDelete).not.toHaveBeenCalled();
  });
});
