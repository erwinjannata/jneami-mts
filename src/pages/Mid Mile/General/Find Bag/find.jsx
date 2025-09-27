import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { handleChange } from "../../../../components/functions/functions";
import { useState } from "react";
import NavMenu from "../../../../components/partials/navbarMenu";
import firebase from "../../../../config/firebase";
import BagTable from "./partials/bagTable";
import LoadingAnimation from "../../../../components/partials/loading";

const MidMileFindBag = () => {
  // Initialize Database Reference
  const [state, setState] = useState({
    bagNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [bags, setBags] = useState([]);

  const fetchData = () => {
    setLoading(true);

    const database = firebase.database().ref();

    database
      .child("midMile/bags")
      .orderByChild("bagNumber")
      .equalTo(state.bagNumber.toUpperCase().replace(/ /g, ""))
      .on("value", (snapshot) => {
        if (snapshot.exists) {
          setBags([]);
          snapshot.forEach((childSnapshot) => {
            setBags((prev) => [
              ...prev,
              { key: childSnapshot.key, ...childSnapshot.val() },
            ]);
          });
          setLoading(false);
          setShow(true);
        }
      });
  };

  const clearData = () => {
    setShow(false);
    setBags([]);
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Cari Bag</h2>
        <hr />
        <div className="rounded border p-4">
          <FloatingLabel
            controlId="floatingInput"
            label="No. Manifest / Bag"
            className="mb-3"
          >
            <Form.Control
              name="bagNumber"
              type="text"
              placeholder="No. Manifest / Bag"
              onChange={() =>
                handleChange({ e: event, state: state, stateSetter: setState })
              }
            />
          </FloatingLabel>
          {loading ? (
            <LoadingAnimation />
          ) : (
            <>
              <Button variant="primary" onClick={() => fetchData()}>
                Cari
              </Button>
              {show ? (
                <Button
                  variant="outline-secondary"
                  className="mx-2"
                  onClick={() => clearData()}
                >
                  Clear
                </Button>
              ) : null}
            </>
          )}
          <hr />
          {show ? <BagTable bags={bags} /> : null}
        </div>
      </Container>
    </div>
  );
};

export default MidMileFindBag;
