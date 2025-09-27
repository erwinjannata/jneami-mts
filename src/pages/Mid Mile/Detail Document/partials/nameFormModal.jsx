/* eslint-disable react/prop-types */
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { handleChange } from "../../../../components/functions/functions";

const NameFormModal = ({
  userText,
  show,
  state,
  setState,
  formFor,
  onHide,
  onSubmit,
}) => {
  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => {
        onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="contained-modal-title-vcenter">
          {`Data ${userText}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FloatingLabel controlId="floatingInput" label={`Nama ${userText}`}>
          <Form.Control
            type="text"
            placeholder={`Nama ${userText}`}
            name={formFor}
            autoFocus
            onChange={() => {
              handleChange({
                e: event,
                state: state,
                stateSetter: setState,
              });
            }}
          />
        </FloatingLabel>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={async () => {
            onSubmit();
            await onHide();
          }}
        >
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NameFormModal;
