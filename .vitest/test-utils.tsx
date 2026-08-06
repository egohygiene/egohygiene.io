import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export function renderWithRouter(element: ReactElement, route = "/") {
  return render(<MemoryRouter initialEntries={[route]}>{element}</MemoryRouter>);
}
