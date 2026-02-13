import { render, screen, fireEvent } from "@testing-library/react";
import { ProductForm } from "./product-form";

describe("ProductForm", () => {
  it("renders create mode with all core fields", () => {
    render(<ProductForm mode="create" />);

    expect(screen.getByRole("heading", { name: /create product/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/featured image/i)).toBeInTheDocument();
  });

  it("submits the form and shows a demo submission message", () => {
    render(<ProductForm mode="create" />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test product" },
    });
    fireEvent.change(screen.getByLabelText(/slug/i), {
      target: { value: "test-product" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "19.99" },
    });
    fireEvent.change(screen.getByLabelText(/stock/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A simple test product" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /create product/i }));

    expect(
      screen.getByText(/this is a demo submission/i),
    ).toBeInTheDocument();
  });
});

