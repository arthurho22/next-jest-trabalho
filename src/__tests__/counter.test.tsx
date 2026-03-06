import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "@/components/Counter";

describe("Counter component", () => {

  it("should render initial value", () => {

    render(<Counter />);

    expect(
      screen.getByText("Count: 0")
    ).toBeInTheDocument();

  });

  it("should increment when button is clicked", async () => {

    render(<Counter />);

    const button = screen.getByRole("button", {
      name: /increment/i
    });

    await userEvent.click(button);

    expect(
      screen.getByText("Count: 1")
    ).toBeInTheDocument();

  });

});

