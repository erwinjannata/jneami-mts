import moment from "moment";
import { Col, Row } from "react-bootstrap";

/* eslint-disable react/prop-types */
function MTSDocumentInfo({ data }) {
  const dataDisplay = [
    [
      { label: "ORIGIN", value: data.origin },
      { label: "DESTINATION", value: data.destination },
    ],
    [
      { label: "USER MTS", value: data.mtsUser },
      {
        label: "USER MTI",
        value: data.mtiUser ? data.mtiUser : "-",
      },
    ],
    [
      {
        label: "FIRST MTS DATE",
        value: `${moment(Date.parse(data.mtsDate))
          .locale("en-sg")
          .format("LLL")}`,
      },
      {
        label: "FIRST MTI DATE",
        value: data.mtiDate
          ? `${moment(Date.parse(data.mtiDate)).locale("en-sg").format("LLL")}`
          : "-",
      },
    ],
  ];

  return (
    <Row>
      {dataDisplay.map((display, index) => (
        <div key={index}>
          <Row>
            <Col>
              <strong>{display[0].label}</strong> <br />
              <p>{display[0].value}</p>
            </Col>
            <Col>
              <strong>{display[1].label}</strong> <br />
              <p>{display[1].value}</p>
            </Col>
          </Row>
          <hr />
        </div>
      ))}
    </Row>
  );
}

export default MTSDocumentInfo;
