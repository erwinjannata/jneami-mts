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
import MidMileCreateDoc from "./pages/Mid Mile/Airport/Create Doc/create";
import ErrorListPage from "./pages/Admin/errorList";
import EMPUIndex from "./pages/Mid Mile/Airport/EMPU/empuIndex";
import EMPUAddData from "./pages/Mid Mile/Airport/EMPU/addData";
import EMPUCustomersList from "./pages/Mid Mile/Airport/EMPU/customersList";
import EMPUFindData from "./pages/Mid Mile/Airport/EMPU/findData";
import EMPUDownloadData from "./pages/Mid Mile/Airport/EMPU/downloadData";
import EMPUConfirm from "./pages/Mid Mile/Airport/EMPU/confirm";
import PenarikanMidMile from "./pages/Mid Mile/General/Penarikan Data/penarikan";
import InvalidMTSIndex from "./pages/Last Mile/Invalid Bag/invalidMTS";
import InsertInvalidMTS from "./pages/Last Mile/Invalid Bag/insertInvalidMTS";
import InvalidMTSDoc from "./pages/Last Mile/Invalid Bag/invalidMTSDoc";
import FindInvalidMTS from "./pages/Last Mile/Invalid Bag/findInvalidMTS";

function App() {
  const protectedRoute = [
    {
      menu: "Last Mile",
      submenus: [
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
      ],
    },
    {
      menu: "Kiriman Invalid",
      submenus: [
        {
          name: "Proses MTS",
          path: "/mts",
          element: <InvalidMTSIndex />,
        },
        {
          name: "Document Detail (MTS)",
          path: "/mts/d/:key",
          element: <InvalidMTSDoc />,
        },
        {
          name: "Insert MTS",
          path: "/mts/insert",
          element: <InsertInvalidMTS />,
        },
        {
          name: "Find Data",
          path: "/mts/find",
          element: <FindInvalidMTS />,
        },
        {
          name: "Download Data MTS",
          path: "/mts/get",
          element: <InsertInvalidMTS />,
        },
      ],
    },
    {
      menu: "Mid Mile",
      submenus: [
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
          name: "Penarikan Data",
          path: "/mm/download",
          element: <PenarikanMidMile />,
        },
      ],
    },
    {
      menu: "EMPU",
      submenus: [
        {
          name: "EMPU Index",
          path: "/empu",
          element: <EMPUIndex />,
        },
        {
          name: "EMPU Add Data",
          path: "/empu/add",
          element: <EMPUAddData />,
        },
        {
          name: "EMPU Customers List",
          path: "/empu/customers",
          element: <EMPUCustomersList />,
        },
        {
          name: "EMPU Find Transaction",
          path: "/empu/find",
          element: <EMPUFindData />,
        },
        {
          name: "EMPU Konfirmasi Credit",
          path: "/empu/confirm",
          element: <EMPUConfirm />,
        },
        {
          name: "EMPU Download Data",
          path: "/empu/get",
          element: <EMPUDownloadData />,
        },
      ],
    },
    {
      menu: "Vendor",
      submenus: [
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
      ],
    },
    {
      menu: "Admin",
      submenus: [
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
      ],
    },
  ];

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        {protectedRoute.map((menu) => (
          <Route key={menu.menu}>
            {menu.submenus.map((route) => (
              <Route
                key={route.name}
                path={route.path}
                element={<PrivateRoute>{route.element}</PrivateRoute>}
              />
            ))}
          </Route>
        ))}
      </Routes>
    </AuthProvider>
  );
}

export default App;
