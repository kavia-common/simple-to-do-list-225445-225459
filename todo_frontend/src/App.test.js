import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the Retro To-do title", () => {
  render(<App />);
  const title = screen.getByText(/retro to‑do/i);
  expect(title).toBeInTheDocument();
});
