/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { UseAuth } from "../../config/authContext";
import { cabangList } from "../../components/data/branchList";
import {
  handleChange,
  handleCabang,
} from "./../../components/functions/functions";
import firebase from "./../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";
import CategoryCards from "../../components/partials/categoryCards";
import DocListTable from "../../components/partials/documentListTable";

export default function Vendor() {
  const auth = UseAuth();
  const dbRef = firebase.database().ref("manifestTransit/");
  // const dbRef = firebase.database().ref("test/manifestTransit/");
  const [state, setState] = useState({
    searched: "",
    limit: 50,
    filtered: false,
    currentFilter: "",
    origin: "",
    destination: "",
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [data, setData] = useState([]);
  const [showList, setShowList] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    let searchResult = [];

    if (state.searched !== "") {
      data.forEach((item) => {
        item.bagList.forEach((bag) => {
          let find = bag.manifestNo.replace(/ /g, "");
          if (find.includes(state.searched)) {
            searchResult.push(item);
          }
        });
      });
      setShowList(searchResult);
    } else {
      setShowList(data);
    }
    // datalist.noSurat.toUpperCase().includes(state.searched)
  };

  const handleFilter = (status) => {
    if (state.filtered == true && state.currentFilter == status) {
      setShowList(data);
      setState({ ...state, filtered: false, currentFilter: "" });
    } else {
      setShowList(data.filter((datalist) => datalist.status.includes(status)));
      setState({ ...state, filtered: true, currentFilter: status });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dbRef.limitToLast(parseInt(state.limit)).on("value", (snapshot) => {
      let list = [];
      snapshot.forEach((childSnapshot) => {
        list.push({
          key: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      var result = list;
      if (state.origin == "" && state.destination != "") {
        result = list.filter((datalist) => {
          return datalist["destination"] == state.destination;
        });
      } else if (state.origin != "" && state.destination == "") {
        result = list.filter((datalist) => {
          return datalist["origin"] == state.origin;
        });
      } else if (state.origin != "" && state.destination != "") {
        result = list.filter((datalist) => {
          return (
            datalist["origin"] == state.origin &&
            datalist["destination"] == state.destination
          );
        });
      }
      setData(result);
      setShowList(result);
    });

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
  }, [
    auth.origin,
    auth.name,
    auth.level,
    state.limit,
    state.origin,
    state.destination,
  ]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Manifest Transit JNE AMI</h2>
        <hr />
        <Row>
          <CategoryCards
            data={data}
            windowSize={windowSize}
            state={state}
            handler={handleFilter}
          />
        </Row>
        <Row className="mt-4">
          <Col>
            <FloatingLabel controlId="floatingSelectData" label="Origin">
              <Form.Select
                aria-label="Origin"
                name="origin"
                onChange={() => handleCabang(event, state, setState)}
                value={state.origin}
              >
                <option value="">ALL DATA</option>
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
                onChange={() => handleCabang(event, state, setState)}
                value={state.destination}
              >
                <option value="">ALL DATA</option>
                {cabangList.map((item, id) => (
                  <option key={id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <hr />
        <Row className="mb-3">
          <Col>
            <Form onSubmit={handleSearch}>
              <FloatingLabel
                controlId="floatingInput"
                label="No. Manifest / Bag"
              >
                <Form.Control
                  type="text"
                  name="searched"
                  placeholder="Cari no. manifest / bag"
                  value={state.searched}
                  onChange={() => handleChange(event, state, setState)}
                />
              </FloatingLabel>
            </Form>
          </Col>
        </Row>
        <DocListTable data={showList} />
        <hr />
        <Row>
          <Col xl={1} xs={4}>
            <FloatingLabel controlId="floatingSelectShow" label="Show">
              <Form.Select
                aria-label="Show"
                name="limit"
                onChange={() => handleChange(event, state, setState)}
                value={state.limit}
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
