import { Col, Form, Row } from "react-bootstrap";
import { handleChange } from "../../functions/functions";
import { UseAuth } from "../../../config/authContext";

/* eslint-disable react/prop-types */
function VendorInfo({ data, setterData, windowSize }) {
  const auth = UseAuth();
  const vendorInfo = [
    {
      id: "floatingNoRef",
      name: "noRef",
      value: data.noRef,
      placeholder: "No. Ref. Vendor",
    },
    {
      id: "floatingNoPolisi",
      name: "noPolisi",
      value: data.noPolisi,
      placeholder: "No. Polisi Kendaraan",
    },
    {
      id: "floatingDriver",
      name: "driver",
      value: data.driver,
      placeholder: "Nama Driver",
    },
  ];

  return (
    <Row>
      {vendorInfo.map((info, index) => (
        <Col xs={windowSize.width >= 768 ? "" : "0"} key={index}>
          <Form.Floating className={windowSize.width >= 768 ? "" : "mb-2"}>
            <Form.Control
              id={info.id}
              type="text"
              name={info.name}
              value={info.value || ""}
              placeholder={info.placeholder}
              onChange={
                auth.origin === data.origin && data.status === "Menunggu Vendor"
                  ? (event) =>
                      handleChange({
                        e: event,
                        state: data,
                        stateSetter: setterData,
                      })
                  : () => {}
              }
              disabled={
                auth.origin === data.origin && data.status === "Menunggu Vendor"
                  ? false
                  : true
              }
            ></Form.Control>
            <label htmlFor={info.id}>{info.placeholder}</label>
          </Form.Floating>
        </Col>
      ))}
    </Row>
  );
}

export default VendorInfo;
