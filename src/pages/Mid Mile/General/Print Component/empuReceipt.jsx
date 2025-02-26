/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import moment from "moment";
import { Col, Row, Table } from "react-bootstrap";
import { UseAuth } from "../../../../config/authContext";

const EMPUReceipt = ({ data, customerList }) => {
  const d = new Date();
  const auth = UseAuth();
  const date = moment(d).locale("en-sg").format("LLL");

  let idx = customerList.findIndex(
    (customer) => customer.key === data.customerId
  );

  return (
    <div
      className="my-4 p-4"
      id="printContent"
      style={{ maxWidth: "300px", breakAfter: "page" }}
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
        <Table borderless>
          <thead>
            <tr>
              <th className="w-auto"></th>
              <th className="w-75"></th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "12px" }}>
            <tr>
              <td>AWB</td>
              <td>
                <strong>{`: ${data.awb}`}</strong>
              </td>
            </tr>
            <tr>
              <td>Customer</td>
              <td>{`: ${customerList[idx].customerName}`}</td>
            </tr>
            <tr>
              <td>Pieces</td>
              <td>{`: ${data.pcs}`}</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>{`: ${data.weight} Kg`}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>{`: Rp. ${Intl.NumberFormat().format(data.amount)}`}</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <strong>
                  <p>Keterangan:</p>
                </strong>
                <p className="text-wrap">{data.keterangan || "-"}</p>
              </td>
            </tr>
          </tbody>
        </Table>
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
    </div>
  );
};

export default EMPUReceipt;
