import React from "react";
import { render, act } from "@testing-library/react";
import App from "./App";

test("renders settings button", async () => {
  const promise = Promise.resolve();
  const { getByText } = render(<App />);
  await act(() => promise);
  const settingsBtn = getByText(/settings/i);
  expect(settingsBtn).toBeInTheDocument();
});
