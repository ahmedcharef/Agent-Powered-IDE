import { render, screen } from "@testing-library/react";
import OrdersPage from "./page";

describe("OrdersPage", () => {
  it("renders heading and description", () => {
    render(<OrdersPage />);

    expect(screen.getByRole("heading", { name: /order history/i })).toBeInTheDocument();
    expect(
      screen.getByText(/past orders, check their status, and keep track of your purchases/i),
    ).toBeInTheDocument();
  });

  it("renders a table of orders from mock data", () => {
    render(<OrdersPage />);

    // Table headers
    expect(screen.getByText(/order/i)).toBeInTheDocument();
    expect(screen.getByText(/date/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/total/i)).toBeInTheDocument();

    // Mock orders
    expect(screen.getByText("ORD-1001")).toBeInTheDocument();
    expect(screen.getByText("ORD-1002")).toBeInTheDocument();
    expect(screen.getByText("$129.00")).toBeInTheDocument();
    expect(screen.getByText("$59.00")).toBeInTheDocument();
  });
});

