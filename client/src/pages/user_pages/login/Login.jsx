import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import AlertBox from '../../../components/altert_box/AlertBox';
import styled, { keyframes } from "styled-components";

const jump = keyframes`
  from{
    transform: translateY(0)
  }
  to{
    transform: translateY(-3px)
  }
`;


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Form = styled.form`
  margin: 0 auto;
  width: 100%;
  max-width: 414px;
  padding: 1.3rem;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Input = styled.input`
  max-width: 100%;
  padding: 11px 13px;
  background: #f9f9fa;
  color: #f03d4e;
  margin-bottom: 0.9rem;
  border-radius: 4px;
  outline: 0;
  border: 1px solid rgba(245, 245, 245, 0.7);
  font-size: 14px;
  transition: all 0.3s ease-out;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.1);
  :focus,
  :hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15), 0 1px 5px rgba(0, 0, 0, 0.1);
  }
`;

const Button = styled.button`
  max-width: 100%;
  padding: 11px 13px;
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
  :hover {
    background: rgb(200, 50, 70);
    animation: ${jump} 0.2s ease-out forwards;
  }
`;

const Title = styled.h2`
  font-weight: normal;
  color: #2a2a29;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
`;
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
    <>
        {alert.isVisible && <AlertBox type={alert.type} message={alert.message} onClose={hideAlert} />}
        <Wrapper>
          <Form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <p>to continue to The Home Page</p>
            <br></br>
            <Input
              type="text"
              name="username"
              value={inputs.username}
              onChange={handleChange}
              id="username"
              placeholder="Username"
            />
            {errors.username && <p className="error">{errors.username}</p>}
            <Input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              id="password"
              placeholder="Password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
            <Button type="submit">Login</Button>
            <div className="sign-up">
              No account? <Link to="/register">Register</Link>
            </div>
          </Form>
        </Wrapper>
      
    </>
  );
};

export default Login;
