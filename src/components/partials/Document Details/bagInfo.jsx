/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";

function BagInfo({ bagList }) {
  const documentInfo = [
    {
      label: "Koli",
      value: bagList.reduce((prev, next) => {
        return prev + parseInt(next.koli);
      }, 0),
    },
    {
      label: "Pcs",
      value: bagList.reduce((prev, next) => {
        return prev + parseInt(next.pcs);
      }, 0),
    },
    {
      label: "Weight",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.weight);
      }, 0)} Kg`,
    },
  ];

  return (
    <Row className="mt-2">
      {documentInfo.map((info, index) => (
        <Col key={index}>
          <Row>
            <strong>{info.label}</strong>
            <p>{info.value}</p>
          </Row>
        </Col>
      ))}
    </Row>
  );
}

export default BagInfo;
