import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../../components/altert_box/AlertBox";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../../../axios";
import { AccountContext } from "../../../../../context/accountContext";

import {
  Paper,
  Typography,
  TextField,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import styled, { keyframes } from "styled-components";

const StyledPaper = styled(Paper)`
  position: relative;
  padding: 20px;
  width: 80%;
  max-width: 900px;
  margin: auto;
  margin-top: 4rem;
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

const OpenSavingAccount = () => {
  const navigate = useNavigate();

  const { hasSavingAccountSetTrue } = useContext(AccountContext);

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["saving_acct_interest_rate"],
    queryFn: () =>
      makeRequest
        .get("/acct_rate/saving_interest_rate")
        .then((res) => res.data),

    onError: (err) => {
      console.error("Query error");
    },
  });

  console.log(data);

  // Initialize form state
  const [inputs, setInputs] = useState({
    acct_name: "",
    acct_bill_state: "",
    acct_bill_city: "",
    acct_bill_street: "",
    acct_bill_zipcode: "",
  });

  // Initialize state for managing form errors
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

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Optionally clear errors as the user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Function to validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Define maximum lengths based on your database schema
    const maxLengths = {
      acct_name: 30,
      acct_bill_state: 30,
      acct_bill_city: 30,
      acct_bill_street: 30,
      acct_bill_zipcode: 30,
    };

    Object.keys(inputs).forEach((key) => {
      if (!inputs[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`; // Adding spaces before capital letters for better readability
      } else if (inputs[key].length > maxLengths[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} must be at most ${
          maxLengths[key]
        } characters.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mutations
  const mutation = useMutation({
    mutationFn: (newSavingAccountDetails) => {
      return makeRequest.post("/saving_account/open", newSavingAccountDetails);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["saving_account"] });
      hasSavingAccountSetTrue();
    },
  });

  // Function to handle form submission
  const handleOpenSavingAccountClick = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    mutation.mutate(inputs);

    navigate("/");
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error fetching account details!</div>;
  return (
    <div className="open_saving_account">
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
          Open Saving Account
        </Typography>
        <Grid container spacing={2} style={{ backgroundColor: "#f3f7fd" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Name"
              id="acct_name"
              name="acct_name"
              value={inputs.acct_name}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_name}
              helperText={errors.acct_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Billing State"
              id="acct_bill_state"
              name="acct_bill_state"
              value={inputs.acct_bill_state}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_state}
              helperText={errors.acct_bill_state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Billing City"
              id="acct_bill_city"
              name="acct_bill_city"
              value={inputs.acct_bill_city}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_city}
              helperText={errors.acct_bill_city}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Billing Street"
              id="acct_bill_street"
              name="acct_bill_street"
              value={inputs.acct_bill_street}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_street}
              helperText={errors.acct_bill_street}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Billing Zip Code"
              id="acct_bill_zipcode"
              name="acct_bill_zipcode"
              value={inputs.acct_bill_zipcode}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_zipcode}
              helperText={errors.acct_bill_zipcode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Monthly Interest Rate"
              id="service_fee"
              name="service_fee"
              value={`$${Number(data.interestRate.interest_rate).toFixed(2)}`}
              InputProps={{
                readOnly: true,
              }}
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: "20px" }}>
            <br></br>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenSavingAccountClick}
            >
              Agree! Open a Saving Account
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>
    </div>
  );
};

export default OpenSavingAccount;
