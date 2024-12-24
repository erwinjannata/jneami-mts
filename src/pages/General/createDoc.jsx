/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Button,
  FloatingLabel,
  Spinner,
} from "react-bootstrap";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { passiveSupport } from "passive-events-support/src/utils";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../config/authContext";
import moment from "moment";
import firebase from "./../../config/firebase";
import "moment/dist/locale/en-sg";
import "moment/dist/locale/en-ca";
import "moment/dist/locale/id";
import NavMenu from "../../components/partials/navbarMenu";
import SignatureModal from "../../components/partials/signatureModal";
import { cabangList } from "../../components/data/branchList";
import { handleChange } from "../../components/functions/functions";

passiveSupport({
  events: ["touchstart", "touchmove"],
});

export default function Create() {
  const auth = UseAuth();

  const [d, setD] = useState(new Date());
  const tanggal = moment(d).locale("en-ca").format("L");
  const jam = moment(d).locale("en-sg").format("LT");
  let year = d.getFullYear().toString().substring(2, 4);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [show, setShow] = useState(false);
  const [img64, setImg64] = useState("");

  let db = firebase.database();
  let navigate = new useNavigate();
  const [loading, setLoading] = useState(false);
  const [n, setN] = useState("");
  const [collectionLength, setCollectionLength] = useState(0);

  const [bagList, setBagList] = useState([]);
  const [state, setState] = useState({
    manifestNo: "AMI/MTS/00",
    koli: "",
    pcs: "",
    kg: "",
    remark: "",
    noSurat: "",
    origin: auth.origin,
    destination: "",
    noRef: "",
    preparedBy: auth.name,
    checkerSign: "",
  });

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

  let formsList = [
    {
      idx: "0",
      name: "manifestNo",
      text: "Manifest No.",
      type: "text",
      xs: "",
      value: state.manifestNo,
    },
    {
      idx: "1",
      name: "koli",
      text: "Koli",
      type: "number",
      xs: "auto",
      value: state.koli,
    },
    {
      idx: "2",
      name: "pcs",
      text: "Pcs",
      type: "number",
      xs: "auto",
      value: state.pcs,
    },
    {
      idx: "3",
      name: "kg",
      text: "Kg",
      type: "number",
      xs: "auto",
      value: state.kg,
    },
    {
      idx: "4",
      name: "remark",
      text: "Remark",
      type: "text",
      xs: "",
      value: state.remark,
    },
  ];

  const handleSubmit = (e, index) => {
    e.preventDefault();
    if (state.manifestNo == "" || state.manifestNo == "AMI/MTS/00") {
      alert("Manifest Number invalid");
    } else if (state.pcs <= 0) {
      alert("Data Pcs(koli) invalid");
    } else if (state.kg <= 0) {
      alert("Data Berat(kg) invalid");
    } else if (state.koli <= 0) {
      alert("Jumlah koli invalid");
    } else {
      const isExist = bagList.some((element) => {
        if (element.manifestNo === state.manifestNo) {
          return true;
        }
        return false;
      });
      if (isExist) {
        alert("Manifest Number sudah ada");
      } else {
        setBagList([
          ...bagList,
          {
            manifestNo: state.manifestNo.toUpperCase(),
            koli: state.koli,
            pcs: state.pcs,
            kg: state.kg,
            remark: state.remark.toUpperCase(),
            statusBag: "Menunggu Vendor",
          },
        ]);
        var items = JSON.parse(localStorage.getItem("bagList")) || [];
        items.push({
          manifestNo: state.manifestNo.toUpperCase(),
          koli: state.koli,
          pcs: state.pcs,
          kg: state.kg,
          remark: state.remark.toUpperCase(),
          statusBag: "Menunggu Vendor",
        });
        localStorage.setItem("bagList", JSON.stringify(items));
        setState({
          ...state,
          manifestNo: "AMI/MTS/00",
          koli: "",
          pcs: "",
          kg: "",
          remark: "",
        });
      }
    }
  };

  const handleRemove = (index, manifestNo) => {
    if (confirm("Hapus bag?") == true) {
      setBagList((current) =>
        current.filter((number) => {
          return number.manifestNo !== manifestNo;
        })
      );
      var items = JSON.parse(localStorage.getItem("bagList"));
      items.splice(index, 1);
      localStorage.setItem("bagList", JSON.stringify(items));
    }
  };

  const handleApproval = () => {
    if (state.destination == "") {
      alert("Pilih destination valid");
    } else if (state.origin == state.destination) {
      alert("Destinasi tidak boleh sama dengan Origin");
    } else if (state.origin == "") {
      alert("Origin kosong, harap refresh halaman, atau login ulang");
    } else if (state.preparedBy == "") {
      alert("Nama checker kosong, harap refresh halaman, atau login ulang");
    } else if (state.noSurat == "") {
      alert(
        "No. Surat tidak terbaca, silahkan refresh halaman, atau login ulang"
      );
    } else if (bagList.length == 0) {
      alert("Tidak ada data Manifest");
    } else {
      setShow(true);
    }
  };

  const approve = () => {
    if (img64 == "") {
      alert("Tanda tangan tidak valid");
    } else {
      if (confirm("Konfirmasi Approve?") == true) {
        setLoading(true);
        const storage = getStorage();
        const metaData = {
          contentType: "image/png",
        };

        const storageRef = ref(
          storage,
          `test/signatures/${year}-${n}/checkerSign.png`
        );
        try {
          uploadString(storageRef, img64, "data_url", metaData).then(
            (snapshot) => {
              getDownloadURL(snapshot.ref).then(async (url) => {
                db.ref("test/manifestTransit/")
                  .push({
                    noSurat: state.noSurat,
                    noRef: state.noRef,
                    origin: state.origin,
                    destination: state.destination,
                    bagList: bagList,
                    approvedDate: tanggal,
                    approvedTime: jam,
                    preparedBy: state.preparedBy,
                    receivedDate: "",
                    receivedTime: "",
                    receivedBy: "",
                    checkerSign: url,
                    receiverSign: "",
                    vendorSign: "",
                    isArrived: false,
                    isReceived: false,
                    status: "Menunggu Vendor",
                    arrivalDate: "",
                    arrivalTime: "",
                    departureDate: "",
                    departureTime: "",
                    count: 0,
                  })
                  .then(() => {
                    // db.ref("status/collectionLength").set(collectionLength);
                    db.ref("test/collectionLength").set(collectionLength);
                    setLoading(false);
                    alert("Approved");
                    localStorage.removeItem("bagList");
                    navigate("/");
                    window.scrollTo(0, 0);
                  })
                  .catch((error) => {
                    alert(error.message);
                    navigate("/");
                    window.scrollTo(0, 0);
                  });
              });
            }
          );
        } catch (error) {
          alert(error);
        }
      }
    }
  };

  // Dijalankan ketika aplikasi dibuka
  useEffect(() => {
    window.scrollTo(0, 0);
    setState({ ...state, origin: auth.origin, preparedBy: auth.name });
    const items = JSON.parse(localStorage.getItem("bagList"));
    if (items) {
      setBagList(items);
    }
    if (auth.origin == "VENDOR") {
      navigate("/vendor");
    }
    // db.ref("status").on("value", (snapshot) => {
    db.ref("test").on("value", (snapshot) => {
      let count = parseInt(snapshot.child("collectionLength").val());
      let zerofilled = ("00000" + (count + 1)).slice(-5);
      setState({
        ...state,
        noSurat: `AMI/MTM/${year}/${zerofilled}`,
      });
      setN(zerofilled);
      setCollectionLength(count + 1);
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
    if (bagList.length >= 0) {
      window.addEventListener("beforeunload", unloadCallback);
    }

    const intervalId = setInterval(() => {
      setD(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
      if (bagList.length >= 0) {
        window.removeEventListener("beforeunload", unloadCallback);
      }
    };
  }, [auth.origin, auth.name, auth.level, state.origin, state.preparedBy]);

  // Render aplikasi
  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Manifest Transit Sub Agen</h2>
        <hr />
        <Row className="mb-4">
          <Col>
            <strong>Nomor Surat : </strong> {state.noSurat}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <strong>Tanggal :</strong>{" "}
            {moment(tanggal).locale("id").format("LL")}
          </Col>
          <Col>
            <strong>Jam :</strong> {moment(d).locale("en-sg").format("LT")}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Form.Floating>
              <Form.Control
                id="flotaingOrigin"
                type="text"
                name="origin"
                value={state.origin}
                placeholder="Origin"
                disabled
              ></Form.Control>
              <label htmlFor="floatingOrigin">Origin</label>
            </Form.Floating>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingSelectGrid" label="Destination">
              <Form.Select
                aria-label="Destination Label"
                name="destination"
                onChange={() => handleChange(event, state, setState)}
                value={state.destination || ""}
                disabled={loading ? true : false}
              >
                <option value="">-Pilih Destination-</option>
                {cabangList.map((item, id) =>
                  auth.origin == item.name ? null : (
                    <option key={id} value={item.name}>
                      {item.name}
                    </option>
                  )
                )}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <hr />
        <form onSubmit={handleSubmit}>
          <Row>
            {formsList.map((item, idx) => (
              <Col xs={windowSize.width >= 768 ? item.xs : "0"} key={idx}>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id={`${item.name}Input`}
                    type={item.type}
                    name={item.name}
                    value={item.value}
                    placeholder={item.text}
                    onChange={() => handleChange(event, state, setState)}
                    disabled={loading ? true : false}
                  ></Form.Control>
                  <label htmlFor="floatingInput">{item.text}</label>
                </Form.Floating>
              </Col>
            ))}
          </Row>
          <Row>
            <div className="d-grid gap-2">
              <Button
                type="submit"
                className="mb-2"
                variant="outline-primary"
                onClick={handleSubmit}
                id="submitBtn"
              >
                Add
              </Button>
            </div>
          </Row>
        </form>
        <hr />
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Table responsive striped>
            <thead style={{ position: "sticky", top: "0", zIndex: "1" }}>
              <tr>
                <th>No.</th>
                <th>Manifest No.</th>
                <th>Koli</th>
                <th>Pcs</th>
                <th>Kg</th>
                <th>Remark</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bagList
                .map((item, idx) => (
                  <tr key={item.manifestNo}>
                    <td>{idx + 1}</td>
                    <td>{item.manifestNo}</td>
                    <td>{item.koli}</td>
                    <td>{item.pcs}</td>
                    <td>{item.kg}</td>
                    <td>{item.remark}</td>
                    <td>
                      <Button
                        variant="danger"
                        disabled={loading ? true : false}
                        onClick={() => handleRemove(idx, item.manifestNo)}
                      >
                        <FaRegTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))
                .reverse()}
            </tbody>
          </Table>
        </div>
        <hr />
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
              <Button variant="primary" onClick={handleApproval}>
                Approve
              </Button>
            )}
          </Col>
        </Row>
        <SignatureModal
          show={show}
          onHide={() => setShow(false)}
          onChange={setImg64}
          onSubmit={approve}
        />
      </Container>
    </div>
  );
}
