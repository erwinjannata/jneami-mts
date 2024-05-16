import { Toast, ToastContainer } from "react-bootstrap";

export default function ToastWarning(item) {
  return (
    <ToastContainer
      className="p-3 position-fixed"
      position="top-end"
      style={{ zIndex: 1 }}
    >
      <Toast show={true} bg="dark">
        <Toast.Header closeButton={false}>
          <strong className="me-auto">JNE E-Manifest Transit</strong>
        </Toast.Header>
        <Toast.Body className="text-white">
          <strong>{item.item}</strong> surat manifest terindikasi melewati Cut
          Off Time, segera periksa data
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
