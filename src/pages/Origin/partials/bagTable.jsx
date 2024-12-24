/* eslint-disable react/prop-types */
import "./../../../index.css";
import { Button, Table } from "react-bootstrap";
import { UseAuth } from "../../../config/authContext";

function BagTableOrigin({
  data,
  bagList,
  setterBagList,
  checkedIndex,
  setterCheckedIndex,
  changedItem,
  setterChangedItem,
  setterOverloadedItem,
  setterSelected,
  oncheck,
  oncheckAll,
  loading,
  onReceive,
  onUnreceive,
  onRemarks,
  onOverload,
  onCancel,
  selected,
}) {
  const auth = UseAuth();

  return (
    <div>
      <Table responsive striped id="tableData">
        <thead id="stickyHead">
          <tr>
            {data.status === "Menunggu Vendor" ? (
              <th>
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={(event) =>
                    oncheckAll(event, setterCheckedIndex, bagList)
                  }
                  checked={checkedIndex.length == bagList.length ? true : false}
                />
              </th>
            ) : null}
            <th className="w-auto">No.</th>
            <th className="w-25">Manifest No.</th>
            <th className="w-auto">Koli</th>
            <th className="w-auto">Pcs</th>
            <th className="w-auto">Kg</th>
            <th className="w-25">Status Bag</th>
            <th className="w-75">Remark</th>
            <th className="w-75"></th>
          </tr>
        </thead>
        <tbody>
          {bagList == undefined
            ? null
            : bagList.map((item, index) => (
                <tr key={index}>
                  {data.status === "Menunggu Vendor" ? (
                    <td>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={(event) =>
                          oncheck(
                            event,
                            index,
                            checkedIndex,
                            setterCheckedIndex
                          )
                        }
                        checked={
                          checkedIndex.indexOf(index) > -1 ? true : false
                        }
                      />
                    </td>
                  ) : null}
                  <td>{index + 1}</td>
                  <td>{item.manifestNo}</td>
                  <td>{item.koli == undefined ? "-" : item.koli}</td>
                  <td>{item.pcs}</td>
                  <td>{item.kg}</td>
                  <td>{item.statusBag}</td>
                  <td>{item.remark}</td>
                  {auth.origin === data.origin &&
                  data.status === "Menunggu Vendor" ? (
                    <td>
                      {(auth.origin == data.destination &&
                        item.statusBag == "Received") ||
                      item.statusBag == "Unreceived" ||
                      (auth.origin == data.origin &&
                        item.statusBag != "Menunggu Vendor") ? (
                        <Button
                          variant="danger"
                          className="m-2"
                          onClick={() =>
                            onCancel(
                              index,
                              item.manifestNo,
                              bagList,
                              setterBagList,
                              data,
                              changedItem,
                              setterChangedItem,
                              selected,
                              setterOverloadedItem
                            )
                          }
                          disabled={loading ? true : false}
                        >
                          Batalkan
                        </Button>
                      ) : (
                        <>
                          {checkedIndex.length != 0 ? null : (
                            <div className="d-flex">
                              <Button
                                variant="primary"
                                className="m-2"
                                onClick={() =>
                                  onReceive(
                                    index,
                                    data,
                                    bagList,
                                    setterBagList,
                                    changedItem,
                                    setterChangedItem
                                  )
                                }
                                disabled={loading ? true : false}
                                style={
                                  item.statusBag == "Missing"
                                    ? { display: "none" }
                                    : { display: "block" }
                                }
                              >
                                Received
                              </Button>
                              <Button
                                variant="secondary"
                                className="m-2"
                                onClick={() =>
                                  onUnreceive(
                                    index,
                                    data,
                                    bagList,
                                    setterBagList,
                                    changedItem,
                                    setterChangedItem
                                  )
                                }
                                disabled={loading ? true : false}
                              >
                                Unreceived
                              </Button>
                              <Button
                                variant="warning"
                                className="m-2"
                                onClick={() => onRemarks(index)}
                                disabled={loading ? true : false}
                              >
                                Remark
                              </Button>
                              <Button
                                variant="outline-danger"
                                className="m-2"
                                onClick={() =>
                                  onOverload(
                                    index,
                                    bagList,
                                    setterBagList,
                                    setterOverloadedItem,
                                    setterSelected,
                                    changedItem,
                                    setterChangedItem
                                  )
                                }
                                disabled={loading ? true : false}
                              >
                                Overload
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
        </tbody>
      </Table>
    </div>
  );
}

export default BagTableOrigin;
