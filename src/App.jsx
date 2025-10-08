import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/config/authContext";
import PrivateRoute from "@/config/prirvateRoute";
import Home from "@/pages/Last Mile/Home Page/Home";
import CreateMTS from "@/pages/Last Mile/Create Document/Create";
import Doc from "@/pages/Last Mile/Detail Document/Doc";
import UnreceivedPage from "./pages/Last Mile/Unreceived Manifest/unreceived";
import Penarikan from "./pages/Last Mile/Penarikan Data/Penarikan";
import FindManifestNumber from "./pages/Last Mile/Find Manifest/findManifest";
import InvalidMTSIndex from "./pages/Last Mile/Invalid Bag/invalidMTS";
import InvalidMTSDoc from "./pages/Last Mile/Invalid Bag/invalidMTSDoc";
import InsertInvalidMTS from "./pages/Last Mile/Invalid Bag/insertInvalidMTS";
import FindInvalidMTS from "./pages/Last Mile/Invalid Bag/findInvalidMTS";
import AirportHomePage from "./pages/Mid Mile/Home";
import MidMileCreateDoc from "./pages/Mid Mile/Create Doc/create";
import DetailDocument from "./pages/Mid Mile/Detail Document/Detail Document";
import MidMileFindBag from "./pages/Mid Mile/Find Bag/find";
import PenarikanMidMile from "./pages/Mid Mile/Penarikan Data/penarikan";
import AddUser from "./pages/Admin/addUser";
import ErrorListPage from "./pages/Admin/errorList";
import Login from "./pages/Guest/Login";
import EMPUHome from "./pages/EMPU/Inbound/Home/Home";
import EMPUAddData from "./pages/EMPU/Inbound/Create Transaction/addData";
import EMPUCustomersList from "./pages/EMPU/Inbound/Customer/customersList";
import EMPUFindData from "./pages/EMPU/Find Transaction/findData";
import EMPUConfirm from "./pages/EMPU/Inbound/Confirm Credit Payment/confirm";
import EMPUDownloadData from "./pages/EMPU/Download Transaction Data/downloadData";
import EMPUOutboundAdd from "./pages/EMPU/Outbound/Create Transaction/create";

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
          name: "Create MTS Document",
          path: "/create",
          element: <CreateMTS />,
        },
        {
          name: "Document Detail (Read Only)",
          path: "/d/:key",
          element: <Doc />,
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
          name: "Document Detail",
          path: "/mm/d/:key",
          element: <DetailDocument />,
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
          element: <EMPUHome />,
        },
        {
          name: "EMPU Inbound Add Data",
          path: "/empu/inbound/add",
          element: <EMPUAddData />,
        },
        {
          name: "EMPU Outbound Add Data",
          path: "/empu/outbound/add",
          element: <EMPUOutboundAdd />,
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
