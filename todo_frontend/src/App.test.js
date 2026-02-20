import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the todo app title", () => {
  render(<App />);
  const title = screen.getByText(/my tasks/i);
  expect(title).toBeInTheDocument();
});
