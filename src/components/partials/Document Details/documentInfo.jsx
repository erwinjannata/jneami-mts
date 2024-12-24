import moment from "moment";
import { Col, Row } from "react-bootstrap";

/* eslint-disable react/prop-types */
function DocumentInfo({ data }) {
  const dataDisplay = [
    [
      { label: "No. Surat", value: data.noSurat },
      { label: "Status", value: data.status },
    ],
    [
      { label: "Origin", value: data.origin },
      { label: "Destination", value: data.destination },
    ],
    [
      { label: "Approved by", value: data.preparedBy },
      {
        label: "Received by",
        value: data.isReceived ? `${data.receivedBy}` : "-",
      },
    ],
    [
      {
        label: "Approved at",
        value: `${moment(data.approvedDate).locale("id").format("LL")} ${
          data.approvedTime
        }`,
      },
      {
        label: "Received at",
        value: data.isReceived
          ? `${moment(data.receivedDate).locale("id").format("LL")} ${
              data.receivedTime
            }`
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
              {display[0].value}
            </Col>
            <Col>
              <strong>{display[1].label}</strong> <br />
              {display[1].value}
            </Col>
          </Row>
          <hr />
        </div>
      ))}
    </Row>
  );
}

export default DocumentInfo;
