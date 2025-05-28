/* eslint-disable react/prop-types */
import moment from "moment";
import { Col, Row, Spinner } from "react-bootstrap";

const MidMileDocInfo = ({ docData, loading }) => {
  const infos = [
    [
      { label: `Submit By: `, value: docData.submittedBy },
      {
        label: `Submit Date: `,
        value: moment(Date.parse(docData.submittedDate))
          .locale("en-sg")
          .format("LLL"),
      },
    ],
    [
      {
        label: `Approved By: `,
        value: docData.airportUser === undefined ? "-" : docData.airportUser,
      },
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
      { label: `Current Status: `, value: docData.status },
      {
        label:
          docData.status === "Received" ? `Received Date: ` : `Latest Update: `,
        value:
          docData.latestUpdate === ""
            ? "-"
            : moment(Date.parse(docData.latestUpdate))
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
