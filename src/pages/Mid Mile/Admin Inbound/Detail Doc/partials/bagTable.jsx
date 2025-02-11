/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Table } from "react-bootstrap";
import LoadingAnimation from "../../../../../components/partials/loading";
import { handleCancel, handleReceive, handleUnreceive } from "./functions";
import { handleRemark } from "../../../Airport/Detail Doc/partials/functions";

const InboundBagTable = ({
  data,
  bagList,
  oldBagList,
  setBagList,
  setShow,
  setRemark,
  setCurrentFocus,
  loading,
}) => {
  const tableHeader = [
    { label: "No.", className: "w-auto" },
    { label: "Master Bag No.", className: "w-25" },
    { label: "Koli", className: "w-auto" },
    { label: "Weight", className: "w-auto" },
    { label: "Status Bag", className: "w-auto" },
    { label: "Remark", className: "w-50" },
    { label: "SM#", className: "w-auto" },
    { label: "", className: "w-auto" },
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
              {data.status === "Dalam Perjalanan" ? (
                <>
                  {bag.statusBag === "Received" ? (
                    <>
                      {oldBagList[index].statusBag === "Received" ? null : (
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleCancel({
                              index: index,
                              bagList: bagList,
                              oldBagList: oldBagList,
                              setBagList: setBagList,
                            })
                          }
                        >
                          Batal
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {bag.statusBag === "Dalam Perjalanan" ? (
                        <>
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={() =>
                              handleReceive({
                                index: index,
                                bagList: bagList,
                                setBagList: setBagList,
                              })
                            }
                          >
                            Receive
                          </Button>
                          <Button
                            variant="secondary"
                            className="me-2"
                            onClick={() =>
                              handleUnreceive({
                                index: index,
                                bagList: bagList,
                                setBagList: setBagList,
                              })
                            }
                          >
                            Unreceive
                          </Button>
                          <Button
                            variant="warning"
                            onClick={() =>
                              handleRemark({
                                index: index,
                                setShow: setShow,
                                setRemark: setRemark,
                                setCurrentFocus: setCurrentFocus,
                              })
                            }
                          >
                            Remark
                          </Button>
                        </>
                      ) : null}
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InboundBagTable;
