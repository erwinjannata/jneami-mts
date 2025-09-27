/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import moment from "moment";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import firebase from "../../../config/firebase";
import LoadingAnimation from "../../../components/partials/loading";
import NotFound from "../../../components/partials/notFound";

const CreditTable = ({ awbList, customerList }) => {
  const [loading, setLoading] = useState(false);

  const creditAwbs = Object.values(
    awbList.reduce((acc, { customerId, totalAmount }) => {
      acc[customerId] = acc[customerId] || { customerId, totalAmount: 0 };
      acc[customerId].totalAmount += parseInt(totalAmount);
      return acc;
    }, {})
  );

  const handleConfirm = ({ customerId }) => {
    setLoading(true);
    const database = firebase.database().ref();
    const d = new Date();
    const time = moment(d).locale("en-sg").format("LT");
    const date = moment(d).locale("en-ca").format("L");

    awbList.forEach((awb) => {
      const { key, ...rest } = awb;
      if (awb.customerId === customerId) {
        database.child(`empu/inbound/${awb.key}`).update({
          ...rest,
          paymentStatus: "PAID",
          paymentDate: `${date} ${time}`,
        });
        setLoading(false);
      }
    });
  };

  return loading ? (
    <LoadingAnimation />
  ) : (
    <>
      {awbList.length === 0 ? (
        <NotFound />
      ) : (
        <div className="rounded border p-2">
          <Table responsive hover id="tableData">
            <thead id="stickyHead">
              <tr>
                <th className="w-25">Customer</th>
                <th className="w-25">Type</th>
                <th className="w-50">Credit</th>
                <th className="w-50"></th>
              </tr>
            </thead>
            <tbody>
              {creditAwbs.map((awb, index) => {
                let idx = customerList.findIndex(
                  (customer) => customer.key === awb.customerId
                );

                return (
                  <tr key={index}>
                    <td>{customerList[idx]?.customerName}</td>
                    <td>{customerList[idx]?.customerType}</td>
                    <td>{`Rp. ${Intl.NumberFormat().format(
                      awb.totalAmount
                    )}`}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-top`}>Confirm Payment</Tooltip>
                        }
                      >
                        <Button
                          variant="outline-dark"
                          onClick={() =>
                            handleConfirm({ customerId: awb.customerId })
                          }
                        >
                          <IoMdDoneAll />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default CreditTable;
