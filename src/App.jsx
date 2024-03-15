import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./../src/pages/createDoc";
import Doc from "./pages/Doc";
import Login from "./pages/Login";
import { AuthProvider } from "./config/authContext";
import { PrivateRoute } from "./config/prirvateRoute";
import Penarikan from "./pages/Penarikan";
import AddUser from "./pages/addUser";
import DamageReport from "./pages/damageReport";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <Create />
            </PrivateRoute>
          }
        />
        <Route
          path="/doc/:key"
          element={
            <PrivateRoute>
              <Doc />
            </PrivateRoute>
          }
        />
        <Route
          path="/get"
          element={
            <PrivateRoute>
              <Penarikan />
            </PrivateRoute>
          }
        />
        <Route
          path="/damage"
          element={
            <PrivateRoute>
              <DamageReport />
            </PrivateRoute>
          }
        />
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
