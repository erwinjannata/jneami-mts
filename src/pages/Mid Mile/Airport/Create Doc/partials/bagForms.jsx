/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { handleChange } from "./../../../../../components/functions/functions";

const BagInfoForms = ({
  state,
  setState,
  bagList,
  setBagList,
  handlerSubmit,
  windowSize,
}) => {
  let formsList = [
    {
      name: "manifestNo",
      text: "Manifest No.",
      type: "text",
      xs: "",
      value: state.manifestNo,
    },
    {
      name: "koli",
      text: "Koli",
      type: "number",
      xs: "",
      value: state.koli,
    },
    {
      name: "pcs",
      text: "Pcs",
      type: "number",
      xs: "",
      value: state.pcs,
    },
    {
      name: "kg",
      text: "Kg",
      type: "number",
      xs: "",
      value: state.kg,
    },
    {
      name: "remark",
      text: "Remark",
      type: "text",
      xs: "",
      value: state.remark,
    },
  ];

  return (
    <Form
      onSubmit={() =>
        handlerSubmit({
          event: event,
          state: state,
          setState: setState,
          bagList: bagList,
          setBagList: setBagList,
        })
      }
    >
      <Row>
        {formsList.map((item, index) => (
          <Col
            key={index}
            xs={windowSize.width >= 1024 ? item.xs : "0"}
            className={windowSize.width > 1024 ? "" : "mb-3"}
          >
            <FloatingLabel
              controlId={`floatingInput${index}`}
              label={item.text}
            >
              <Form.Control
                type={item.type}
                name={item.name}
                placeholder={item.text}
                value={item.value}
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
              />
            </FloatingLabel>
          </Col>
        ))}
      </Row>
      <Row>
        <div className="d-grid gap-2">
          <Button
            type="submit"
            className="mb-2"
            variant="outline-primary"
            onClick={() =>
              handlerSubmit({
                event: event,
                state: state,
                setState: setState,
                bagList: bagList,
                setBagList: setBagList,
              })
            }
            id="submitBtn"
          >
            Add
          </Button>
        </div>
      </Row>
    </Form>
  );
};

export default BagInfoForms;
