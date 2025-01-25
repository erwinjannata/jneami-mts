/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";

const DocInfo = ({ bagList }) => {
  const documentInfo = [
    {
      label: "Total Pcs",
      value: `${bagList.length}`,
    },
    {
      label: "Total Koli",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.koli);
      }, 0)}`,
    },
    {
      label: "Total Weight",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.weight);
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
};

export default DocInfo;
