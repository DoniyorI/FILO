import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

// to bold and underline current page
// underline/bold home set to True
  // make sure you're on home page
  // use state

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// function welcome() {
//   document.getElementById("paragraph").innerHTML += "<br/>Live on Netflix";
// }
