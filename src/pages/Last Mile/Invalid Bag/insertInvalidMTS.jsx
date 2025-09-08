/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import "./../../../index.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../../../config/authContext";
import NavMenu from "../../../components/partials/navbarMenu";
import firebase from "./../../../config/firebase";
import { handleChange } from "../../../components/functions/functions";
import { cabangList } from "../../../components/data/branchList";
import LoadingAnimation from "../../../components/partials/loading";
import NotFound from "../../../components/partials/notFound";
import { FaRegTrashAlt } from "react-icons/fa";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function InsertInvalidMTS() {
  const auth = UseAuth();
  const navigate = useNavigate();
  const database = firebase.database();

  const [state, setState] = useState({
    mtsNo: "",
    origin: "",
    destination: "",
    originUser: "",
    destinationUser: "",
    awb: "",
    quantity: 1,
  });
  const [awbList, setAWBList] = useState([]);
  const [loading, setLoading] = useState(false);

  let formsList = [
    {
      name: "awb",
      text: "AWB",
      type: "text",
      xs: "",
      value: state.awb,
    },
    {
      name: "quantity",
      text: "Quantity",
      type: "number",
      xs: "auto",
      value: state.quantity,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.awb == "") {
      alert("AWB invalid");
    } else if (state.quantity <= 0) {
      alert("Quantity invalid");
    } else {
      const isExist = awbList.some(
        (element) => element.awb.toUpperCase() === state.awb.toUpperCase()
      );

      if (isExist) {
        alert("AWB sudah melalui proses MTS");
        return;
      }

      setAWBList([
        ...awbList,
        {
          awb: state.awb.toUpperCase(),
          quantity: state.quantity,
          mtsDate: moment().local("fr-ca").format("L LT"),
        },
      ]);
      var items = JSON.parse(localStorage.getItem("awbList")) || [];
      items.push({
        awb: state.awb.toUpperCase(),
        quantity: state.quantity,
        mtsDate: moment().local("fr-ca").format("L LT"),
      });
      localStorage.setItem("awbList", JSON.stringify(items));
      setState({
        ...state,
        awb: "",
        quantity: 1,
      });
    }
  };

  const handleRemove = (index, awb) => {
    if (confirm("Hapus AWB?") == true) {
      setAWBList((current) =>
        current.filter((number) => {
          return number.awb !== awb;
        })
      );
      var items = JSON.parse(localStorage.getItem("awbList"));
      items.splice(index, 1);
      localStorage.setItem("awbList", JSON.stringify(items));
    }
  };

  const approve = async () => {
    if (state.destination === "") {
      alert("Pilih destinasi");
      return;
    } else if (state.origin === "") {
      alert(
        "Origin user tidak terbaca, silahkan kembali ke Halaman Utama dashboard atau login ulang"
      );
      return;
    } else if (awbList.length === 0) {
      alert("Tidak ada data AWB");
      return;
    }

    // Confirmation
    if (confirm("Approve Proses MTS?") === true) {
      // Proceed with upload
      try {
        setLoading(true);
        // Get Coding
        const selectedBranch = cabangList.find(
          (item) => item.name === state.destination
        );
        const destinationCoding = selectedBranch.coding;

        // Generate document number
        const counterRef = database
          .ref("status")
          .child(`invalidMTSLength/${state.destination.toLocaleLowerCase()}`);

        const { snapshot, mtsNumber } = await new Promise((resolve, reject) => {
          counterRef.transaction(
            (currentValue) => {
              const newValue = (currentValue || 0) + 1;
              return newValue;
            },
            (error, comitted, snapshot) => {
              if (error) {
                reject(error);
              } else if (!comitted) {
                reject(new Error("Transaction not committed"));
              } else {
                const documentNumber = snapshot.val();
                const zerofilled = ("000000" + documentNumber).slice(-6);
                const mtsNumber = `${destinationCoding}-${zerofilled}`;
                resolve({ snapshot, mtsNumber });
              }
            }
          );
        });

        // Get Key Reference
        const keyReference = database.ref("mts/document").push().key;

        await Promise.all([
          // Upload AWB data
          ...awbList.map((awb) => {
            return database.ref("mts/awb").push({
              mts_doc: keyReference,
              awb: awb.awb,
              quantity: awb.quantity,
              mtsDate: awb.mtsDate,
            });
          }),

          // Upload Document Data (MTS Bag)
          database.ref("mts/document").child(keyReference).set({
            mtsNo: mtsNumber,
            origin: state.origin,
            mtsUser: state.originUser,
            destination: state.destination,
            mtiUser: state.destinationUser,
            mtsDate: awbList[0].mtsDate,
          }),
        ]);

        localStorage.removeItem("awbList");
        alert("Proses MTS berhasil");
        navigate("/mts");
      } catch (error) {
        console.log(error);
        alert("Terjadi kesalahan saat mengupload data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setLoading(true);

    setState({ ...state, origin: auth.origin, originUser: auth.name });

    const items = JSON.parse(localStorage.getItem("awbList"));
    if (items) {
      setAWBList(items);
    }

    setLoading(false);
  }, [auth.origin]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Proses MTS</h2>
        <hr />
        <Row className="mb-4">
          <Col>
            <Form.Floating>
              <Form.Control
                id="flotaingOrigin"
                type="text"
                name="origin"
                defaultValue={state.origin}
                placeholder="Origin"
                readOnly
              />
              <label htmlFor="floatingOrigin">Origin</label>
            </Form.Floating>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingSelectGrid" label="Destination">
              <Form.Select
                aria-label="Destination Label"
                name="destination"
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
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
              <Col key={idx}>
                <Form.Floating className="mb-3">
                  <Form.Control
                    id={`${item.name}Input`}
                    type={item.type}
                    name={item.name}
                    value={item.value}
                    placeholder={item.text}
                    onChange={() =>
                      handleChange({
                        e: event,
                        state: state,
                        stateSetter: setState,
                      })
                    }
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
                onClick={() => {}}
                id="submitBtn"
              >
                Add
              </Button>
            </div>
          </Row>
        </form>
        <hr />
        <div>
          {loading ? (
            <LoadingAnimation />
          ) : (
            <div>
              {awbList.length == 0 ? null : (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <Table responsive hover borderless striped>
                    <thead
                      style={{ position: "sticky", top: "0", zIndex: "1" }}
                    >
                      <tr>
                        <th className="w-50">AWB</th>
                        <th className="w-50">Quantity</th>
                        <th className="w-50">MTS Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {awbList.map((item, id) => {
                        return (
                          <tr key={id}>
                            <td>{item.awb}</td>
                            <td>{item.quantity}</td>
                            <td>
                              {moment(Date.parse(item.mtsDate))
                                .locale("en-sg")
                                .format("LLL")}
                            </td>
                            <td className="items-end">
                              <Button
                                variant="danger"
                                disabled={loading ? true : false}
                                onClick={() => handleRemove(id, item.awb)}
                              >
                                <FaRegTrashAlt />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </div>
        <Row className="mt-4">
          <Col>
            {loading ? (
              <Spinner animation="grow" size="sm" />
            ) : (
              <div className="d-grid gap-2">
                <Button variant="dark" onClick={approve}>
                  Approve
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
