/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { utils, writeFile } from "xlsx";
import { MdFileDownload } from "react-icons/md";
import { UseAuth } from "../../config/authContext";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { cutOffTime } from "../../components/data/cutOffTime";
import { cabangList } from "../../components/data/branchList";
import "react-datepicker/dist/react-datepicker.css";
import firebase from "./../../config/firebase";
import DatePicker from "react-datepicker";
import NavMenu from "../../components/partials/navbarMenu";
import PieChart from "../../components/partials/pieChart";
import PenarikanListTable from "../../components/partials/penarikanListTable";
import moment from "moment";
import "moment/locale/en-ca";
import "moment/locale/id";
import { handleChange } from "../../components/functions/functions";

export default function Penarikan() {
  const d = new Date();
  const auth = UseAuth();
  const [state, setState] = useState({
    start: moment(d).locale("en-ca").format("L"),
    end: moment(d).locale("en-ca").format("L"),
    query: "approvedDate",
    showChart: false,
    origin: "",
    destination: "",
  });
  let db = firebase.database().ref("manifestTransit");
  const [dataList, setDataList] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  let radioList = [
    { label: "Approved Date", value: "approvedDate" },
    { label: "Departure Date", value: "departureDate" },
    { label: "Arrival Date", value: "arrivalDate" },
    { label: "Received Date", value: "receivedDate" },
  ];

  const handleSubmit = () => {
    var delta = Math.abs(new Date(state.start) - new Date(state.end)) / 1000;
    var days = Math.floor(delta / 86400);
    if (days <= 7) {
      setLoading(true);
      db.orderByChild(state.query)
        .limitToLast(1000)
        .startAt(state.start)
        .endAt(state.end)
        .on("value", (snapshot) => {
          let data = [];

          snapshot.forEach((childSnapshot) => {
            let berangkat = childSnapshot.val().departureDate
              ? `${moment(childSnapshot.val().departureDate)
                  .locale("id")
                  .format("L")} ${childSnapshot.val().departureTime}:00`
              : "";
            let tiba = childSnapshot.val().arrivalDate
              ? `${moment(childSnapshot.val().arrivalDate)
                  .locale("id")
                  .format("L")} ${childSnapshot.val().arrivalTime}:00`
              : `${moment(d).locale("id").format("L")} ${moment(d)
                  .locale("id")
                  .format("LT")}:00`;
            let dura = childSnapshot.val().departureDate
              ? moment(tiba, "DD/MM/YYYY HH:mm:ss").diff(
                  moment(berangkat, "DD/MM/YYYY HH:mm:ss")
                )
              : 0;
            let durasi = moment.duration(dura).asHours();

            let cot =
              cutOffTime.find(
                (data) =>
                  data.origin == childSnapshot.val().origin &&
                  data.destination == childSnapshot.val().destination
              ) || "";
            data.push({
              key: childSnapshot.key,
              durasiJam: durasi.toFixed(1),
              statusWaktu:
                durasi < cot.cot
                  ? durasi < cot.cot - 1
                    ? "Lebih Awal"
                    : "Tepat Waktu"
                  : durasi > cot.cot + 1
                  ? "Terlambat"
                  : "Tepat Waktu",
              ...childSnapshot.val(),
            });
          });

          var result = data;
          if (state.origin == "" && state.destination != "") {
            result = data.filter((datalist) => {
              return datalist["destination"] == state.destination;
            });
          } else if (state.origin != "" && state.destination == "") {
            result = data.filter((datalist) => {
              return datalist["origin"] == state.origin;
            });
          } else if (state.origin != "" && state.destination != "") {
            result = data.filter((datalist) => {
              return (
                datalist["origin"] == state.origin &&
                datalist["destination"] == state.destination
              );
            });
          }
          setDataList(result);
          setShow(true);
          setLoading(false);
        });
    } else {
      alert("Penarikan data dibatasi maksimum 7 hari");
    }
  };

  const handleDownload = () => {
    let processedData = [];
    dataList.map((row, idx) => {
      for (let i = 0; i < dataList[idx].bagList.length; i++) {
        processedData.push({
          noManifest: dataList[idx].bagList[i].manifestNo,
          koli:
            dataList[idx].bagList[i].koli == undefined
              ? "-"
              : parseFloat(dataList[idx].bagList[i].koli),
          pcs: parseFloat(dataList[idx].bagList[i].pcs),
          kg: parseFloat(dataList[idx].bagList[i].kg),
          remark: dataList[idx].bagList[i].remark,
          statusBag: dataList[idx].bagList[i].statusBag,
          noSurat: row.noSurat,
          noRef: row.noRef,
          origin: row.origin,
          destination: row.destination,
          status: row.status,
          preparedBy: row.preparedBy,
          approvedDate: new Date(
            new Date(row.approvedDate).setHours(
              row.approvedTime.split(":")[0],
              row.approvedTime.split(":")[1],
              0
            )
          ),
          receivedBy: row.receivedBy,
          receivedDate:
            row.receivedDate == ""
              ? ""
              : new Date(
                  new Date(row.receivedDate).setHours(
                    row.receivedTime.split(":")[0],
                    row.receivedTime.split(":")[1],
                    0
                  )
                ),
          departureDate:
            row.departureDate == ""
              ? ""
              : new Date(
                  new Date(row.departureDate).setHours(
                    row.departureTime.split(":")[0],
                    row.departureTime.split(":")[1],
                    0
                  )
                ),
          arrivalDate:
            row.arrivalDate == ""
              ? ""
              : new Date(
                  new Date(row.arrivalDate).setHours(
                    row.arrivalTime.split(":")[0],
                    row.arrivalTime.split(":")[1],
                    0
                  )
                ),
          durasi: parseFloat(row.durasiJam),
          noPolisi: row.noPolisi,
          driver: row.driver,
          // statusWaktu: row.statusWaktu,
        });
      }
    });
    const worksheet = utils.json_to_sheet(processedData.reverse());
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data List");
    utils.sheet_add_aoa(
      worksheet,
      [
        [
          "No. Manifest",
          "Koli",
          "Pcs",
          "Kg",
          "Remark",
          "Status Bag",
          "No. Surat Manifest",
          "No. Referensi Vendor",
          "Origin",
          "Destination",
          "Status Manifest",
          "Approved by",
          "Approved Date",
          "Received by",
          "Received Date",
          "Tanggal Keberangkatan",
          "Tanggal Kedatangan",
          "Durasi Perjalanan (Jam)",
          "No. Polisi Kendaraan",
          "Driver",
          // "Status Waktu",
        ],
      ],
      { origin: "A1" }
    );
    writeFile(
      workbook,
      `MTM ${moment(state.start).locale("id").format("LL")} - ${moment(
        state.end
      )
        .locale("id")
        .format("LL")}.xlsx`
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      setWindowSize({
        ...windowSize,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [auth.origin]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Penarikan Data</h2>
        <hr />
        <Row className="mb-4">
          <h4>Query : </h4>
          <Col>
            <Form className="mt-2">
              {radioList.map((item, idx) => (
                <Form.Check
                  key={idx}
                  inline
                  defaultChecked={idx == 0 ? true : false}
                  label={item.label}
                  type="radio"
                  name="query"
                  value={item.value}
                  onChange={() => handleChange(event, state, setState)}
                />
              ))}
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <label htmlFor="startDate" className="mx-2">
              <strong>{`Dari :`}</strong>
            </label>
            <DatePicker
              title="Start Date"
              placeholder="Start Date"
              className="form-control form-control-solid"
              selected={state.start}
              onChange={(date) =>
                setState({
                  ...state,
                  start: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
          <Col>
            <label htmlFor="endDate" className="mx-2">
              <strong>{`Hingga :`}</strong>
            </label>
            <DatePicker
              id="endDate"
              title="End Date"
              placeholder="End Date"
              className="form-control form-control-solid"
              selected={state.end}
              onChange={(date) =>
                setState({
                  ...state,
                  end: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <FloatingLabel controlId="floatingSelectData" label="Origin">
              <Form.Select
                aria-label="Origin"
                name="origin"
                onChange={() => handleChange(event, state, setState)}
                value={state.origin}
              >
                <option value="">All Cabang</option>
                {cabangList.map((item, id) => (
                  <option key={id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingSelectData" label="Destination">
              <Form.Select
                aria-label="Destination"
                name="destination"
                onChange={() => handleChange(event, state, setState)}
                value={state.destination}
              >
                <option value="">All Cabang</option>
                {cabangList.map((item, id) => (
                  <option key={id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button
              variant="primary"
              className={windowSize.width >= 768 ? "mx-2" : "mx-0"}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Go"}
            </Button>
            {dataList.length == 0 ? null : (
              <>
                <Button
                  variant="success"
                  className="mx-2"
                  onClick={handleDownload}
                >
                  <MdFileDownload /> Download
                </Button>
                <Button
                  variant="outline-secondary"
                  className="mx-0"
                  onClick={() => {
                    setDataList([]);
                    setShow(false);
                    setState({
                      ...state,
                      origin: "",
                      destination: "",
                      showChart: false,
                    });
                  }}
                >
                  Clear
                </Button>
                <div
                  className={windowSize.width >= 768 ? "float-end" : " mt-2"}
                >
                  <Button
                    variant="outline-dark"
                    onClick={() =>
                      setState({ ...state, showChart: !state.showChart })
                    }
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {state.showChart ? (
                      <FaEyeSlash
                        style={{
                          marginRight: "5px",
                        }}
                      />
                    ) : (
                      <FaEye
                        style={{
                          marginRight: "5px",
                        }}
                      />
                    )}{" "}
                    {state.showChart ? " Hide Chart" : " Show Chart"}
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>
        <hr />
        {state.showChart && dataList.length != 0 ? (
          <>
            <Row>
              <Col xs={windowSize.width >= 768 ? 4 : 0}>
                <PieChart type="status" data={dataList} />
              </Col>
              <Col xs={windowSize.width >= 768 ? 4 : 0}>
                <PieChart type="waktu" data={dataList} />
              </Col>
              <Col xs={windowSize.width >= 768 ? 4 : 0}>
                {windowSize.width >= 768 ? null : <hr />}
                <PieChart type="destination" data={dataList} />
              </Col>
            </Row>
            <hr />
          </>
        ) : null}
        <PenarikanListTable data={dataList} />
      </Container>
    </div>
  );
}
