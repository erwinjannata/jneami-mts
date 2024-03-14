/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { UseAuth } from "../config/authContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  Spinner,
} from "react-bootstrap";
import logo from "./../images/jne_brand.png";
import "./../styles/login.css";

export default function Login() {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const auth = UseAuth();
  let navigate = useNavigate();
  let location = useLocation();

  let redirectPath = location.state?.path || "/";

  const handleChange = (e) => {
    const value = e.target.value;
    setCreds({
      ...creds,
      [e.target.name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await auth.login(creds.email, creds.password);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user != null) {
      navigate(redirectPath);
    }
  }, [auth.user, navigate, redirectPath]);

  return (
    <div id="login">
      <Container>
        <Link to="/">
          <img src={logo} alt="JNE" />
        </Link>
        <Form className="mt-5 d-grid gap-2">
          <FloatingLabel
            controlId="floatingInput"
            label="Email"
            className="mb-3"
          >
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={creds.email}
              onChange={handleChange}
              disabled={loading ? true : false}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={creds.password}
              onChange={handleChange}
              autoComplete="off"
              disabled={loading ? true : false}
              required
            />
          </FloatingLabel>
          {loading ? (
            <Button variant="primary" disabled className="mt-4">
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {` Loading...`}
            </Button>
          ) : (
            <Button
              variant="primary"
              className="mt-4"
              type="submit"
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
        </Form>
      </Container>
    </div>
  );
}
