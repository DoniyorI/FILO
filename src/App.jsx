import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
// import BarLoader from "react-spinners/BarLoader";

import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Nav";
import Home from "./components/Home";
import "./index.css";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setRegisterLoading(false);
    }, 5000);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Sidebar />
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="login"
          element={
            <>
              <Register />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
