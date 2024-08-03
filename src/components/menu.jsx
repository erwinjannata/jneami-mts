/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./../images/jne_brand.png";
import logoWhite from "./../images/jne_brand_white.png";
import "./../index.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UseAuth } from "./../config/authContext";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { MdHomeFilled } from "react-icons/md";
import { HiDocumentPlus } from "react-icons/hi2";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { BiSearchAlt } from "react-icons/bi";
import { CgDanger } from "react-icons/cg";
import { RiUserAddFill } from "react-icons/ri";
import { FaPlane } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { MenuItem, Sidebar, Menu } from "react-pro-sidebar";
import { useEffect, useState } from "react";

export default function NavMenu() {
  let menu = [
    {
      id: "0",
      nama: "Dashboard",
      link: "/",
      req: 1,
      icon: <MdHomeFilled size={20} />,
    },
    {
      id: "1",
      nama: "Manifest Transit",
      link: "/create",
      req: 1,
      icon: <HiDocumentPlus size={20} />,
    },
    {
      id: "2",
      nama: "Damage Report",
      link: "/damage/new",
      req: 5,
      icon: <CgDanger size={20} />,
    },
    {
      id: "3",
      nama: "Penarikan Data",
      link: "/get",
      req: 2,
      icon: <HiDocumentArrowDown size={20} />,
    },
    {
      id: "4",
      nama: "Cari No. Manifest",
      link: "/find",
      req: 1,
      icon: <BiSearchAlt size={20} />,
    },
    {
      id: "5",
      nama: "Vendor",
      link: "/vendor",
      req: 5,
      icon: <FaPlane size={20} />,
    },
    {
      id: "6",
      nama: "New User",
      link: "/add",
      req: 5,
      icon: <RiUserAddFill size={20} />,
    },
  ];

  let vendorMenu = [
    {
      id: "0",
      nama: "Dashboard",
      link: "/vendor",
      req: 1,
      icon: <MdHomeFilled size={20} />,
    },
    {
      id: "1",
      nama: "Penarikan Data",
      link: "/get",
      req: 1,
      icon: <HiDocumentArrowDown size={20} />,
    },
  ];

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const auth = UseAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(
    window.matchMedia("(max-width: 800px)").matches
  );

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  useEffect(() => {
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
  }, [windowSize.height, windowSize.width]);

  return (
    <>
      {windowSize.width > "1024" ? (
        <div
          style={{
            display: "flex",
            height: "100%",
            minHeight: windowSize.height,
            position: "sticky",
            top: 0,
          }}
        >
          <Sidebar
            collapsed={collapsed}
            transitionDuration={500}
            width="250px"
            customBreakPoint="1024px"
            onBreakPoint={setBroken}
            backgroundColor="#212529"
          >
            <Menu
              menuItemStyles={{
                button: ({ level }) => {
                  if (level === 0) {
                    return {
                      "&:hover": {
                        backgroundColor: "#31363F !important",
                        color: "white !important",
                        fontWeight: "bold !important",
                      },
                    };
                  }
                },
              }}
            >
              <Link to={auth.origin == "VENDOR" ? "/vendor" : "/"}>
                <img
                  src={logoWhite}
                  alt="JNE"
                  className="logo my-2"
                  style={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                  }}
                ></img>
              </Link>
              <hr className="mx-3" style={{ color: "#e9f5f9" }} />
              {auth.origin == "VENDOR" ? (
                <>
                  {vendorMenu.map((m) =>
                    auth.level >= m.req ? (
                      <MenuItem
                        key={m.id}
                        component={<Link to={m.link} />}
                        icon={m.icon}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#e9f5f9",
                        }}
                      >
                        {m.nama}
                      </MenuItem>
                    ) : null
                  )}
                </>
              ) : (
                <>
                  {menu.map((m) =>
                    auth.level >= m.req ? (
                      <MenuItem
                        key={m.id}
                        component={<Link to={m.link} />}
                        icon={m.icon}
                        style={{
                          color: "#e9f5f9",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {m.nama}
                      </MenuItem>
                    ) : null
                  )}
                </>
              )}
              <hr className="mx-3" style={{ color: "#e9f5f9" }} />
              <MenuItem disabled>{`${auth.name}`}</MenuItem>
              <MenuItem disabled>{`${auth.origin}`}</MenuItem>
              <Button
                variant="outline-danger"
                title="Log Out"
                onClick={handleLogout}
                className="mx-3"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LuLogOut /> Logout
              </Button>
            </Menu>
          </Sidebar>
        </div>
      ) : (
        <Navbar key="xl" expand="xl" className="bg-body-tertiary" sticky="top">
          <Container fluid>
            <Navbar.Brand>
              <Link to={auth.origin == "VENDOR" ? "/vendor" : "/"}>
                <img
                  src={logo}
                  alt="JNE"
                  className="logo"
                  style={{ height: "50px" }}
                ></img>
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-xl" />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-xl"
              aria-labelledby="offcanvasNavbarLabel-expand-xl"
              placement="start"
              bg="dark"
              data-bs-theme="dark"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xl`}>
                  <img
                    src={logoWhite}
                    alt="JNE"
                    className="logo"
                    style={{ height: "50px" }}
                  ></img>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {auth.origin == "VENDOR" ? (
                  <Nav className="me-auto my-2 my-lg-0">
                    {vendorMenu.map((m) => (
                      <Nav key={m.id}>
                        {auth.level >= m.req ? (
                          <Navbar.Text>
                            <NavLink
                              to={m.link}
                              style={({ isActive }) => ({
                                color: isActive ? "lightblue" : "white",
                              })}
                            >
                              {m.nama}
                            </NavLink>
                          </Navbar.Text>
                        ) : null}
                      </Nav>
                    ))}
                  </Nav>
                ) : (
                  <Nav className="me-auto my-2 my-lg-0">
                    {menu.map((m) => (
                      <Nav key={m.id}>
                        {auth.level >= m.req ? (
                          <Navbar.Text>
                            <NavLink
                              to={m.link}
                              style={({ isActive }) => ({
                                color: isActive ? "lightblue" : "white",
                              })}
                            >
                              {m.nama}
                            </NavLink>
                          </Navbar.Text>
                        ) : null}
                      </Nav>
                    ))}
                  </Nav>
                )}
                <Nav>
                  <hr />
                  <Form className="d-flex">
                    <Navbar.Text>{`${auth.name} | ${auth.origin}`}</Navbar.Text>
                    <Button
                      variant="outline-danger"
                      title="Log Out"
                      onClick={handleLogout}
                    >
                      <LuLogOut />
                    </Button>
                  </Form>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      )}
    </>
  );
}
