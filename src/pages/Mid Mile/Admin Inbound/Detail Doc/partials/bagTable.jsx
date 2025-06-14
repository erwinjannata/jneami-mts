/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Table } from "react-bootstrap";
import LoadingAnimation from "../../../../../components/partials/loading";
import moment from "moment";

const InboundBagTable = ({ bagList, loading }) => {
  const tableHeader = [
    { label: "No.", className: "w-auto" },
    { label: "Master Bag No.", className: "w-25" },
    { label: "Koli", className: "w-auto" },
    { label: "Weight", className: "w-auto" },
    { label: "Status Bag", className: "w-auto" },
    { label: "Remark", className: "w-50" },
    { label: "SM#", className: "w-50" },
    { label: "Receiving Date", className: "w-auto" },
  ];

  const textStyle = ({ status }) => {
    if (status === "Received") {
      return "text-success bg-success";
    } else if (status === "Dalam Perjalanan") {
      return "text-primary bg-primary";
    } else if (status === "Standby") {
      return "text-dark bg-dark";
    } else if (status === "Missing" || status === "Unreceived") {
      return "text-danger bg-danger";
    }
  };

  return loading ? (
    <LoadingAnimation />
  ) : (
    <Table responsive striped id="tableData">
      <thead id="stickyHead">
        <tr>
          {tableHeader.map((header, index) => (
            <th key={index} className={header.className}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bagList.map((bag, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{bag.bagNumber}</td>
            <td>{bag.koli}</td>
            <td>{bag.weight}</td>
            <td className="d-flex">
              <p
                style={{ fontWeight: "bold" }}
                className={`bg-opacity-10 rounded text-center py-1 px-2 ${textStyle(
                  {
                    status: bag.statusBag,
                  }
                )}`}
              >
                {bag.statusBag}
              </p>
            </td>
            <td>{bag.remark}</td>
            <td>{bag.sm}</td>
            <td>
              {bag.receivingDate
                ? moment(Date.parse(bag.receivingDate))
                    .locale("en-sg")
                    .format("lll")
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InboundBagTable;
