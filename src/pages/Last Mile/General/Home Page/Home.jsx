/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { handleChange } from "../../../../components/functions/functions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../../../config/authContext";
import { cabangList } from "../../../../components/data/branchList";
import NavMenu from "../../../../components/partials/navbarMenu";
import DocListTable from "../../../../components/partials/documentListTable";
import CategoryCards from "../../../../components/partials/categoryCards";
import { fetchData, handleSearch } from "./functions";
import ShowItemSelector from "../../../../components/partials/showItemSelector";

export default function Home() {
  const auth = UseAuth();
  let navigate = new useNavigate();
  const [documentList, setDocumentList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    search: "",
    limit: 50,
    filtered: false,
    currentFilter: "",
    origin: "All Cabang",
    destination: "All Cabang",
  });

  useEffect(() => {
    fetchData({
      route: navigate,
      userOrigin: auth.origin,
      state: state,
      setLoading: setLoading,
      setDocumentList: setDocumentList,
      setShowList: setShowList,
    });
  }, [auth.origin, auth.name, state.origin, state.destination, state.limit]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <Row>
          <CategoryCards
            documents={documentList}
            state={state}
            loading={loading}
            setShowList={setShowList}
            setState={setState}
          />
        </Row>
        <Row className="mt-2">
          <form
            onSubmit={() =>
              handleSearch({
                e: event,
                search: state.search,
                documents: showList,
                oldDocuments: documentList,
                setShowList: setShowList,
              })
            }
          >
            <FloatingLabel
              controlId="floatingInputNo"
              label="No. Surat"
              className="mt-2"
            >
              <Form.Control
                type="text"
                name="search"
                value={state.search}
                placeholder="No. Surat"
                disabled={loading}
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
              />
            </FloatingLabel>
          </form>
        </Row>
        <Row className="mt-2">
          <Col sm>
            <FloatingLabel
              controlId="floatingSelectData"
              label="Origin"
              className="mt-2"
            >
              <Form.Select
                aria-label="Origin"
                name="origin"
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
                value={state.origin}
                disabled={loading}
              >
                <option value="All Cabang">All Cabang</option>
                {cabangList.map((item, id) => (
                  <option key={id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel
              controlId="floatingSelectData"
              label="Destination"
              className="mt-2"
            >
              <Form.Select
                aria-label="Destination"
                name="destination"
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
                value={state.destination}
                disabled={loading}
              >
                <option value="All Cabang">All Cabang</option>
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
        <div className="border rounded p-2">
          <DocListTable data={showList} loading={loading} />
        </div>
        <hr />
        <ShowItemSelector state={state} loading={loading} setState={setState} />
      </Container>
    </div>
  );
}
