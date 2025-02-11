/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";

const BagInfo = ({ bagList }) => {
  return (
    <Row className="mt-4">
      <Col xs={4} md={4}>
        <p>
          <strong>Pcs</strong>
          <br />
          {bagList.length}
        </p>
      </Col>
      <Col xs={4} md={4}>
        <p>
          <strong>Total Koli</strong>
          <br />
          {`${bagList.reduce((prev, next) => {
            return prev + parseInt(next.koli);
          }, 0)} koli`}
        </p>
      </Col>
      <Col xs={4} md={4}>
        <p>
          <strong>Total Weight</strong>
          <br />
          {`${bagList.reduce((prev, next) => {
            return prev + parseInt(next.weight);
          }, 0)} Kg`}
        </p>
      </Col>
    </Row>
  );
};

export default BagInfo;
