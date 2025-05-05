/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./../../../../index.css";
import { Col, Container, Row, Table } from "react-bootstrap";
import moment from "moment";
import { UseAuth } from "../../../../config/authContext";

const MidMilePrintContent = ({ data }) => {
  const auth = UseAuth();
  const d = new Date();
  const date = moment(d).locale("en-sg").format("LLL");

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
      label: "Petugas EMPU",
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
      <div
        style={{
          borderBottom: "2px solid black",
          borderTop: "2px solid black",
          paddingTop: "10px",
        }}
      >
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
      <Table borderless size="sm" style={{ fontSize: "10px" }}>
        <tbody>
          <tr>
            <td>{auth.name}</td>
            <td className="text-end">{date}</td>
          </tr>
        </tbody>
      </Table>
      <hr style={{ color: "white" }} />
      <hr style={{ color: "white" }} />
    </div>
  );
};

export default MidMilePrintContent;
