/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { FaPrint } from "react-icons/fa6";
import EMPUReceipt from "../../../General/Print Component/empuReceipt";
import NotFound from "./../../../../../components/partials/notFound";
import moment from "moment";

const DataTransactionTable = ({ awbList }) => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [currentFocus, setCurrentFocus] = useState(null);

  let awbs = awbList[currentFocus];

  return awbList.length === 0 ? (
    <NotFound />
  ) : (
    <div>
      <Table responsive striped id="tableData">
        <thead id="stickyHead">
          <tr>
            <th className="w-25">AWB</th>
            <th className="w-25">Date Added</th>
            <th className="w-auto">Pcs</th>
            <th className="w-auto">Weight</th>
            <th className="w-auto">Status</th>
            <th className="w-auto">Customer</th>
            <th className="w-100">Amount</th>
            <th className="w-auto"></th>
          </tr>
        </thead>
        <tbody>
          {awbList.map((awb, index) => (
            <tr key={index}>
              <td>{awb.awb}</td>
              <td>{moment(awb.dateAdded).locale("en-sg").format("LLL")}</td>
              <td>{awb.pcs}</td>
              <td>{`${awb.weight} Kg`}</td>
              <td>{awb.status.toUpperCase()}</td>
              <td>{awb.customer}</td>
              <td>{`Rp. ${Intl.NumberFormat().format(awb.amount)}`}</td>
              <td>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-top`}>Print AWB : {awb.awb}</Tooltip>
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
          ))}
        </tbody>
      </Table>
      {currentFocus === null ? null : (
        <div className="d-none">
          <div ref={contentRef}>
            <EMPUReceipt data={awbs} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTransactionTable;
