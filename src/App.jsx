import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Register />} />
          <Route path="/login/new_user" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}




