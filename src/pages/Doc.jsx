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

  let db = firebase.database().ref(`/manifestTransit/${key}`);
  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [changedItem, setChangedItem] = useState(0);
  const [show, setShow] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [currentFocus, setCurrentFocus] = useState();
  const [remark, setRemark] = useState("");
  const [zerofilled, setZeroFilled] = useState("");
  let navigate = new useNavigate();

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
    setBagList(
      bagList.map((lists, index) => {
        if (index == idx) {
          return { ...lists, statusBag: "Diterima" };
        } else {
          return lists;
        }
      })
    );
    setChangedItem(changedItem + 1);
  };

  const handleUnreceive = (idx) => {
    setBagList(
      bagList.map((lists, index) => {
        if (index == idx) {
          return { ...lists, statusBag: "Tidak Masuk" };
        } else {
          return lists;
        }
      })
    );
    setChangedItem(changedItem + 1);
  };

  const handleCancel = (idx) => {
    setBagList(
      bagList.map((lists, index) => {
        if (index == idx) {
          return { ...lists, statusBag: "Belum Diterima" };
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
    } else if (changedItem == 0 && auth.origin == data.destination) {
      alert("Belum ada bag yang diterima");
    } else if (
      changedItem != bagList.length &&
      auth.origin == data.destination
    ) {
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
        uploadString(storageRef, img64, "data_url", metaData).then(
          (snapshot) => {
            getDownloadURL(snapshot.ref).then(async (url) => {
              let updates = {};
              if (auth.origin == data.destination) {
                updates["status"] = "Sampai Tujuan";
                updates["isReceived"] = true;
                updates["receivedDate"] = tanggal;
                updates["receivedBy"] = auth.name;
                updates["receivedTime"] = jam;
                updates["receiverSign"] = url;
                updates["bagList"] = bagList;
              } else if (auth.origin == data.origin) {
                updates["status"] = "Dalam Perjalanan";
                updates["noRef"] = data.noRef;
                updates["vendorSign"] = url;
              }
              db.update(updates)
                .then(() => {
                  setLoading(false);
                  alert("Received");
                  window.scrollTo(0, 0);
                })
                .catch((error) => {
                  console.log(error.error);
                  alert("Program mengalami masalah, silahkan hubungi tim IT");
                });
            });
          }
        );
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
          "Status",
          "No Surat",
          "Status Kiriman",
        ],
      ],
      { origin: "A1" }
    );
    writeFile(workbook, `${data.noSurat}.xlsx`);
  };

  useEffect(() => {
    db.on("value", (snapshot) => {
      if (snapshot.exists()) {
        setData({
          ...data,
          key: snapshot.key,
          noSurat: snapshot.val().noSurat,
          noRef: snapshot.val().noRef,
          preparedBy: snapshot.val().preparedBy,
          approveDate: snapshot.val().approveDate,
          approveTime: snapshot.val().approveTime,
          origin: snapshot.val().origin,
          destination: snapshot.val().destination,
          checkerSign: snapshot.val().checkerSign,
          sumPcs: snapshot.val().sumPcs,
          sumWeight: snapshot.val().sumWeight,
          receivedDate: snapshot.val().receivedDate,
          receivedTime: snapshot.val().receivedTime,
          receivedBy: snapshot.val().receivedBy,
          receiverSign: snapshot.val().receiverSign,
          vendorSign: snapshot.val().vendorSign,
          isReceived: snapshot.val().isReceived,
          status: snapshot.val().status,
        });
        setBagList(snapshot.val().bagList);
        setZeroFilled(snapshot.val().noSurat.split("/")[3]);
      } else {
        navigate("/");
      }
    });
    const intervalId = setInterval(() => {
      setD(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [auth.name, auth.origin, auth.level]);

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
              <strong>No. Ref. Vendor </strong> <br />{" "}
              {data.status != "Dalam Perjalanan" ? data.status : data.noRef}
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
              {`${moment(data.approveDate).locale("id").format("LL")} ${
                data.approveTime
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
          {data.isReceived ? null : (
            <Row>
              {auth.origin == data.destination || auth.level >= 4 ? (
                <Col>
                  <Form.Floating>
                    <Form.Control
                      id="flotaingPrepared"
                      type="text"
                      name="receiver"
                      value={auth.name || ""}
                      placeholder="Receiver"
                      disabled
                    ></Form.Control>
                    <label htmlFor="floatingPrepared">Receiver</label>
                  </Form.Floating>
                </Col>
              ) : null}
              {data.status == "Dalam Perjalanan" ||
              auth.origin == data.origin ||
              auth.level >= 4 ? (
                <Col>
                  <Form.Floating>
                    <Form.Control
                      id="flotaingNoRef"
                      type="text"
                      name="noRef"
                      value={data.noRef || ""}
                      placeholder="No. Ref. Vendor"
                      onChange={(e) =>
                        setData({ ...data, noRef: e.target.value })
                      }
                      disabled={
                        data.isReceived || data.status == "Dalam Perjalanan"
                          ? true
                          : false
                      }
                    ></Form.Control>
                    <label htmlFor="floatingNoRef">No. Ref. Vendor</label>
                  </Form.Floating>
                </Col>
              ) : null}
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
                    {auth.origin == data.destination &&
                    data.isReceived == false ? (
                      <>
                        {data.isReceived ||
                        data.status == "Menunggu Vendor" ? null : (
                          <>
                            {item.statusBag == "Diterima" ||
                            item.statusBag == "Tidak Masuk" ? (
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
                        date1={`${moment(data.approveDate)
                          .locale("id")
                          .format("LL")} ${data.approveTime}`}
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
                <p>Vendor</p>
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
