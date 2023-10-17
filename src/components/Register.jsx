import React, { useState } from "react";
import "./Register.css";

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
            id="username_exist"
            type="text"
            placeholder="Username"
            name="username_exist"
          />
        </div>
        <div className="mb-2">
          <input
            className="w-full p-2 border rounded-lg"
            id="password_exist"
            type="password"
            placeholder="Password"
            name="password_exist"
          />
        </div>
        <button
          className="w-full p-2 mt-5 button-color shadow-lg text-white rounded-lg "
          type="submit"
          value="Post"
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
  const [formData, setFormData] = useState({
    email_new: "",
    username_new: "",
    password_new: "",
    confirm_password_new: "",
  });

  const { email_new, username_new, password_new, confirm_password_new } =
    formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create an object with the data you want to send to the server
    const dataToSend = {
      email: email_new,
      username: username_new,
      password: password_new,
      confirm_password: confirm_password_new,
    };
    console.log(dataToSend);

    try {
      const response = await fetch("/login/new_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        console.log(dataToSend);
        // Registration was successful, you can handle the response here
        // e.g., redirect or display a success message
      } else {
        // Registration failed, handle the error here
        // e.g., display an error message
      }
    } catch (error) {
      // ...
    }
  };

  return (
    <div className="register_form flex flex-col justify-center px-8 rounded-xl">
      <h1 className="text-4xl text-center font-bold text-orange-300">
        Register
      </h1>
      <form className="w-5/12 mx-auto py-10" onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            className="w-full p-2 border rounded-lg"
            id="email_new"
            type="text"
            placeholder="Email"
            name="email_new"
            value={email_new}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <input
            className="w-full p-2 border rounded-lg"
            id="username_new"
            type="text"
            placeholder="Username"
            name="username_new"
            value={username_new}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <input
            className="w-full p-2 border rounded-lg"
            id="password_new"
            type="password"
            placeholder="Password"
            name="password_new"
            value={password_new}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <input
            className="w-full p-2 border rounded-lg"
            id="confirm_password_new"
            type="password"
            placeholder="Confirm Password"
            name="confirm_password_new"
            value={confirm_password_new}
            onChange={handleChange}
          />
        </div>
        <button
          className="w-full p-2 mt-5 button-color shadow-lg text-white rounded-lg"
          type="submit">
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
