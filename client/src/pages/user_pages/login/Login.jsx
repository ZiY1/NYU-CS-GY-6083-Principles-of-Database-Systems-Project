import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import AlertBox from '../../../components/altert_box/AlertBox';
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    type: '',
    message: '',
    isVisible: false,
  });

  const showAlert = (type, message) => {
    setAlert({ type, message, isVisible: true });
  };

  const hideAlert = () => {
    setAlert({ ...alert, isVisible: false });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(prev => ({ ...prev, [name]: value }));

    // Clear any existing error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!inputs.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!inputs.password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const isFormValid = validateForm();

    if (!isFormValid) {
      return;
    }

    try {
      await login(inputs);
      navigate('/');
    } catch (error) {
      // Check if the backend returned a specific error message and display it
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response) {
        errorMessage = error.response.data || errorMessage;
      }
      showAlert('error', errorMessage);
    }
  };

  return (
    <div className="login">
      {alert.isVisible && <AlertBox type={alert.type} message={alert.message} onClose={hideAlert} />}
      <div className="card">
        <h1>Sign in</h1>
        <p>to continue to The Home Page</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={inputs.username}
              onChange={handleChange}
              id="username"
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              id="password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button type="submit">Login</button>
        </form>
        <div className="sign-up">
          No account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
