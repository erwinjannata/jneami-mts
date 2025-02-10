/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Spinner, Table } from "react-bootstrap";
import TableButtons from "./tableButtons";

const AirPortBagTable = ({
  data,
  bagList,
  setBagList,
  oldBagList,
  setOldBagList,
  loading,
  setShow,
  setRemark,
  setCurrentFocus,
}) => {
  const tableHeader = [
    { label: "No.", className: "w-auto" },
    { label: "Master Bag No.", className: "w-25" },
    { label: "Koli", className: "w-auto" },
    { label: "Weight", className: "w-auto" },
    { label: "Status Bag", className: "w-auto" },
    { label: "Remark", className: "w-50" },
    { label: "SM#", className: "w-auto" },
    { label: "", className: "w-25" },
  ];

  const textStyle = ({ status }) => {
    if (status === "Received") {
      return "text-success bg-success";
    } else if (status === "Dalam Perjalanan") {
      return "text-primary bg-primary";
    } else if (status === "Standby") {
      return "text-dark bg-dark";
    } else if (status === "Missing") {
      return "text-danger bg-danger";
    }
  };

  return loading ? (
    <Spinner animation="grow" size="sm" />
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
            <TableButtons
              bag={bag}
              index={index}
              data={data}
              bagList={bagList}
              setBagList={setBagList}
              oldBagList={oldBagList}
              setOldBagList={setOldBagList}
              setShow={setShow}
              setRemark={setRemark}
              setCurrentFocus={setCurrentFocus}
            />
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AirPortBagTable;
