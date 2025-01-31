/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./config/authContext";
import { PrivateRoute } from "./config/prirvateRoute";
import Login from "./pages/Guest/Login";
import Home from "./pages/Last Mile/General/Home";
import CreateDoc from "./pages/Last Mile/General/createDoc";
import Doc from "./pages/Last Mile/General/Doc";
import OriginDoc from "./pages/Last Mile/Origin/doc";
import DestinationDoc from "./pages/Last Mile/Destination/doc";
import UnreceivedPage from "./pages/Last Mile/General/unreceived";
import Penarikan from "./pages/Last Mile/General/Penarikan";
import FindManifestNumber from "./pages/Last Mile/General/findManifest";
import AirportHomePage from "./pages/Mid Mile/General/Home";
import MidMileDoc from "./pages/Mid Mile/Airport/Detail Doc/doc";
import MidMileFindBag from "./pages/Mid Mile/General/Find Bag/find";
import Vendor from "./pages/Last Mile/Vendor";
import VendorDoc from "./pages/Last Mile/Vendor/doc";
import AddUser from "./pages/Admin/addUser";
import MidMileInboundDoc from "./pages/Mid Mile/Admin Inbound/Detail Doc/doc";
import MidMileCreateDoc from "./pages/Mid Mile/Admin Inbound/Create Doc/create";
import ErrorListPage from "./pages/Admin/errorList";
import MidMilePrintContent from "./pages/Mid Mile/General/Print Component/print";

function App() {
  const protectedRoute = [
    // Last Mile
    {
      name: "Home",
      path: "/",
      element: <Home />,
    },
    {
      name: "Create Document",
      path: "/create",
      element: <CreateDoc />,
    },
    {
      name: "Document Detail (Read Only)",
      path: "/d/:key",
      element: <Doc />,
    },
    {
      name: "Document Detail (Origin)",
      path: "/or/d/:key",
      element: <OriginDoc />,
    },
    {
      name: "Document Detail (Destination)",
      path: "/ds/d/:key",
      element: <DestinationDoc />,
    },
    {
      name: "Unreceived",
      path: "/unreceived",
      element: <UnreceivedPage />,
    },
    {
      name: "Penarikan Data",
      path: "/get",
      element: <Penarikan />,
    },
    {
      name: "Cari Bag",
      path: "/find",
      element: <FindManifestNumber />,
    },

    // Mid Mile
    {
      name: "Home",
      path: "/mm",
      element: <AirportHomePage />,
    },
    {
      name: "Create Document",
      path: "/mm/create",
      element: <MidMileCreateDoc />,
    },
    {
      name: "Document Detail (Airport)",
      path: "/mm/a/d/:key",
      element: <MidMileDoc />,
    },
    {
      name: "Document Detail (Inbound)",
      path: "/mm/i/d/:key",
      element: <MidMileInboundDoc />,
    },
    {
      name: "Find Bag",
      path: "/mm/find",
      element: <MidMileFindBag />,
    },
    {
      name: "Print Content",
      path: "/mm/print",
      element: <MidMilePrintContent />,
    },

    // Vendor
    {
      name: "Home",
      path: "/v",
      element: <Vendor />,
    },
    {
      name: "Document Detail (Vendor)",
      path: "/v/d/:key",
      element: <VendorDoc />,
    },

    // Admin
    {
      name: "Register User",
      path: "/add",
      element: <AddUser />,
    },
    {
      name: "Error List",
      path: "/error",
      element: <ErrorListPage />,
    },
  ];

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        {protectedRoute.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<PrivateRoute>{route.element}</PrivateRoute>}
          />
        ))}
      </Routes>
    </AuthProvider>
  );
}

export default App;
