import * as React from "react";
import "./Modal.css";
import { ReactComponent as CloseIcon } from "./close-line.svg";

interface ModalProps {
  open?: boolean;
  children?: React.ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
}

export const Modal = (props: ModalProps) => {
  const { title, children, onClose, onSubmit } = props;
  
  return (
    <>
      <div className="modal" id="modal">
        <div className="header">
          <h2>{title}</h2>
          <CloseIcon onClick={onClose} />
        </div>
        <div className="content">{children}</div>
        <div className="actions">
          <button onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
      <div className="modal-bg" onClick={onClose}></div>
    </>
  );
};
