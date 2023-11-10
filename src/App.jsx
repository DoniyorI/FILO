import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import UserContext, { useFetchUser } from "./components/UserContext";

import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Nav";
import Home from "./components/Home";
import Messages from "./components/Messages";
import SidebarMsg from "./components/SidebarMsg";
import "./index.css";

export default function App() {
  const { user, setUser, dmUsers, setDmUsers, channels, setChannels } =
    useFetchUser();

  return (
    <UserContext.Provider
      value={{ user, setUser, dmUsers, setDmUsers, channels, setChannels }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Sidebar/>
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
          <Route
            path="messages/:channel_name"
            element={
              <>
                <SidebarMsg/>
                <Navbar />
                <Messages />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
