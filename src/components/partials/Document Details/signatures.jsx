/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";

function Signatures({ data }) {
  const signatures = [
    {
      label: "Prepared by",
      source: data.checkerSign,
      alts: "Prepared by",
      name: data.preparedBy,
    },
    {
      label: "Driver",
      source: data.vendorSign || "",
      alts: "Driver Sign",
      name: data.driver,
    },
    {
      label: "Received by",
      source: data.receiverSign,
      alts: "Received by",
      name: data.receivedBy,
    },
  ];

  return (
    <Row>
      {signatures.map((item, index) => (
        <Col className="signatures" key={index}>
          <p>
            <strong>{item.label}</strong>
          </p>
          {item.source == "" ? null : (
            <>
              <img className="signature" src={item.source} alt={item.alts} />
              <p>{item.name}</p>
            </>
          )}
        </Col>
      ))}
    </Row>
  );
}

export default Signatures;
