import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./config/authContext";
import { PrivateRoute } from "./config/prirvateRoute";
import Login from "./pages/Guest/Login";
import Home from "./pages/Last Mile/General/Home Page/Home";
import Doc from "./pages/Last Mile/General/Detail Document/Doc";
import UnreceivedPage from "./pages/Last Mile/General/Unreceived Manifest/unreceived";
import Penarikan from "./pages/Last Mile/General/Penarikan Data/Penarikan";
import FindManifestNumber from "./pages/Last Mile/General/Find Manifest/findManifest";
import AirportHomePage from "./pages/Mid Mile/General/Home";
import MidMileFindBag from "./pages/Mid Mile/General/Find Bag/find";
import AddUser from "./pages/Admin/addUser";
import ErrorListPage from "./pages/Admin/errorList";
import PenarikanMidMile from "./pages/Mid Mile/General/Penarikan Data/penarikan";
import InvalidMTSIndex from "./pages/Last Mile/Invalid Bag/invalidMTS";
import InsertInvalidMTS from "./pages/Last Mile/Invalid Bag/insertInvalidMTS";
import InvalidMTSDoc from "./pages/Last Mile/Invalid Bag/invalidMTSDoc";
import FindInvalidMTS from "./pages/Last Mile/Invalid Bag/findInvalidMTS";
import CreateMTS from "./pages/Last Mile/General/Create Document/Create";
import DetailDocument from "./pages/Mid Mile/Detail Document/Detail Document";
import MidMileCreateDoc from "./pages/Mid Mile/General/Create Doc/create";
import EMPUAddData from "./pages/EMPU/addData";
import EMPUCustomersList from "./pages/EMPU/customersList";
import EMPUFindData from "./pages/EMPU/findData";
import EMPUConfirm from "./pages/EMPU/confirm";
import EMPUDownloadData from "./pages/EMPU/downloadData";
import EMPUHome from "./pages/EMPU/Home";

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
          path: "/create2",
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
