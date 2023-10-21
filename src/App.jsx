import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Navbar from "./components/Nav";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import "./index.css";
// import Home from "./components/Home";

export default function App() {
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
        {/* <Route path="/" element={<Navbar />} /> */}
        {/* <Route path="/" element={<Sidebar />} /> */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="login" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
