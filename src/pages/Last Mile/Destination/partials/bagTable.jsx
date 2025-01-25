/* eslint-disable react/prop-types */
import { Button, Col, Table } from "react-bootstrap";
import { UseAuth } from "../../../../config/authContext";

function BagTableDestination({
  data,
  bagList,
  setterBagList,
  checkedIndex,
  setterCheckedIndex,
  changedItem,
  setterChangedItem,
  oncheck,
  oncheckAll,
  loading,
  onReceive,
  onUnreceive,
  onRemarks,
  onCancel,
}) {
  const auth = UseAuth();

  return (
    <div>
      <Table responsive striped id="tableData">
        <thead id="stickyHead">
          <tr>
            {data.status === "Sampai Tujuan" ? (
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
                  {data.status === "Sampai Tujuan" ? (
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
                  {data.status === "Sampai Tujuan" &&
                  data.isReceived === false ? (
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
                              bagList,
                              setterBagList,
                              data,
                              changedItem,
                              setterChangedItem
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
                              {item.statusBag === "Missing" ? (
                                <Col></Col>
                              ) : (
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
                                >
                                  Received
                                </Button>
                              )}
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

export default BagTableDestination;
