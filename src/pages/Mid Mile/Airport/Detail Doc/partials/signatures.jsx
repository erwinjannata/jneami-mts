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
      name: data.driverName,
    },
    {
      label: "Petugas Bandara",
      source: data.airportSign || "",
      alts: "Petugas Bandara",
      name: data.airportUser,
    },
    {
      label: "Gudang Bandara",
      source: data.gudangSign || "",
      alts: "Gudang Bandaras",
      name: data.gudangUser,
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
