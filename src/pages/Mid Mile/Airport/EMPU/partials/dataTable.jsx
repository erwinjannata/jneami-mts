/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { FaPrint } from "react-icons/fa6";
import EMPUReceipt from "../../../General/Print Component/empuReceipt";
import NotFound from "./../../../../../components/partials/notFound";
import moment from "moment";
import LoadingAnimation from "../../../../../components/partials/loading";
import { UseAuth } from "../../../../../config/authContext";
import { MdOutlineNumbers } from "react-icons/md";

const DataTransactionTable = ({ awbList, customerList, loading }) => {
  const auth = UseAuth();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [currentFocus, setCurrentFocus] = useState(null);

  let awbs = awbList[currentFocus];

  return loading ? (
    <LoadingAnimation />
  ) : (
    <>
      {awbList.length === 0 ? (
        <NotFound />
      ) : (
        <div>
          <Table responsive hover id="tableData">
            <thead id="stickyHead">
              <tr>
                <th className="w-25">AWB</th>
                <th className="w-auto">Koli</th>
                <th className="w-auto">Weight</th>
                <th className="w-auto">Customer</th>
                <th className="w-auto">Amount</th>
                <th className="w-auto">Payment Method</th>
                <th className="w-auto">Payment Date</th>
                <th className="w-50">Date Added</th>
                {auth.level === 5 ? <th className="w-auto"></th> : null}
                <th className="w-auto"></th>
              </tr>
            </thead>
            <tbody>
              {awbList
                .map((awb, index) => {
                  let idx = customerList.findIndex(
                    (customer) => customer.key === awb.customerId
                  );

                  let totalCharge = awb.totalAmount || awb.amount;

                  return (
                    <tr key={index}>
                      <td>{awb.awb}</td>
                      <td>{awb.pcs}</td>
                      <td>{`${awb.weight} Kg`}</td>
                      <td>{customerList[idx].customerName}</td>
                      <td>{`Rp. ${Intl.NumberFormat().format(
                        totalCharge
                      )}`}</td>
                      <td>{awb.paymentMethod}</td>
                      <td>
                        {awb.paymentDate === undefined || awb.paymentDate === ""
                          ? "-"
                          : moment(awb.paymentDate)
                              .locale("en-sg")
                              .format("LLL")}
                      </td>
                      <td>
                        {moment(awb.dateAdded).locale("en-sg").format("LLL")}
                      </td>
                      {auth.level === 5 ? (
                        <td>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>{awb.key}</Tooltip>
                            }
                          >
                            <Button
                              variant="outline-dark"
                              onClick={() =>
                                navigator.clipboard.writeText(awb.key)
                              }
                            >
                              <MdOutlineNumbers />
                            </Button>
                          </OverlayTrigger>
                        </td>
                      ) : null}
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              Print AWB : {awb.awb}
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="outline-dark"
                            onClick={async () => {
                              await setCurrentFocus(index);
                              reactToPrintFn();
                            }}
                          >
                            <FaPrint />
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  );
                })
                .reverse()}
            </tbody>
          </Table>
          {currentFocus === null ? null : (
            <div className="d-none">
              <div ref={contentRef}>
                <EMPUReceipt data={awbs} customerList={customerList} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DataTransactionTable;
