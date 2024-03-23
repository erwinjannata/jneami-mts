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
import Menu from "../components/menu";
import RemarkModal from "../components/remarkModal";
import SignatureModal from "../components/signatureModal";
import firebase from "../config/firebase";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseAuth } from "../config/authContext";
import { utils, writeFile } from "xlsx";
import moment from "moment";
import "moment/dist/locale/id";
import "moment/dist/locale/en-ca";
import "moment/dist/locale/en-sg";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Print from "../components/printedDoc";

export default function Doc() {
  const { key } = useParams();
  const auth = UseAuth();
  const [d, setD] = useState(new Date());
  let year = d.getFullYear().toString().substring(2, 4);
  const [loading, setLoading] = useState(false);
  const tanggal = moment(d).locale("en-ca").format("L");
  const jam = moment(d).locale("en-sg").format("LT");
  const [img64, setImg64] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  let db = firebase.database().ref(`/manifestTransit/${key}`);
  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [changedItem, setChangedItem] = useState(0);
  const [show, setShow] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [currentFocus, setCurrentFocus] = useState();
  const [remark, setRemark] = useState("");
  const [zerofilled, setZeroFilled] = useState("");
  let navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setData({ ...data, [e.target.name]: value });
  };

  const handleSubmit = () => {
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

  const handleCancel = (idx) => {
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
    setChangedItem(changedItem - 1);
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
    } else {
      setShowSignature(true);
    }
  };

  const approve = () => {
    if (img64 == "") {
      alert("Tanda tangan tidak valid");
    } else {
      if (confirm("Konfirmasi approve?") == true) {
        setLoading(true);
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
                updates["bagList"] = bagList;
                if (auth.origin == data.destination) {
                  updates["status"] = "Sampai Tujuan";
                  updates["isReceived"] = true;
                  updates["receivedBy"] = auth.name;
                  updates["receivedDate"] = tanggal;
                  updates["receivedTime"] = jam;
                  updates["receiverSign"] = url;
                } else if (auth.origin == data.origin) {
                  updates["approvedDate"] = tanggal;
                  updates["approvedTime"] = jam;
                  updates["status"] = "Dalam Perjalanan";
                  updates["noRef"] = data.noRef;
                  (updates["noPolisi"] = data.noPolisi),
                    (updates["driver"] = data.driver);
                  updates["vendorSign"] = url;
                }
                db.update(updates)
                  .then(() => {
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

  const handleDownload = () => {
    const processedData = bagList.map((row) => ({
      no: row.no,
      manifestNo: row.manifestNo,
      pcs: row.pcs,
      koli: row.kg,
      remark: row.remark,
      status: row.statusBag,
      noSurat: data.noSurat,
      statusBag: data.status,
    }));
    const worksheet = utils.json_to_sheet(processedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    utils.sheet_add_aoa(
      worksheet,
      [
        [
          "No",
          "Manifest Number",
          "Pcs / Koli",
          "Kg / Weight",
          "Remark",
          "Status Bag",
          "No Surat",
          "Status Manifest",
        ],
      ],
      { origin: "A1" }
    );
    writeFile(workbook, `${data.noSurat}.xlsx`);
  };

  useEffect(() => {
    db.on("value", (snapshot) => {
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

    window.addEventListener("resize", handleResize);
    const intervalId = setInterval(() => {
      setD(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, [auth.name, auth.origin]);

  return (
    <>
      <Menu />
      <Container>
        <div className="mt-4">
          <Row>
            <Col>
              <strong>No. Surat </strong> <br />
              {data.noSurat}
            </Col>
            <Col>
              <strong>Status</strong> <br /> {data.status}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <strong>Origin </strong> <br />
              {data.origin}
            </Col>
            <Col>
              <strong>Destination </strong> <br />
              {data.destination}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <strong>Approved by </strong> <br />
              {data.preparedBy}
            </Col>
            <Col>
              <strong>Received by </strong> <br />{" "}
              {data.isReceived ? `${data.receivedBy}` : "-"}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <strong>Approved at</strong> <br />
              {`${moment(data.approvedDate).locale("id").format("LL")} ${
                data.approvedTime
              }`}
            </Col>
            <Col>
              <strong>Received at </strong> <br />{" "}
              {data.isReceived
                ? `${moment(data.receivedDate)
                    .locale("id")
                    .format("LL")} pukul ${data.receivedTime}`
                : "-"}
            </Col>
          </Row>
          <hr />
          {auth.origin != data.origin &&
          auth.origin != data.destination ? null : (
            <Row>
              <Col xs={windowSize.width >= 768 ? "" : "0"}>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="flotaingNoRef"
                    type="text"
                    name="noRef"
                    value={data.noRef || ""}
                    placeholder="No. Ref. Vendor"
                    onChange={auth.origin == data.origin ? handleChange : null}
                    disabled={
                      data.isReceived ||
                      data.status == "Dalam Perjalanan" ||
                      auth.origin == data.destination
                        ? true
                        : false
                    }
                  ></Form.Control>
                  <label htmlFor="floatingNoRef">No. Ref. Vendor</label>
                </Form.Floating>
              </Col>
              <Col xs={windowSize.width >= 768 ? "" : "0"}>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="flotaingNoPolisi"
                    type="text"
                    name="noPolisi"
                    value={data.noPolisi || ""}
                    placeholder="No. Polisi Kendaraan"
                    onChange={auth.origin == data.origin ? handleChange : null}
                    disabled={
                      data.isReceived ||
                      data.status == "Dalam Perjalanan" ||
                      auth.origin == data.destination
                        ? true
                        : false
                    }
                  ></Form.Control>
                  <label htmlFor="floatingNoPolisi">No. Polisi Kendaraan</label>
                </Form.Floating>
              </Col>
              <Col xs={windowSize.width >= 768 ? "" : "0"}>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id="flotaingDriver"
                    type="text"
                    name="driver"
                    value={data.driver || ""}
                    placeholder="Nama Driver"
                    onChange={auth.origin == data.origin ? handleChange : null}
                    disabled={
                      data.isReceived ||
                      data.status == "Dalam Perjalanan" ||
                      auth.origin == data.destination
                        ? true
                        : false
                    }
                  ></Form.Control>
                  <label htmlFor="floatingDriver">Nama Driver</label>
                </Form.Floating>
              </Col>
            </Row>
          )}
        </div>
        <hr />
        <div
          style={{ maxHeight: "364px", overflowY: "scroll", display: "block" }}
        >
          <Table responsive striped>
            <thead>
              <tr>
                <th>No.</th>
                <th>Manifest No.</th>
                <th>Pcs</th>
                <th>Kg</th>
                <th>Status Bag</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {bagList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.manifestNo}</td>
                  <td>{item.pcs}</td>
                  <td>{item.kg}</td>
                  <td>{item.statusBag}</td>
                  <td>{item.remark}</td>
                  <td>
                    {(auth.origin == data.origin &&
                      data.status == "Menunggu Vendor") ||
                    (auth.origin == data.destination &&
                      data.status == "Dalam Perjalanan") ? (
                      <>
                        {(auth.origin == data.destination &&
                          item.statusBag == "Received") ||
                        item.statusBag == "Unreceived" ||
                        (auth.origin == data.origin &&
                          item.statusBag != "Menunggu Vendor") ? (
                          <Button
                            variant="danger"
                            className="m-2"
                            onClick={() => handleCancel(index)}
                            disabled={loading ? true : false}
                          >
                            Batalkan
                          </Button>
                        ) : (
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
                              onClick={() => {
                                setShow(true),
                                  setCurrentFocus(index),
                                  setRemark("");
                              }}
                              disabled={loading ? true : false}
                            >
                              Remark
                            </Button>
                          </div>
                        )}
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Row className="mt-4">
          <Col>
            <p>
              <strong>
                Total Pcs <br />
              </strong>{" "}
              {`${data.sumPcs} koli`}
            </p>
          </Col>
          <Col>
            <p>
              <strong>
                Total Weight <br />
              </strong>{" "}
              {`${data.sumWeight} kg`}
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            {data.isReceived ? null : (
              <>
                {loading ? (
                  <Spinner animation="grow" size="sm" />
                ) : (
                  <>
                    {(auth.origin == data.origin &&
                      data.status != "Dalam Perjalanan") ||
                    auth.origin == data.destination ? (
                      <Button variant="primary" onClick={handleApproval}>
                        Approve
                      </Button>
                    ) : null}
                  </>
                )}
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
                  <Dropdown.Item eventKey="1" onClick={handleDownload}>
                    Excel File (.xlsx)
                  </Dropdown.Item>
                  <hr className="mx-4" />
                  <PDFDownloadLink
                    className="mx-3"
                    document={
                      <Print
                        data={bagList}
                        noSurat={data.noSurat}
                        noRef={data.noRef}
                        date1={`${moment(data.approvedDate)
                          .locale("id")
                          .format("LL")} ${data.approvedTime}`}
                        date2={
                          data.receivedDate == ""
                            ? "-"
                            : `${moment(data.receivedDate)
                                .locale("id")
                                .format("LL")} ${data.receivedTime}`
                        }
                        origin={data.origin}
                        destination={data.destination}
                        sumKoli={data.sumPcs}
                        sumWeight={data.sumWeight}
                        checkerSign={data.checkerSign}
                        vendorSign={data.vendorSign}
                        receiverSign={data.receiverSign}
                        checkerName={data.preparedBy}
                        receiverName={data.receivedBy}
                        driverName={data.driver}
                      />
                    }
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
          setvalue={handleSubmit}
        />
        <hr />
        <SignatureModal
          show={showSignature}
          onHide={() => setShowSignature(false)}
          onChange={setImg64}
          onSubmit={approve}
        />
        <Row>
          <Col className="signatures">
            <p>
              <strong>Prepared by</strong>
            </p>
            <img
              className="signature"
              src={data.checkerSign}
              alt="Prepared by"
            />
            <p>{data.preparedBy}</p>
          </Col>
          <Col className="signatures">
            <p>
              <strong>Received by</strong>
            </p>
            {data.vendorSign == "" ? null : (
              <>
                <img
                  className="signature"
                  src={data.vendorSign}
                  alt="Received by"
                />
                <p>{data.driver}</p>
              </>
            )}
          </Col>
          <Col className="signatures">
            <p>
              <strong>Received by</strong>
            </p>
            {data.receivedBy == "" ? null : (
              <>
                <img
                  className="signature"
                  src={data.receiverSign}
                  alt="Prepared by"
                />
                <p>{data.receivedBy}</p>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
