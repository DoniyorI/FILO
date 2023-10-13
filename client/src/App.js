import React, { useState } from "react";

// import './components/register.css'
import "./App.css";

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
    <div className="login_form flex flex-col justify-center p-8 rounded-xl">
      {/* <h1 className="text-4xl text-center font-bold color ">Welcome Back</h1>  */}
      <h1 className="text-4xl text-orange-300 text-center font-bold color">Welcome Back</h1>
      <form className="w-5/12 mx-auto py-10">
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-600"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="w-full p-2 border rounded-md"
            id="username"
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-600"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full p-2 border rounded-md"
            id="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <button
          className="w-full p-2 mb-4 bg-blue-500 shadow-lg text-white rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-800"
          type="submit"
        >
          Log In
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            className="text-blue-500 hover:underline focus:outline-none"
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
    <div className="register_form flex flex-col justify-center p-8 rounded-xl">
      <h1 className="text-4xl text-center font-bold">Register</h1>
      <form className="w-5/12 mx-auto py-10">
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-600"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="w-full p-2 border rounded-md"
            id="username"
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-600"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full p-2 border rounded-md"
            id="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <button
          className="w-full p-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-800"
          type="submit"
        >
          Log In
        </button>
      </form>{" "}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Have an account?{" "}
          <button
            className="text-blue-500 hover:underline focus:outline-none"
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
