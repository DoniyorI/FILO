import React, { useState, useEffect } from "react";
// import "./Register.css";

const App = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleRegistrationSuccess = () => {
    setIsFlipped(false); // Flip back to the login form
  };

  return (
    <div className="min-h-screen flex items-center justify-center reg_background ">
      <div
        className={`glass_window relative w-96 h-96 rounded-xl shadow-md ${
          isFlipped ? "spin" : ""
        }`}
      >
        <LoginForm onRegisterClick={() => setIsFlipped(true)} />
        <RegisterForm
          onLoginClick={() => setIsFlipped(false)}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      </div>
    </div>
  );
};

const LoginForm = ({ onRegisterClick }) => {
  const [formData, setFormData] = useState({
    username_exists: "",
    password_exists: "",
  });
  const [isError, setIsError] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState("");
  // const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isFieldRequired, setIsFieldRequired] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const { username_exists, password_exists } = formData;
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (!isError) {
      setIsErrorMessage("");
    }
  }, [isError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);

    // Create an object with the data you want to send to the server
    const dataToSend = {
      username: username_exists,
      password: password_exists,
    };
    console.log(dataToSend);

    try {
      const response = await fetch("/login/returning_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        console.log(dataToSend);
        window.location.href = "/";
        // Registration was successful, you can handle the response here
        // e.g., redirect or display a success message
      } else {
        const responseData = await response.json();
        console.error("Login failed:", responseData);
        setIsFieldRequired(responseData.message_required);
        setIsInvalid(responseData.message_invalid);
        console.log("FIELDS", responseData.message_required);
        setIsError(true);
        setIsErrorMessage(
          responseData.message ||
            responseData.message_required ||
            responseData.message_invalid ||
            "An error occurred during Login."
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setIsError(true);
      setIsErrorMessage("An error occurred during Login.");
    }
  };

  return (
    <div className="login_form flex flex-col justify-center px-8 rounded-xl">
      {/* <h1 className="text-4xl text-center font-bold color ">Welcome Back</h1>  */}
      <h1 className="text-4xl text-orange-300 text-center font-bold ">
        Welcome Back
      </h1>
      <form className="w-5/12 mx-auto py-8" onSubmit={handleSubmit}>
        <div className="mb-2 w-full flex flex-col justify-center items-center gap-2">
          <input
            className={`p-2 border rounded-lg ${
              (isFieldRequired || isInvalid) && submitAttempted
                ? "border-red-500"
                : ""
            }`}
            id="username_exists"
            type="text"
            placeholder="Username"
            name="username_exists"
            value={username_exists}
            onChange={handleChange}
            // required
            min="4"
          />
          <input
            className={`p-2 border rounded-lg ${
              (isFieldRequired || isInvalid) && submitAttempted
                ? "border-red-500"
                : ""
            }`}
            id="password_exists"
            type="password"
            placeholder="Password"
            name="password_exists"
            value={password_exists}
            onChange={handleChange}
            // required
            min="4"
          />
          {isError && (
            <div className="absolute bottom-[9.5rem] text-red-500 text-sm text-center w-full">
              {isErrorMessage || "An error has occurred."}
            </div>
          )}
        </div>
        <button
          className="bg-primaryDark w-full p-2 mt-5 button-color shadow-lg text-white rounded-lg "
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

const RegisterForm = ({ onLoginClick, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    email_new: "",
    username_new: "",
    password_new: "",
    confirm_password_new: "",
  });

  const [isError, setIsError] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [isFieldsEmpty, setIsFieldsEmpty] = useState(false);
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isPasswordMatchError, setIsPasswordMatchError] = useState(false);

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const { email_new, username_new, password_new, confirm_password_new } =
    formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // if (name === "email_new") {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   setIsEmailValid(emailRegex.test(value));
    // }
  };

  useEffect(() => {
    if (!isError) {
      setIsErrorMessage("");
    }
  }, [isError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);

    // if (!isEmailValid) {
    //   console.error("Invalid email");
    //   return;
    // }

    const dataToSend = {
      email: email_new,
      username: username_new,
      password: password_new,
      confirm_password: confirm_password_new,
    };

    try {
      const response = await fetch("/login/new_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        // window.location.href = "/login";
        onRegistrationSuccess();
      } else {
        const responseData = await response.json();
        console.error("Registration failed:", responseData);
        setIsFieldsEmpty(responseData.message_fields);
        setIsEmailTaken(responseData.message_email);
        setIsUsernameTaken(responseData.message_username);
        setIsPasswordMatchError(responseData.message_password);
        console.error("PASSWORD ERROR", responseData.message_password);
        console.log("Password Match Error:", isPasswordMatchError);

        setIsError(true);
        setIsErrorMessage(
          responseData.message ||
            responseData.message_fields ||
            responseData.message_email ||
            responseData.message_username ||
            responseData.message_password
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setIsError(true);
      setIsErrorMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="register_form flex flex-col justify-center px-8 rounded-xl">
      <h1 className="text-4xl text-center font-bold text-orange-300">
        Register
      </h1>
      <form className="w-5/12 mx-auto py-4" onSubmit={handleSubmit}>
        <div className="mb-2 w-full flex flex-col justify-center items-center gap-2">
          <input
            className={`p-2 border rounded-lg ${
              (!isEmailValid || isEmailTaken || isFieldsEmpty) &&
              submitAttempted
                ? "border-red-500"
                : ""
            }`}
            id="email_new"
            type="text"
            placeholder="Email"
            name="email_new"
            value={email_new}
            onChange={handleChange}
            min="4"
            // required
          />
          <input
            className={`p-2 border rounded-lg ${
              (isUsernameTaken || isFieldsEmpty) && submitAttempted
                ? "border-red-500"
                : ""
            }`}
            id="username_new"
            type="text"
            placeholder="Username"
            name="username_new"
            value={username_new}
            onChange={handleChange}
            min="4"
            // required
          />
          <input
            className={`p-2 border rounded-lg ${
              (isPasswordMatchError || isFieldsEmpty) && submitAttempted
                ? "border-red-500"
                : ""
            }`}
            id="password_new"
            type="password"
            placeholder="Password"
            name="password_new"
            value={password_new}
            onChange={handleChange}
            min="4"
            // required
          />
          <input
            className={`p-2 border rounded-lg ${
              (isPasswordMatchError || isFieldsEmpty) && submitAttempted
                ? "border-red-500"
                : ""
            }`}
            id="confirm_password_new"
            type="password"
            placeholder="Confirm Password"
            name="confirm_password_new"
            value={confirm_password_new}
            onChange={handleChange}
            // required
          />
          {isError && (
            <div className="absolute bottom-[102px] text-red-500 text-sm text-center w-full">
              {isErrorMessage || "An error has occurred."}
            </div>
          )}
        </div>
        {/* Submit button */}
        <button
          className="bg-primaryDark w-full p-2 mt-4 button-color shadow-lg text-white rounded-lg"
          type="submit"
          // disabled={submitAttempted}
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
