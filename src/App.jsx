import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import BarLoader from "react-spinners/BarLoader";

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
              {loading ? (
                <div className="flex h-screen justify-center items-center">
                  <BarLoader color={"#EFA73E"} loading={loading} size={30} />
                </div>
              ) : (
                <>
                  <Sidebar />
                  <Navbar />
                  <Home />
                </>
              )}
            </>
          }
        />
        <Route
          path="login"
          element={
            <>
              {registerLoading ? (
                <div className="flex h-screen justify-center items-center">
                  <BarLoader
                    color={"#EFA73E"}
                    loading={registerLoading}
                    size={30}
                  />
                </div>
              ) : (
                <Register />
              )}
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
