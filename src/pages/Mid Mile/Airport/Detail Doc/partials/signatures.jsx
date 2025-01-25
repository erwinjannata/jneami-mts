/* eslint-disable react/prop-types */

import { Col, Row } from "react-bootstrap";

const MidMileDocSignatures = ({ data }) => {
  const signatures = [
    {
      label: "Inbound Station",
      source: data.inboundSign,
      alts: "Inbound Station",
      name: data.inboundUser,
    },
    {
      label: "Driver",
      source: data.driverSign || "",
      alts: "Driver",
      name: "Driver",
    },
    {
      label: "Admin Airport",
      source: data.airportSign || "",
      alts: "Admin Airport",
      name: data.airportUser,
    },
  ];

  return (
    <Row className="mt-5">
      {signatures.map((item, index) => (
        <Col className="signatures" key={index}>
          <p>
            <strong>{item.label}</strong>
          </p>
          {item.source == "" ? null : (
            <>
              <div className="canvas">
                <img className="signature" src={item.source} alt={item.alts} />
              </div>
              <p>{item.name}</p>
            </>
          )}
        </Col>
      ))}
    </Row>
  );
};

export default MidMileDocSignatures;
