import React, { useState } from "react";
import "./register.css";

const App = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center reg_background ">
      <div
        className={`glass_window relative w-96 h-96 rounded-xl shadow-md ${
          isFlipped ? "spin" : ""
        }`}
      >
        <LoginForm onRegisterClick={() => setIsFlipped(true)} />
        <RegisterForm onLoginClick={() => setIsFlipped(false)} />
      </div>
    </div>
  );
};

const LoginForm = ({ onRegisterClick }) => {
  return (
    <div className="login_form flex flex-col justify-center px-8 rounded-xl">
      {/* <h1 className="text-4xl text-center font-bold color ">Welcome Back</h1>  */}
      <h1 className="text-4xl text-orange-300 text-center font-bold ">
        Welcome Back
      </h1>
      <form className="w-5/12 mx-auto py-8">
        <div className="mb-4">
          <input
            className="w-full p-2 border rounded-lg"
            id="username"
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="mb-2">
          <input
            className="w-full p-2 border rounded-lg"
            id="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <button
          className="w-full p-2 mt-5 button-color shadow-lg text-white rounded-lg "
          type="submit"
        >
          Log In
        </button>
      </form>

      <div className="text-center mt-2">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            className="text-orange-300 hover:underline focus:outline-none"
            onClick={onRegisterClick}
          >
            Register here.
          </button>
        </p>
      </div>
    </div>
  );
};

const RegisterForm = ({ onLoginClick }) => {
  return (
    <div className="register_form flex flex-col justify-center px-8 rounded-xl">
  <h1 className="text-4xl text-center font-bold text-orange-300">Register</h1>
  <form className="w-5/12 mx-auto py-10">
    <div className="mb-2">
      <input
        className="w-full p-2 border rounded-lg"
        id="email"
        type="text"
        placeholder="Email"
      />
    </div>
    <div className="mb-2">
      <input
        className="w-full p-2 border rounded-lg"
        id="username"
        type="text"
        placeholder="Username"
      />
    </div>
    <div className="mb-2">
      <input
        className="w-full p-2 border rounded-lg"
        id="password"
        type="password"
        placeholder="Password"
      />
    </div>
    <div className="mb-2">
      <input
        className="w-full p-2 border rounded-lg"
        id="confirmPassword"
        type="password"
        placeholder="Confirm Password"
      />
    </div>
    <button
      className="w-full p-2 mt-5 button-color shadow-lg text-white rounded-lg"
      type="submit"
    >
      Register
    </button>
  </form>

  <div className="text-center mt-2">
    <p className="text-sm text-gray-600">
      Have an account?{" "}
      <button
        className="text-orange-300 hover:underline focus:outline-none"
        onClick={onLoginClick}
      >
        Login Here
      </button>
    </p>
  </div>
</div>

  );
};

export default App;
