/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./../../../../index.css";
import { Col, Container, Row, Table } from "react-bootstrap";
import moment from "moment";

const MidMilePrintContent = ({ data }) => {
  const tableContent = [
    { label: "Document No.", value: data.documentNumber },
    { label: "QTY", value: `${data.totalPcs} Pcs` },
    { label: "Koli", value: `${data.totalKoli} Koli` },
    { label: "Weight", value: `${data.totalWeight} Kg` },
    {
      label: "Transported Date",
      value:
        data.transportedDate === undefined
          ? "-"
          : moment(Date.parse(data.transportedDate))
              .locale("en-sg")
              .format("lll"),
    },
    {
      label: "Admin Airport",
      value: data.airportUser === undefined ? "-" : data.airportUser,
    },
  ];

  return (
    <div className="my-4 p-4" id="printContent" style={{ maxWidth: "300px" }}>
      <br />
      <Row className="mt-4">
        <Col style={{ fontSize: "14px" }}>
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
      <div style={{ borderBottom: "1px solid black" }}>
        {tableContent.map((content, index) => (
          <Row key={index} style={{ fontSize: "11px" }}>
            <Col>
              <p>{content.label}</p>
            </Col>
            <Col>
              {index === 0 ? (
                <p>
                  {`: `}
                  <strong>{`${content.value}`}</strong>
                </p>
              ) : (
                <p>{`: ${content.value}`}</p>
              )}
            </Col>
          </Row>
        ))}
      </div>
      <hr style={{ color: "white" }} />
    </div>
  );
};

export default MidMilePrintContent;
