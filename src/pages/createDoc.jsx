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
import { passiveSupport } from "passive-events-support/src/utils";
import NavMenu from "../components/menu";
import SignatureModal from "../components/signatureModal";
import firebase from "../config/firebase";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/dist/locale/en-sg";
import "moment/dist/locale/en-ca";
import "moment/dist/locale/id";
import { UseAuth } from "../config/authContext";

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

  let db = firebase.database().ref("manifestTransit/");
  let navigate = new useNavigate();
  const [loading, setLoading] = useState(false);
  const [n, setN] = useState("");

  const [bagList, setBagList] = useState([]);
  const [state, setState] = useState({
    manifestNo: "AMI/MTS/00",
    pcs: "",
    kg: "",
    remark: "",
    noSurat: "",
    origin: auth.origin,
    destination: "MATARAM",
    sumPcs: 0,
    sumWeight: 0.0,
    noRef: "",
    preparedBy: auth.name,
    checkerSign: "",
  });

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
      name: "pcs",
      text: "Pcs",
      type: "number",
      xs: "auto",
      value: state.pcs,
    },
    {
      idx: "2",
      name: "kg",
      text: "Kg",
      type: "number",
      xs: "auto",
      value: state.kg,
    },
    {
      idx: "3",
      name: "remark",
      text: "Remark",
      type: "text",
      xs: "",
      value: state.remark,
    },
  ];

  let destList = [
    { id: "0", name: "ALAS" },
    { id: "1", name: "BIMA" },
    { id: "2", name: "BOLO" },
    { id: "3", name: "DOMPU" },
    { id: "4", name: "EMPANG" },
    { id: "5", name: "GERUNG" },
    { id: "6", name: "JEREWEH" },
    { id: "7", name: "MANGGELEWA" },
    { id: "8", name: "MATARAM" },
    { id: "9", name: "PADOLO" },
    { id: "10", name: "PLAMPANG" },
    { id: "11", name: "PRAYA" },
    { id: "12", name: "SELONG" },
    { id: "13", name: "SUMBAWA" },
    { id: "14", name: "TALIWANG" },
    { id: "15", name: "TANJUNG" },
    { id: "16", name: "UTAN" },
  ];

  // Handler Untuk App
  const handleChange = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e, index) => {
    e.preventDefault();
    if (state.manifestNo == "" || state.manifestNo == "AMI/MTS/00") {
      alert("Manifest Number invalid");
    } else if (state.pcs <= 0) {
      alert("Data Pcs(koli) invalid");
    } else if (state.kg <= 0) {
      alert("Data Berat(kg) invalid");
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
            manifestNo: state.manifestNo,
            pcs: state.pcs,
            kg: state.kg,
            remark: state.remark,
            statusBag: "Menunggu Vendor",
          },
        ]);
        setState({
          ...state,
          sumPcs: state.sumPcs + parseInt(state.pcs),
          sumWeight: state.sumWeight + parseFloat(state.kg),
          manifestNo: "AMI/MTS/00",
          pcs: "",
          kg: "",
          remark: "",
        });
      }
    }
  };

  const handleRemove = (manifestNo, pcs, kg) => {
    if (confirm("Hapus bag?") == true) {
      setBagList((current) =>
        current.filter((number) => {
          return number.manifestNo !== manifestNo;
        })
      );
      setState({
        ...state,
        sumPcs: state.sumPcs - pcs,
        sumWeight: state.sumWeight - kg,
      });
    }
  };

  const handleApproval = () => {
    if (state.origin == state.destination) {
      alert("Destinasi tidak boleh sama dengan Origin");
    } else if (state.origin == "") {
      alert("Origin kosong, harap refresh halaman, atau login ulang");
    } else if (state.preparedBy == "") {
      alert("Nama checker kosong, harap refresh halaman, atau login ulang");
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
          `signatures/${year}-${n}/checkerSign.png`
        );
        try {
          uploadString(storageRef, img64, "data_url", metaData).then(
            (snapshot) => {
              getDownloadURL(snapshot.ref).then(async (url) => {
                db.push({
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
                  sumPcs: state.sumPcs,
                  sumWeight: state.sumWeight,
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
                    setLoading(false);
                    alert("Approved");
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
    setState({ ...state, origin: auth.origin, preparedBy: auth.name });
    if (auth.origin == "VENDOR") {
      navigate("/vendor");
    }
    db.on("value", (snapshot) => {
      let count = 0;
      snapshot.forEach((childSnapshot) => {
        if (!childSnapshot.val().noSurat.includes("_")) {
          count++;
        }
      });
      let zerofilled = ("00000" + (count + 1)).slice(-5);
      setState({
        ...state,
        noSurat: `AMI/MTM/${year}/${zerofilled}`,
      });
      setN(zerofilled);
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
                onChange={handleChange}
                value={state.destination || ""}
                disabled={loading ? true : false}
              >
                {destList.map((item, id) => (
                  <option key={id} value={item.name}>
                    {item.name}
                  </option>
                ))}
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
                    onChange={handleChange}
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
            <thead style={{ position: "sticky", top: "0" }}>
              <tr>
                <th>No.</th>
                <th>Manifest No.</th>
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
                    <td>{item.pcs}</td>
                    <td>{item.kg}</td>
                    <td>{item.remark}</td>
                    <td>
                      <Button
                        variant="danger"
                        disabled={loading ? true : false}
                        onClick={() =>
                          handleRemove(item.manifestNo, item.pcs, item.kg)
                        }
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
        <Row>
          <Col>
            <p>Total Pcs : {state.sumPcs}</p>
            <p>Total Kg : {state.sumWeight}</p>
          </Col>
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
