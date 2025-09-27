/* eslint-disable react/prop-types */
import "./../../../../index.css";
import { Col, Row, Table } from "react-bootstrap";
import moment from "moment";
import { UseAuth } from "../../../../config/authContext";

const MidMilePrintContent = ({ data }) => {
  const auth = UseAuth();
  const date = moment(new Date()).locale("en-sg").format("LLL");

  const tableContent = [
    { label: "Document No.", value: data.documentNumber },
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
          paddingTop: "8px",
        }}
      >
        <Table borderless size="sm">
          <tbody>
            {tableContent.map((content, index) => (
              <tr key={index} style={{ fontSize: "11px" }}>
                <td>
                  <p>{content.label}</p>
                </td>
                <td>
                  {index === 0 ? (
                    <p>
                      {`: `}
                      <strong>{`${content.value}`}</strong>
                    </p>
                  ) : (
                    <p>{`: ${content.value}`}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Table borderless size="sm" style={{ fontSize: "8px" }}>
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
