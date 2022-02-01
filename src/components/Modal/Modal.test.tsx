import React from "react";
import { render } from "@testing-library/react";
import { Modal } from "./Modal";

const noop = () => {};

test("renders a title and content", () => {
  const { getByText } = render(
    <Modal onClose={noop} title="hello world" open>
      goodbye
    </Modal>
  );
  expect(getByText("hello world")).toBeInTheDocument();
  expect(getByText("goodbye")).toBeInTheDocument();
});

test("does not render when closed", () => {
  const { queryByText } = render(
    <Modal onClose={noop} open={false} title="hello world">
      goodbye
    </Modal>
  );
  expect(queryByText("hello world")).not.toBeInTheDocument();
});
