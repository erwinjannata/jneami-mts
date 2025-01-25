/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";

const BagInfo = ({ data }) => {
  return (
    <Row className="mt-4">
      <Col>
        <p>
          <strong>Pcs</strong>
          <br />
          {data.totalPcs}
        </p>
      </Col>
      <Col>
        <p>
          <strong>Total Koli</strong>
          <br />
          {`${data.totalKoli}`}
        </p>
      </Col>
      <Col>
        <p>
          <strong>Total Weight</strong>
          <br />
          {`${data.totalWeight} kg`}
        </p>
      </Col>
    </Row>
  );
};

export default BagInfo;
