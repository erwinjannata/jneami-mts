/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function RemarkModal(props) {
  const [remark, setRemark] = useState("");

  const handleChange = (e) => {
    setRemark(e.target.value);
    props.getvalue(e.target.value);
  };

  const handleSubmit = () => {
    props.setvalue();
    props.getfocus("");
    setRemark("");
    props.onHide();
  };

  return (
    <>
      <Modal
        centered
        scrollable
        backdrop="static"
        show={props.show}
        onHide={() => {
          setRemark(""), props.onHide();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                name="remark"
                as="textarea"
                rows={3}
                autoFocus={true}
                value={remark}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setRemark(""), props.onHide();
            }}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
