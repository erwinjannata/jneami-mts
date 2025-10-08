import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../config/authContext";
import firebase from "@/config/firebase";
import { cabangList } from "../../components/data/branchList";
import { handleChange } from "../../components/functions/functions";

export default function AddUser() {
  const auth = UseAuth();

  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    email: "",
    name: "",
    origin: "MATARAM",
    level: 1,
  });

  const handleSubmit = (e, name, email, password, origin, level) => {
    if (name !== "" && auth.level === 5) {
      e.preventDefault();
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (data) => {
          const database = firebase.database().ref();

          await database
            .child(`users/${data.user.uid}`)
            .set({
              name: name,
              origin: origin,
              permissionLevel: level,
            })
            .then(() => {
              setLoading(false);
              alert("Registered");
            });
          setState({
            ...state,
            name: "",
            email: "",
            origin: "MATARAM",
            level: 1,
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("Nama tidak boleh kosong");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (auth.level < 5) {
      navigate("/");
    }
  }, [auth.level, navigate]);

  return (
    <Container>
      <h2>Add User</h2>
      <hr />
      <Form>
        <FloatingLabel controlId="floatingName" label="Nama" className="mb-3">
          <Form.Control
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            value={state.name}
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
            required
          />
        </FloatingLabel>
        <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
          <Form.Control
            type="email"
            name="email"
            placeholder="Email"
            value={state.email}
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
            required
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingCabang"
          label="Cabang / Agen"
          className="mb-3"
        >
          <Form.Select
            aria-label="Cabang / Agen"
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
            name="origin"
            value={state.origin}
          >
            {cabangList.map((item, id) => (
              <option key={id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingLevel"
          label="Permission Level"
          className="mb-3"
        >
          <Form.Select
            aria-label="Permission Level"
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
            name="level"
            value={state.level}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Form.Select>
        </FloatingLabel>
      </Form>
      {loading ? (
        <Button variant="primary">Loading...</Button>
      ) : (
        <Button
          variant="primary"
          onClick={(e) =>
            handleSubmit(
              e,
              state.name,
              state.email,
              "12345678",
              state.origin,
              state.level
            )
          }
        >
          Add User
        </Button>
      )}
    </Container>
  );
}
