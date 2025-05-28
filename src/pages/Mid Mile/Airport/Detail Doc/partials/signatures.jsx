/* eslint-disable react/prop-types */

import { Col, Row } from "react-bootstrap";

const MidMileDocSignatures = ({ data }) => {
  const signatures = [
    {
      label: "Petugas EMPU",
      source: data.airportSign || "",
      alts: "Petugas EMPU",
      name: data.airportUser,
    },
    {
      label: "Checker Bandara",
      source: data.gudangSign || "",
      alts: "Checker Bandara",
      name: data.gudangUser,
    },
    {
      label: "Driver",
      source: data.driverSign || "",
      alts: "Driver",
      name: data.driverName,
    },
    {
      label: "Inbound Station",
      source: data.inboundSign || "",
      alts: "Inbound Station",
      name: data.inboundUser,
    },
  ];

  return (
    <Row className="mt-5">
      {signatures.map((item, index) => (
        <Col className="signatures" key={index} xs={6} md={3}>
          <p style={{ fontWeight: "bolder" }}>{item.label}</p>
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
