import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import { BrowserRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";
const container = document.getElementById("root");
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import "bootstrap/dist/css/bootstrap.min.css";

const store = createStore({
  authName: "token",
  authType: "localStorage",
  cookieDomain: window.location.hostname,
  cookieSecure: false,
});

const root = createRoot(container);

root.render(
  <AuthProvider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </AuthProvider>,
);

reportWebVitals();
