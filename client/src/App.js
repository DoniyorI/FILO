import React from "react";
import "./App";
import Register from "./components/Register";

const App = () => {
  return (
    <div class="reg_background flex justify-center items-center h-screen">
      <div class=" glass_window w-[80vw] h-[85vh] shadow-2xl text-5xl">
        <Register />
      </div>
    </div>
  );
};

export default App;
