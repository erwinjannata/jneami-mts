import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./config/authContext";
import { PrivateRoute } from "./config/prirvateRoute";
import Login from "./pages/Guest/Login";
import Home from "./pages/General/Home";
import Create from "./pages/General/createDoc";
import Doc from "./pages/General/Doc";
import UnreceivedPage from "./pages/General/unreceived";
import Penarikan from "./pages/General/Penarikan";
import Vendor from "./pages/Vendor";
import VendorDoc from "./pages/Vendor/doc";
import FindManifestNumber from "./pages/General/findManifest";
import AddUser from "./pages/Admin/addUser";
import OriginDoc from "./pages/Origin/doc";
import DestinationDoc from "./pages/Destination/doc";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Guest User */}
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* JNE User */}
        {/* Home Page */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        {/* MTS */}
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <Create />
            </PrivateRoute>
          }
        />
        {/* Document Detail : General (Read Only) */}
        <Route
          path="/doc/:key"
          element={
            <PrivateRoute>
              <Doc />
            </PrivateRoute>
          }
        />
        {/* Document Detail : ORIGIN */}
        <Route
          path="/origin/doc/:key"
          element={
            <PrivateRoute>
              <OriginDoc />
            </PrivateRoute>
          }
        />
        {/* Document Detail : DESTINATION */}
        <Route
          path="/destination/doc/:key"
          element={
            <PrivateRoute>
              <DestinationDoc />
            </PrivateRoute>
          }
        />
        {/* Unreceived Page */}
        <Route
          path="/unreceived"
          element={
            <PrivateRoute>
              <UnreceivedPage />
            </PrivateRoute>
          }
        />
        {/* Download Data */}
        <Route
          path="/get"
          element={
            <PrivateRoute>
              <Penarikan />
            </PrivateRoute>
          }
        />
        {/* Find Manifest Number */}
        <Route
          path="/find"
          element={
            <PrivateRoute>
              <FindManifestNumber />
            </PrivateRoute>
          }
        />

        {/* Vendor */}
        {/* Home Page */}
        <Route
          path="/vendor"
          element={
            <PrivateRoute>
              <Vendor />
            </PrivateRoute>
          }
        />
        {/* Document Detail */}
        <Route
          path="vendor/doc/:key"
          element={
            <PrivateRoute>
              <VendorDoc />
            </PrivateRoute>
          }
        />

        {/* Super Admin */}
        {/* Register New User */}
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddUser />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
