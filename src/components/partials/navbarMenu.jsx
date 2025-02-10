/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./../../index.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./../../images/jne_brand.png";
import logoWhite from "./../../images/jne_brand_white.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UseAuth } from "../../config/authContext";
import { Button, NavDropdown, Offcanvas } from "react-bootstrap";
import { MdHomeFilled, MdNearbyError } from "react-icons/md";
import { HiDocumentPlus } from "react-icons/hi2";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { BiSearchAlt, BiError } from "react-icons/bi";
import { RiAdminFill, RiUserAddFill } from "react-icons/ri";
import { FaBookOpen, FaFileInvoiceDollar, FaPlane } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { MenuItem, Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { useEffect, useState } from "react";
import { FaPlaneArrival, FaWarehouse } from "react-icons/fa";

export default function NavMenu() {
  const navMenuIconSize = 20;
  const navSubMenuIconSize = 18;
  let menu = [
    {
      label: "Last Mile",
      req: 1,
      icon: <FaWarehouse size={navMenuIconSize} />,
      items: [
        {
          label: "Dashboard",
          link: "/",
          req: 1,
          icon: <MdHomeFilled size={navSubMenuIconSize} />,
        },
        {
          label: "Manifest Transit",
          link: "/create",
          req: 1,
          icon: <HiDocumentPlus size={navSubMenuIconSize} />,
        },
        {
          label: "Unreceived",
          link: "/unreceived",
          req: 1,
          icon: <BiError size={navSubMenuIconSize} />,
        },
        {
          label: "Penarikan Data",
          link: "/get",
          req: 2,
          icon: <HiDocumentArrowDown size={navSubMenuIconSize} />,
        },
        {
          label: "Cari",
          link: "/find",
          req: 1,
          icon: <BiSearchAlt size={navSubMenuIconSize} />,
        },
      ],
    },
    {
      label: "Mid Mile",
      req: 2,
      icon: <FaPlaneArrival size={navMenuIconSize} />,
      items: [
        {
          label: "Dashboard",
          link: "/mm",
          req: 1,
          icon: <MdHomeFilled size={navSubMenuIconSize} />,
        },
        {
          label: "Input Data",
          link: "/mm/create",
          req: 2,
          icon: <HiDocumentPlus size={navSubMenuIconSize} />,
        },
        {
          label: "Cari",
          link: "/mm/find",
          req: 1,
          icon: <BiSearchAlt size={navSubMenuIconSize} />,
        },
        {
          label: "Personal",
          link: "/mm/personal",
          req: 1,
          icon: <FaFileInvoiceDollar size={navSubMenuIconSize} />,
        },
      ],
    },
    {
      label: "Manual Book",
      req: 1,
      icon: <FaBookOpen size={navMenuIconSize} />,
      items: [
        {
          label: "Mid Mile",
          link: "https://e-mts-manualbook.tiiny.site/",
          req: 1,
          icon: <FaPlaneArrival size={navSubMenuIconSize} />,
        },
      ],
    },
    {
      label: "Admin",
      req: 5,
      icon: <RiAdminFill size={navMenuIconSize} />,
      items: [
        {
          label: "Vendor",
          link: "/v",
          req: 5,
          icon: <FaPlane size={navSubMenuIconSize} />,
        },
        {
          label: "Error MTS",
          link: "/error",
          req: 5,
          icon: <MdNearbyError size={navSubMenuIconSize} />,
        },
        {
          label: "Registrasi User",
          link: "/add",
          req: 5,
          icon: <RiUserAddFill size={navSubMenuIconSize} />,
        },
      ],
    },
  ];

  let vendorMenu = [
    {
      label: "Dashboard",
      link: "/v",
      req: 1,
      icon: <MdHomeFilled size={navMenuIconSize} />,
    },
    {
      label: "Penarikan Data",
      link: "/get",
      req: 1,
      icon: <HiDocumentArrowDown size={navMenuIconSize} />,
    },
  ];

  const [currentOpen, setCurrentOpen] = useState(null);
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
          className="user-select-none"
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
            breakPoint="md"
            onBreakPoint={setBroken}
            backgroundColor="#212529"
          >
            <Menu>
              <Link to="/">
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
                  {vendorMenu.map((m, index) =>
                    auth.level >= m.req ? (
                      <MenuItem
                        id="navSubmenu"
                        key={index}
                        component={<Link to={m.link} />}
                        icon={m.icon}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#e9f5f9",
                        }}
                      >
                        {m.label}
                      </MenuItem>
                    ) : null
                  )}
                </>
              ) : (
                <>
                  {menu.map((submenu, subMenuIndex) =>
                    auth.level >= submenu.req ? (
                      <SubMenu
                        key={subMenuIndex}
                        id="navSubmenu"
                        label={submenu.label}
                        icon={submenu.icon}
                        open={currentOpen === subMenuIndex ? true : false}
                        onOpenChange={() => {
                          currentOpen === subMenuIndex
                            ? setCurrentOpen(null)
                            : setCurrentOpen(subMenuIndex);
                        }}
                      >
                        {submenu.items.map((menuItem, menuItemIndex) =>
                          auth.level >= menuItem.req ? (
                            <MenuItem
                              key={menuItemIndex}
                              component={<Link to={menuItem.link} />}
                              icon={menuItem.icon}
                              id="navItems"
                            >
                              {menuItem.label}
                            </MenuItem>
                          ) : null
                        )}
                      </SubMenu>
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
                    {vendorMenu.map((m, index) => (
                      <Nav key={index}>
                        {auth.level >= m.req ? (
                          <Navbar.Text>
                            <NavLink
                              to={m.link}
                              style={({ isActive }) => ({
                                color: isActive ? "lightblue" : "white",
                              })}
                            >
                              {m.label}
                            </NavLink>
                          </Navbar.Text>
                        ) : null}
                      </Nav>
                    ))}
                  </Nav>
                ) : (
                  <Nav className="me-auto my-2 my-lg-0">
                    {menu.map((menuItem, menuIndex) => (
                      <Nav key={menuIndex}>
                        {auth.level >= menuItem.req ? (
                          <NavDropdown title={menuItem.label} id="navSubMenu">
                            {menuItem.items.map((subMenuItem, subMenuIndex) => {
                              return auth.level >= subMenuItem.req ? (
                                <NavDropdown.Item
                                  as={Link}
                                  key={subMenuIndex}
                                  to={subMenuItem.link}
                                  id="navItems"
                                  style={{ backgroundColor: "#212529" }}
                                >
                                  {subMenuItem.label}
                                </NavDropdown.Item>
                              ) : null;
                            })}
                          </NavDropdown>
                        ) : null}
                      </Nav>
                    ))}
                  </Nav>
                )}
                <Nav>
                  <hr />
                  <Navbar.Text>{auth.name}</Navbar.Text>
                  <Navbar.Text>{auth.origin}</Navbar.Text>
                  <Button
                    variant="outline-danger"
                    title="Log Out"
                    onClick={handleLogout}
                  >
                    <LuLogOut /> {` Logout`}
                  </Button>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      )}
    </>
  );
}
