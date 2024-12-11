/* eslint-disable no-unused-vars */
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../config/authContext";
import firebase from "./../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";
import { cabangList } from "../../components/data/branchList";

export default function AddUser() {
  const auth = UseAuth();
  const dbRef = firebase.database();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState({
    email: "",
    name: "",
    origin: "MATARAM",
    level: 1,
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setCreds({
      ...creds,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e, name, email, password, origin, level) => {
    if (name != "") {
      e.preventDefault();
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (data) => {
          await dbRef
            .ref(`users/${data.user.uid}`)
            .set({
              name: name,
              origin: origin,
              permissionLevel: level,
            })
            .then(() => {
              setLoading(false);
              alert("Registered");
            });
          setCreds({
            ...creds,
            name: "",
            email: "",
            origin: "MATARAM",
            level: 1,
          });
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
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
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Add User</h2>
        <hr />
        <Form>
          <FloatingLabel controlId="floatingName" label="Nama" className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={creds.name}
              onChange={handleChange}
              required
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingEmail"
            label="Email"
            className="mb-3"
          >
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={creds.email}
              onChange={handleChange}
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
              onChange={handleChange}
              name="origin"
              value={creds.origin}
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
              onChange={handleChange}
              name="level"
              value={creds.level}
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
                creds.name,
                creds.email,
                "12345678",
                creds.origin,
                creds.level
              )
            }
          >
            Add User
          </Button>
        )}
      </Container>
    </div>
  );
}
