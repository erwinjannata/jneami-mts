/* eslint-disable react/prop-types */
import { Toast, ToastContainer } from "react-bootstrap";

export default function ToastWarning({ toast, setToast }) {
  return (
    <ToastContainer className="p-3 position-fixed" position="bottom-end">
      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        bg="light"
        delay={10000}
        autohide
      >
        <Toast.Header
          className={`${
            toast.header === "Warning" ? "bg-danger" : "bg-success"
          } text-light`}
        >
          <strong className="me-auto">{toast.header}</strong>
        </Toast.Header>
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
