/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseAuth } from "../../config/authContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  handleChange,
  handleExcel,
} from "../../components/functions/functions";
import firebase from "./../../config/firebase";
import moment from "moment";
import "moment/dist/locale/id";
import "moment/dist/locale/en-ca";
import "moment/dist/locale/en-sg";
import NavMenu from "../../components/partials/navbarMenu";
import SignatureModal from "../../components/partials/signatureModal";
import RemarkModal from "../../components/partials/remarkModal";
import PrintFn from "../../components/partials/print";

export default function Doc() {
  const { key } = useParams();
  const auth = UseAuth();
  const [d, setD] = useState(new Date());
  const [img64, setImg64] = useState("");
  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  let year = d.getFullYear().toString().substring(2, 4);
  const tanggal = moment(d).locale("en-ca").format("L");
  const jam = moment(d).locale("en-sg").format("LT");

  let db = firebase.database().ref(`/manifestTransit`);
  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [overloadedItem, setOverloadedItem] = useState([]);
  const [selected, setSelected] = useState([]);
  const [changedItem, setChangedItem] = useState(0);
  const [show, setShow] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [currentFocus, setCurrentFocus] = useState();
  const [remark, setRemark] = useState("");
  const [zerofilled, setZeroFilled] = useState("");
  const [checkedIndex, setCheckedIndex] = useState([]);
  let navigate = useNavigate();

  let berangkat = `${moment(data.departureDate).locale("id").format("L")} ${
    data.departureTime
  }:00`;
  let tiba = `${moment(tanggal).locale("id").format("L")} ${jam}:00`;
  let dura = moment(tiba, "DD/MM/YYYY HH:mm:ss").diff(
    moment(berangkat, "DD/MM/YYYY HH:mm:ss")
  );
  let durasi = moment.duration(dura);
  var finalDurasi = [
    Math.floor(durasi.asHours()) <= 0
      ? ""
      : `${Math.floor(durasi.asHours())} jam`,
    Math.floor(durasi.minutes() <= 0) ? "" : `${durasi.minutes()} menit`,
  ].join(Math.floor(durasi.asHours()) <= 0 ? "" : " ");

  const dataDisplay = [
    [
      { label: "No. Surat", value: data.noSurat },
      { label: "Status", value: data.status },
    ],
    [
      { label: "Origin", value: data.origin },
      { label: "Destination", value: data.destination },
    ],
    [
      { label: "Approved by", value: data.preparedBy },
      {
        label: "Received by",
        value: data.isReceived ? `${data.receivedBy}` : "-",
      },
    ],
    [
      {
        label: "Approved at",
        value: `${moment(data.approvedDate).locale("id").format("LL")} ${
          data.approvedTime
        }`,
      },
      {
        label: "Received at",
        value: data.isReceived
          ? `${moment(data.receivedDate).locale("id").format("LL")} ${
              data.receivedTime
            }`
          : "-",
      },
    ],
  ];

  const vendorInfoCol = [
    {
      id: "floatingNoRef",
      name: "noRef",
      value: data.noRef,
      placeholder: "No. Ref. Vendor",
    },
    {
      id: "floatingNoPolisi",
      name: "noPolisi",
      value: data.noPolisi,
      placeholder: "No. Polisi Kendaraan",
    },
    {
      id: "floatingDriver",
      name: "driver",
      value: data.driver,
      placeholder: "Nama Driver",
    },
  ];

  const suratInfo = [
    {
      label: "Total Koli",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.koli);
      }, 0)} koli`,
    },
    {
      label: "Total Pcs",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.pcs);
      }, 0)} pcs`,
    },
    {
      label: "Total Weight",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.kg);
      }, 0)} Kg`,
    },
  ];

  const signatures = [
    {
      label: "Prepared by",
      source: data.checkerSign,
      alts: "Prepared by",
      name: data.preparedBy,
    },
    {
      label: "Driver",
      source: data.vendorSign || "",
      alts: "Driver Sign",
      name: data.driver,
    },
    {
      label: "Received by",
      source: data.receiverSign,
      alts: "Received by",
      name: data.receivedBy,
    },
  ];

  const handleSubmitRemark = () => {
    setBagList(
      bagList.map((lists, index) => {
        if (index === currentFocus) {
          return { ...lists, remark: remark };
        } else {
          return lists;
        }
      })
    );
  };

  const handleReceive = (idx) => {
    if (auth.origin == data.destination && data.status == "Menunggu Vendor") {
      alert("Bag belum diterima oleh vendor");
    } else {
      setBagList(
        bagList.map((lists, index) => {
          if (index == idx) {
            return {
              ...lists,
              statusBag: `${
                auth.origin == data.origin ? "Dalam Perjalanan" : "Received"
              }`,
            };
          } else {
            return lists;
          }
        })
      );
      setChangedItem(changedItem + 1);
    }
  };

  const handleUnreceive = (idx) => {
    if (auth.origin == data.destination && data.status == "Menunggu Vendor") {
      alert("Bag belum diterima oleh vendor");
    } else {
      setBagList(
        bagList.map((lists, index) => {
          if (index == idx) {
            return {
              ...lists,
              statusBag: `${
                auth.origin == data.origin ? "Missing" : "Unreceived"
              }`,
            };
          } else {
            return lists;
          }
        })
      );
      setChangedItem(changedItem + 1);
    }
  };

  const handleOverload = (idx) => {
    setBagList(
      bagList.map((lists, index) => {
        if (index == idx) {
          return {
            ...lists,
            statusBag: "Overload",
          };
        } else {
          return lists;
        }
      })
    );
    setOverloadedItem((item) => [...item, bagList[idx]]);
    setSelected((overloaded) => [...overloaded, idx]);
    setChangedItem(changedItem + 1);
  };

  const handleReceiveChecked = () => {
    let changed = 0;
    checkedIndex.forEach((element) => {
      if (
        bagList[element].statusBag != "Missing" &&
        bagList[element].statusBag != "Unreceived" &&
        bagList[element].statusBag != "Received"
      ) {
        bagList[element] = {
          ...bagList[element],
          statusBag: "Received",
        };
        changed++;
        setChangedItem(changedItem + changed);
      }
    });
    setCheckedIndex([]);
  };

  const handleUnreceiveChecked = () => {
    let changed = 0;
    checkedIndex.forEach((element) => {
      if (bagList[element].statusBag != "Unreceived") {
        bagList[element] = {
          ...bagList[element],
          statusBag: "Unreceived",
        };
        changed++;
      }
    });
    setChangedItem(changedItem + changed);
    setCheckedIndex([]);
  };

  const handleCancel = (idx, manifestNo) => {
    setBagList(
      bagList.map((lists, index) => {
        if (index == idx) {
          return {
            ...lists,
            statusBag: `${data.bagList[idx].statusBag}`,
          };
        } else {
          return lists;
        }
      })
    );
    if (selected.indexOf(idx) > -1) {
      selected.splice(selected.indexOf(idx), 1);
      setOverloadedItem((current) =>
        current.filter((number) => {
          return number.manifestNo !== manifestNo;
        })
      );
    }
    setChangedItem(changedItem - 1);
  };

  const handleRemark = (index) => {
    setShow(true), setCurrentFocus(index), setRemark("");
  };

  const handleCheck = (e, item) => {
    if (e.target.checked) {
      setCheckedIndex([...checkedIndex, item]);
    } else {
      setCheckedIndex((prev) =>
        prev.filter((currentItem) => currentItem != item)
      );
    }
  };

  const handleCheckAll = (event) => {
    if (event.target.checked) {
      bagList.forEach((item, index) => {
        checkedIndex.push(index);
      });
    } else {
      setCheckedIndex([]);
    }
  };

  const handleApproval = () => {
    if (auth.name == "") {
      alert("Nama receiver kosong!");
    } else if (
      data.status == "Menunggu Vendor" &&
      auth.origin == data.destination
    ) {
      alert("Kiriman belum diterima oleh vendor");
    } else if (data.noRef == "") {
      alert("Nomor referensi vendor kosong");
    } else if (changedItem == 0) {
      alert("Belum ada bag yang diterima");
    } else if (changedItem != bagList.length) {
      alert("Periksa lagi barang yang belum diterima");
    } else if (overloadedItem.length == bagList.length) {
      alert("Semua bag tidak diangkut vendor, konfirmasi kembali data bag");
    } else {
      setShowSignature(true);
    }
  };

  const handleArrival = () => {
    if (
      data.status == "Dalam Perjalanan" &&
      data.noPolisi != "" &&
      data.noRef != "" &&
      data.departureDate != ""
    ) {
      if (confirm("Konfirmasi kedatangan bag") == true) {
        setLoading(true);
        try {
          let updates = {};
          updates["status"] = "Sampai Tujuan";
          updates["isArrived"] = true;
          updates["arrivalDate"] = tanggal;
          updates["arrivalTime"] = jam;
          updates["durasi"] = finalDurasi;
          db.child(key)
            .update(updates)
            .then(() => {
              setLoading(false);
              alert("Bag diterima, konfirmasi kelengkapan bag");
              setChangedItem(0);
              window.scrollTo(0, 0);
            })
            .catch((error) => {
              console.log(error.error);
              alert("Program mengalami masalah, silahkan hubungi tim IT");
            });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      alert(
        "Kiriman belum berangkat dari Origin / belum di konfirmasi oleh vendor"
      );
    }
  };

  const approve = () => {
    if (img64 == "") {
      alert("Tanda tangan tidak valid");
    } else {
      if (confirm("Konfirmasi approve?") == true) {
        setLoading(true);
        let checkUnreceive = bagList.some(
          (item) => "Unreceived" === item.statusBag
        );
        const storage = getStorage();
        const metaData = {
          contentType: "image/png",
        };
        const storageRef = ref(
          storage,
          `signatures/${year}-${zerofilled}/${
            auth.origin == data.origin ? "vendor" : "receiver"
          }Sign.png`
        );
        try {
          uploadString(storageRef, img64, "data_url", metaData).then(
            (snapshot) => {
              getDownloadURL(snapshot.ref).then(async (url) => {
                let updates = {};
                updates["bagList"] = bagList.filter(
                  (bags) => !bags.statusBag.includes("Overload")
                );
                if (auth.origin == data.destination) {
                  updates["status"] = checkUnreceive ? "Received*" : "Received";
                  updates["isReceived"] = true;
                  updates["receivedBy"] = auth.name;
                  updates["receivedDate"] = tanggal;
                  updates["receivedTime"] = jam;
                  updates["receiverSign"] = url;
                } else if (auth.origin == data.origin) {
                  updates["departureDate"] = tanggal;
                  updates["departureTime"] = jam;
                  updates["status"] = "Dalam Perjalanan";
                  updates["noRef"] = data.noRef;
                  updates["noPolisi"] = data.noPolisi;
                  updates["driver"] = data.driver;
                  updates["vendorSign"] = url;
                }
                db.child(key)
                  .update(updates)
                  .then(() => {
                    if (overloadedItem.length != 0) {
                      setOverloadedItem(
                        overloadedItem.map((item) => {
                          return { ...item, statusBag: "Menunggu Vendor" };
                        })
                      );
                      db.push({
                        noSurat: `${data.noSurat}_${parseInt(data.count) + 1}`,
                        noRef: "",
                        origin: data.origin,
                        destination: data.destination,
                        bagList: overloadedItem,
                        approvedDate: tanggal,
                        approvedTime: jam,
                        preparedBy: data.preparedBy,
                        receivedDate: "",
                        receivedTime: "",
                        receivedBy: "",
                        checkerSign: data.checkerSign,
                        receiverSign: "",
                        vendorSign: "",
                        isArrived: false,
                        isReceived: false,
                        status: "Menunggu Vendor",
                        arrivalDate: "",
                        arrivalTime: "",
                        departureDate: "",
                        departureTime: "",
                        count: parseInt(data.count) + 1,
                      });
                    }
                    setLoading(false);
                    alert("Received");
                    setChangedItem(0);
                    window.scrollTo(0, 0);
                  })
                  .catch((error) => {
                    console.log(error.error);
                    alert("Program mengalami masalah, silahkan hubungi tim IT");
                  });
              });
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    db.child(key).on("value", (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
        setBagList(snapshot.val().bagList);
        setZeroFilled(snapshot.val().noSurat.split("/")[3]);
      } else {
        navigate("/");
      }
    });
    const handleResize = () => {
      setWindowSize({
        ...windowSize,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const unloadCallback = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("resize", handleResize);
    if (changedItem != 0) {
      window.addEventListener("beforeunload", unloadCallback);
    }

    const intervalId = setInterval(() => {
      setD(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("beforeunload", unloadCallback);
    };
  }, [auth.name, auth.origin]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <div className="mt-4">
          {dataDisplay.map((display, index) => (
            <div key={index}>
              <Row>
                <Col>
                  <strong>{display[0].label}</strong> <br />
                  {display[0].value}
                </Col>
                <Col>
                  <strong>{display[1].label}</strong> <br />
                  {display[1].value}
                </Col>
              </Row>
              <hr />
            </div>
          ))}
          {auth.origin != data.origin &&
          auth.origin != data.destination ? null : (
            <Row>
              {vendorInfoCol.map((item, index) => (
                <Col xs={windowSize.width >= 768 ? "" : "0"} key={index}>
                  <Form.Floating
                    className={windowSize.width >= 768 ? "" : "mb-2"}
                  >
                    <Form.Control
                      id={item.id}
                      type="text"
                      name={item.name}
                      value={item.value || ""}
                      placeholder={item.placeholder}
                      onChange={
                        auth.origin == data.origin
                          ? () => handleChange(event, data, setData)
                          : null
                      }
                      disabled={
                        data.isArrived ||
                        data.status == "Dalam Perjalanan" ||
                        auth.origin == data.destination
                          ? true
                          : false
                      }
                    ></Form.Control>
                    <label htmlFor={item.id}>{item.placeholder}</label>
                  </Form.Floating>
                </Col>
              ))}
            </Row>
          )}
        </div>
        <hr />
        <div>
          <Table responsive striped id="tableData">
            <thead id="stickyHead">
              <tr>
                <th>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={(e) => handleCheckAll(e)}
                    checked={checkedIndex.length == 0 ? false : true}
                  />
                </th>
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
                      <td>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onChange={(e) => handleCheck(e, index)}
                          checked={
                            checkedIndex.indexOf(index) > -1 ? true : false
                          }
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{item.manifestNo}</td>
                      <td>{item.koli == undefined ? "-" : item.koli}</td>
                      <td>{item.pcs}</td>
                      <td>{item.kg}</td>
                      <td>{item.statusBag}</td>
                      <td>{item.remark}</td>
                      {(auth.origin == data.origin &&
                        data.status == "Menunggu Vendor") ||
                      (auth.origin == data.destination &&
                        data.status == "Sampai Tujuan" &&
                        data.isReceived == false) ? (
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
                                handleCancel(index, item.manifestNo)
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
                                    onClick={() => handleReceive(index)}
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
                                    onClick={() => handleUnreceive(index)}
                                    disabled={loading ? true : false}
                                  >
                                    Unreceived
                                  </Button>
                                  <Button
                                    variant="warning"
                                    className="m-2"
                                    onClick={() => handleRemark(index)}
                                    disabled={loading ? true : false}
                                  >
                                    Remark
                                  </Button>
                                  {auth.origin == data.origin ? (
                                    <Button
                                      variant="outline-danger"
                                      className="m-2"
                                      onClick={() => handleOverload(index)}
                                      disabled={loading ? true : false}
                                    >
                                      Overload
                                    </Button>
                                  ) : null}
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
        {(auth.origin == data.origin && data.status == "Menunggu Vendor") ||
        (auth.origin == data.destination && data.status == "Sampai Tujuan") ? (
          <Row>
            {checkedIndex.length == 0 ? null : (
              <Col>
                <Button
                  className="m-2"
                  variant="primary"
                  onClick={() => handleReceiveChecked()}
                >
                  Received
                </Button>
                <Button
                  className="m-2"
                  variant="secondary"
                  onClick={() => handleUnreceiveChecked()}
                >
                  Unreceived
                </Button>
                <Button className="m-2" variant="outline-danger">
                  Overload
                </Button>
              </Col>
            )}
          </Row>
        ) : null}
        <Row className="mt-4">
          {suratInfo.map((item, index) => (
            <Col key={index}>
              <p>
                <strong>
                  {item.label} <br />
                </strong>{" "}
                {`${item.value}`}
              </p>
            </Col>
          ))}
        </Row>
        <Row>
          <Col>
            {loading ? (
              <Spinner animation="grow" size="sm" />
            ) : (
              <>
                {data.isReceived == true ||
                (auth.origin == data.destination &&
                  data.status != "Sampai Tujuan") ||
                (auth.origin == data.origin &&
                  data.status != "Menunggu Vendor") ||
                (auth.origin != data.origin &&
                  auth.origin != data.destination) ? null : (
                  <Button variant="primary" onClick={handleApproval}>
                    Approve
                  </Button>
                )}
                {auth.origin == data.destination && data.isArrived == false ? (
                  <Button variant="outline-primary" onClick={handleArrival}>
                    Arrived
                  </Button>
                ) : null}
              </>
            )}
            {changedItem == 0 ? (
              <ButtonGroup>
                <DropdownButton
                  as={ButtonGroup}
                  title="Download File"
                  id="bg-nested-dropdown"
                  variant="success"
                  className="mx-2"
                >
                  <Dropdown.Item
                    eventKey="1"
                    onClick={() => handleExcel(data, bagList)}
                  >
                    Excel File (.xlsx)
                  </Dropdown.Item>
                  <hr className="mx-4" />
                  <PDFDownloadLink
                    className="mx-3"
                    document={<PrintFn bagList={bagList} data={data} />}
                    fileName={`${data.noSurat}.pdf`}
                    style={{ color: "black" }}
                  >
                    {({ loading }) =>
                      loading ? "Loading..." : "PDF File (.pdf)"
                    }
                  </PDFDownloadLink>
                </DropdownButton>
              </ButtonGroup>
            ) : null}
          </Col>
        </Row>
        <RemarkModal
          show={show}
          onHide={() => {
            setShow(false), setCurrentFocus();
          }}
          getvalue={setRemark}
          getfocus={setCurrentFocus}
          setvalue={handleSubmitRemark}
        />
        <hr />
        <SignatureModal
          show={showSignature}
          onHide={() => setShowSignature(false)}
          onChange={setImg64}
          onSubmit={approve}
        />
        <Row>
          {signatures.map((item, index) => (
            <Col className="signatures" key={index}>
              <p>
                <strong>{item.label}</strong>
              </p>
              {item.source == "" ? null : (
                <>
                  <img
                    className="signature"
                    src={item.source}
                    alt={item.alts}
                  />
                  <p>{item.name}</p>
                </>
              )}
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
