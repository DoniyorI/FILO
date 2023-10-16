import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Register"; 
import Home from "./components/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="Login" element={<Login />} />
          <Route path="Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}




