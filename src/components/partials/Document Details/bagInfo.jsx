/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";

function BagInfo({ bagList }) {
  const documentInfo = [
    {
      label: "Total Koli",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.koli);
      }, 0)} koli`,
    },
    {
      label: "Total Pcs",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.pcs);
      }, 0)} pcs`,
    },
    {
      label: "Total Weight",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.kg);
      }, 0)} Kg`,
    },
  ];

  return (
    <Row className="mt-4">
      {documentInfo.map((info, index) => (
        <Col key={index}>
          <p>
            <strong>{info.label}</strong>
            <br />
            {info.value}
          </p>
        </Col>
      ))}
    </Row>
  );
}

export default BagInfo;
