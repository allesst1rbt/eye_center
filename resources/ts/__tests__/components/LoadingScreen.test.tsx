import { render, screen } from "@testing-library/react";
import { LoadingScreen } from "../../components/LoadingScreen";

describe("LoadingScreen", () => {
  test("renders loading spinner", () => {
    render(<LoadingScreen />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("spinner has loading state", () => {
    render(<LoadingScreen />);
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
  });
});
