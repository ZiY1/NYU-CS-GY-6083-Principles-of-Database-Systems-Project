import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Paper, Typography, TextField, Grid, Snackbar, Alert } from "@mui/material";
import styled, { keyframes } from "styled-components";
import DOMPurify from 'dompurify';


const StyledPaper = styled(Paper)`
  position: relative;
  padding: 20px;
  width: 80%;
  max-width: 900px;
  margin: auto;
  margin-top: 15rem;
  margin-bottom: 4rem;
  background: #f3f7fd !important;
`;

const jump = keyframes`
  from{
    transform: translateY(0)
  }
  to{
    transform: translateY(-3px)
  }
`;

const Button = styled.button`
  position: absolute;
  bottom: 20px; // Distance from the bottom edge of the Paper
  right: 20px; // Distance from the right edge of the Paper
  padding: 10px 15px;
  color: rgb(253, 249, 243);
  font-weight: 600;
  text-transform: uppercase;
  background: #f03d4e;
  border: none;
  border-radius: 3px;
  outline: 0;
  cursor: pointer;
  margin-top: 0.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-out;
  &:hover {
    background: rgb(200, 50, 70);
    animation: ${jump} 0.2s ease-out forwards;
  }
`;

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
    zipCode: "",
  });

  // Update error state to be an object to handle individual field errors
  const [errors, setErrors] = useState({});

  const [alert, setAlert] = useState({
    type: "",
    message: "",
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
    const sanitizedValue = DOMPurify.sanitize(value);
    setInputs((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Clear error for a field when it's being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
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
      zipCode: 30,
    };

    Object.keys(inputs).forEach((key) => {
      if (!inputs[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`; // Adding spaces before capital letters for better readability
      } else if (inputs[key].length > maxLengths[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} must be at most ${maxLengths[key]
          } characters.`;
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
      setInputs({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        state: "",
        city: "",
        street: "",
        zipCode: "",
      });
      setErrors({});
      // Show success alert
      showAlert("success", "Registration successful! Redirecting to login...");
      // Redirect after a delay
      setTimeout(() => {
        // Replace with your redirection logic, for example using useNavigate() from react-router-dom
        navigate("/login");
      }, 3000); // Adjust time as needed
    } catch (error) {
      // Check if the backend returned a specific error message and display it
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response) {
        errorMessage = error.response.data || errorMessage;
      }
      showAlert("error", errorMessage);
    }
  };
  return (
    <div className="register">
      {alert.isVisible && (
        <Snackbar
          open={alert.isVisible}
          autoHideDuration={6000}
          onClose={hideAlert}
        >
          <Alert
            onClose={hideAlert}
            severity={alert.type}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}

      <StyledPaper elevation={3}>
        <Typography
          variant="h5"
          component="h3"
          sx={{ mb: 2 }}
          style={{ backgroundColor: "#f3f7fd" }}
        >
          Register to continue to The Home Page
        </Typography>
        <form>
          <Grid container spacing={2} style={{ backgroundColor: "#f3f7fd" }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                name="username"
                value={inputs.username}
                onChange={handleChange}
                variant="standard"
                fullWidth
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                variant="standard"
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={inputs.firstName}
                onChange={handleChange}
                variant="standard"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={inputs.lastName}
                onChange={handleChange}
                variant="standard"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State"
                name="state"
                value={inputs.state}
                onChange={handleChange}
                variant="standard"
                fullWidth
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                name="city"
                value={inputs.city}
                onChange={handleChange}
                variant="standard"
                fullWidth
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Street"
                name="street"
                value={inputs.street}
                onChange={handleChange}
                variant="standard"
                fullWidth
                error={!!errors.street}
                helperText={errors.street}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Zip Code"
                name="zipCode"
                value={inputs.zipCode}
                onChange={handleChange}
                variant="standard"
                fullWidth
                error={!!errors.zipCode}
                helperText={errors.zipCode}
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: "20px" }}>
              <Button variant="contained" color="primary" onClick={handleClick}>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          Have an account? <Link to="/login">Login</Link>
        </div>
      </StyledPaper>
    </div>
  );
}

export default Register;
