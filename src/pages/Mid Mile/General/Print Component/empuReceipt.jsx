/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import moment from "moment";
import { Col, Row } from "react-bootstrap";

const EMPUReceipt = ({ data }) => {
  const d = new Date();
  const date = moment(d).locale("en-sg").format("LLL");

  const tableContent = [
    { label: "AWB", value: data["No AWB"] },
    { label: "Status", value: data["Status"] },
    { label: "Qty", value: data["Pieces"] },
    { label: "Weight", value: data["Chw"] },
  ];

  return data.map((d, index) => (
    <div
      className="my-4 p-4"
      id="printContent"
      style={{ maxWidth: "300px", breakAfter: "page" }}
      key={index}
    >
      <br />
      <Row className="mt-4">
        <Col style={{ fontSize: "20px" }}>
          <strong>
            <p>PT. MERPATI LINTAS CAKRAWALA</p>
          </strong>
        </Col>
      </Row>
      <Row>
        <Col style={{ fontSize: "8px" }}>
          <p>
            Jl. Amir Hamzah No. 102 Mataram
            <br />
            Phone. (0370) 622040
            <br />
            Fax. (0370) 640345
          </p>
        </Col>
      </Row>
      <div
        style={{
          borderBottom: "2px solid black",
          borderTop: "2px solid black",
          paddingTop: "10px",
        }}
      >
        <Row style={{ fontSize: "13px" }}>
          <Col>AWB</Col>
          <Col>
            <p>
              <strong>{`: ${d["No AWB"]}`}</strong>
            </p>
          </Col>
        </Row>
        <Row style={{ fontSize: "13px" }}>
          <Col>Status</Col>
          <Col>
            <p>{`: ${d["Status"].toUpperCase()}`}</p>
          </Col>
        </Row>
        <Row style={{ fontSize: "13px" }}>
          <Col>Qty</Col>
          <Col>
            <p>{`: ${d["Pieces"]} of ${d["Pieces"]}`}</p>
          </Col>
        </Row>
        <Row style={{ fontSize: "13px" }}>
          <Col>Weight</Col>
          <Col>
            <p>{`: ${d["Chw"]} Kg`}</p>
          </Col>
        </Row>
      </div>
      <p style={{ fontSize: "11px", marginTop: "5px", textAlign: "right" }}>
        {date}
      </p>
      <hr style={{ color: "white" }} />
    </div>
  ));
};

export default EMPUReceipt;
