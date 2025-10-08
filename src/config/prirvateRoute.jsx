/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { UseAuth } from "./authContext";

const PrivateRoute = ({ children }) => {
  const auth = UseAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }

  return children;
};

export default PrivateRoute;
