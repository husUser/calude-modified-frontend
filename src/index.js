import React from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
const container = document.getElementById("root");
import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit';
import "bootstrap/dist/css/bootstrap.min.css";


const store = createStore({
	authName:'token',
	authType:'localStorage',
	cookieDomain: window.location.hostname,
	cookieSecure: false
  });

const root = createRoot(container);

root.render(
  <AuthProvider
  store={store}
 >
 <BrowserRouter>
   <App />
 </BrowserRouter>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
