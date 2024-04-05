import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.scss";
import AlertBox from '../../../components/altert_box/AlertBox';

function Register() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    state: "",
    city: "",
    street: "",
    zipCode: ""
  });

  // Update error state to be an object to handle individual field errors
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
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    // Clear error for a field when it's being edited
    if (errors[event.target.name]) {
      setErrors((prev) => ({ ...prev, [event.target.name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Define maximum lengths based on your database schema
    const maxLengths = {
      username: 30,
      password: 100,
      firstName: 30,
      lastName: 30,
      state: 30,
      city: 30,
      street: 30,
      zipCode: 30
    };

    Object.keys(inputs).forEach((key) => {
      if (!inputs[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} is required.`; // Adding spaces before capital letters for better readability
      } else if (inputs[key].length > maxLengths[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} must be at most ${maxLengths[key]} characters.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async (event) => {
    event.preventDefault();
    const isFormValid = validateForm();

    if (!isFormValid) {
      return;
    }

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      // Reset form and errors state
      setInputs({ username: "", password: "", firstName: "", lastName: "", state: "", city: "", street: "", zipCode: "" });
      setErrors({});
      // Show success alert
      showAlert('success', 'Registration successful! Redirecting to login...');
      // Redirect after a delay
      setTimeout(() => {
        // Replace with your redirection logic, for example using useNavigate() from react-router-dom
        navigate('/login');
      }, 3000); // Adjust time as needed
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
    <div className="register">
      {alert.isVisible && <AlertBox type={alert.type} message={alert.message} onClose={hideAlert} />}
      <div className="card">
        <h1>Register</h1>
        <p>to continue to The Home Page</p>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={inputs.username} onChange={handleChange} />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={inputs.password} onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="name-group">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" name="firstName" value={inputs.firstName} onChange={handleChange} />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" name="lastName" value={inputs.lastName} onChange={handleChange} />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>
          </div>

          <div className="address-group">
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input type="text" name="state" value={inputs.state} onChange={handleChange} />
              {errors.state && <p className="error">{errors.state}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" name="city" value={inputs.city} onChange={handleChange} />
              {errors.city && <p className="error">{errors.city}</p>}
            </div>
          </div>

          <div className="address-group">
            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input type="text" name="street" value={inputs.street} onChange={handleChange} />
              {errors.street && <p className="error">{errors.street}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">Zip Code</label>
              <input type="text" name="zipCode" value={inputs.zipCode} onChange={handleChange} />
              {errors.zipCode && <p className="error">{errors.zipCode}</p>}
            </div>
          </div>

          {errors.general && <p className="error">{errors.general}</p>}

          <button type="submit" onClick={handleClick}>Register</button>
        </form>
        <div className="sign-in">
          Have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>


  );
}

export default Register;
