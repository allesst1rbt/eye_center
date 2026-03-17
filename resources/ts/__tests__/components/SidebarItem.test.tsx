import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SidebarItem from "../../components/SidebarItem";

describe("SidebarItem", () => {
  test("renders item name", () => {
    render(<SidebarItem itemName="Dashboard" onClick={jest.fn()} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renders children", () => {
    render(
      <SidebarItem itemName="Dashboard" onClick={jest.fn()}>
        <span data-testid="icon">icon</span>
      </SidebarItem>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  test("calls onClick when item is clicked", async () => {
    const onClick = jest.fn();
    render(<SidebarItem itemName="Dashboard" onClick={onClick} />);

    await userEvent.click(screen.getByText("Dashboard"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("renders without children", () => {
    render(<SidebarItem itemName="Settings" onClick={jest.fn()} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});
