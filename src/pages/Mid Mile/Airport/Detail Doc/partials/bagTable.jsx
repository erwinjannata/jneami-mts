/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Spinner, Table } from "react-bootstrap";
import {
  handleCancel,
  handleReceived,
  handleRemark,
  handleMissing,
} from "./functions";

const AirPortBagTable = ({
  data,
  bagList,
  setBagList,
  oldBagList,
  loading,
  setShow,
  setRemark,
  setCurrentFocus,
  changedItem,
  setChangedItem,
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
            <td>{bag.statusBag}</td>
            <td>{bag.remark}</td>
            <td>{bag.sm}</td>
            {data.status === "Received" ? (
              <td></td>
            ) : (
              <td>
                {bag.statusBag === "Submitted" ||
                bag.statusBag === "Dalam Perjalanan" ? (
                  <>
                    <Button
                      variant="outline-dark"
                      className="mx-2"
                      onClick={() =>
                        handleMissing({
                          index: index,
                          bagList: bagList,
                          setBagList: setBagList,
                          changedItem: changedItem,
                          setChangedItem: setChangedItem,
                        })
                      }
                    >
                      Missing
                    </Button>
                  </>
                ) : (
                  <>
                    {oldBagList[index].statusBag == "Submitted" ? (
                      <Button
                        variant="danger"
                        className="mx-2"
                        onClick={() =>
                          handleCancel({
                            index: index,
                            bagList: bagList,
                            setBagList: setBagList,
                            oldBagList: oldBagList,
                            changedItem: changedItem,
                            setChangedItem: setChangedItem,
                          })
                        }
                      >
                        Batal
                      </Button>
                    ) : null}
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AirPortBagTable;
