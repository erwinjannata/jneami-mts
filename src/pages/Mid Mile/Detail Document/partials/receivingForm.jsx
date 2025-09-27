/* eslint-disable react/prop-types */

import { useRef } from "react";
import { Button, FloatingLabel, Form, InputGroup } from "react-bootstrap";
import { handleChange } from "../../../../components/functions/functions";
import { FaCheck, FaPen } from "react-icons/fa6";
import { handleAction, handleEdit } from "./functions";

function ReceivingForm({ document, bags, setToast, state, setState }) {
  const inputRef = useRef(null);

  return document.status === "Received" ||
    document.status === "Received*" ? null : (
    <div>
      <InputGroup className="mb-3">
        <FloatingLabel controlId="floatingInput" label="Bag No.">
          <Form.Control
            type="text"
            placeholder="Bag No."
            name="searched"
            value={state.searched}
            ref={inputRef}
            onChange={(event) =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
          />
        </FloatingLabel>
        <Button
          variant="primary"
          className="w-"
          onClick={() =>
            handleAction({
              state: state,
              setState: setState,
              bagList: bags,
              document: document,
              setToast: setToast,
              statusBag: "Standby",
            })
          }
        >
          <FaCheck />
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() =>
            handleEdit({
              state: state,
              setState: setState,
              bagList: bags,
            })
          }
        >
          <FaPen />
        </Button>
      </InputGroup>
      <hr />
    </div>
  );
}

export default ReceivingForm;
