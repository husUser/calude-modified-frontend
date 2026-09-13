import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import RoutesConfig from "./RoutesConfig"; // Separate file for routing
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const auth = useAuthUser();
  const navigate = useNavigate();

  return (
    <>
      <RoutesConfig />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
