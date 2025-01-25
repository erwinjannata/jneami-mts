/* eslint-disable react/prop-types */
import moment from "moment";
import { Col, Row, Spinner } from "react-bootstrap";

const MidMileDocInfo = ({ docData, loading }) => {
  const infos = [
    [
      { label: `Inbound Station: `, value: docData.inboundUser },
      {
        label: `Submit Date: `,
        value: moment(Date.parse(docData.submittedDate))
          .locale("en-sg")
          .format("LLL"),
      },
    ],
    [
      { label: `Admin Airport: `, value: docData.inboundUser },
      {
        label: `Approve Date: `,
        value:
          docData.approvedDate === undefined
            ? "-"
            : moment(Date.parse(docData.approvedDate))
                .locale("en-sg")
                .format("LLL"),
      },
    ],
    [
      { label: `Status: `, value: docData.status },
      {
        label:
          docData.status === "Received"
            ? `Received Date: `
            : `Lastest Update: `,
        value:
          docData.latestUpdateDate === undefined
            ? "-"
            : moment(Date.parse(docData.latestUpdateDate))
                .locale("en-sg")
                .format("LLL"),
      },
    ],
  ];

  return (
    <Row>
      {infos.map((info, index) => {
        return (
          <div key={index}>
            <Row>
              <Col>
                <strong>{info[0].label}</strong>
                <br />
                {loading ? (
                  <Spinner animation="grow" size="sm" />
                ) : (
                  info[0].value
                )}
              </Col>
              <Col>
                <strong>{info[1].label}</strong>
                <br />
                {loading ? (
                  <Spinner animation="grow" size="sm" />
                ) : (
                  info[1].value
                )}
              </Col>
            </Row>
            {index === 2 ? null : <hr style={{ color: "white" }} />}
          </div>
        );
      })}
    </Row>
  );
};

export default MidMileDocInfo;
