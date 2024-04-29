import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../../components/altert_box/AlertBox";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../../../axios";
import { AccountContext } from "../../../../../context/accountContext";

import { Paper, Typography, TextField, Grid } from "@mui/material";
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
const labels = {
  acct_name: "Account Name",
  acct_bill_state: "Billing State",
  acct_bill_city: "Billing City",
  acct_bill_street: "Billing Street",
  acct_bill_zipcode: "Billing Zip Code",
};
const OpenCheckingAccount = () => {
  const navigate = useNavigate();

  const { hasCheckingAccountSetTrue } = useContext(AccountContext);

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["checking_acct_service_charge"],
    queryFn: () =>
      makeRequest.get("/acct_rate/service_charge").then((res) => res.data),

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
    mutationFn: (newCheckingAccountDetails) => {
      return makeRequest.post(
        "/checking_account/open",
        newCheckingAccountDetails
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["checking_account"] });
      hasCheckingAccountSetTrue();
    },
  });

  // Function to handle form submission
  const handleOpenCheckingAccountClick = async (event) => {
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
    <div className="open_checking_account">
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
          Open Checking Account
        </Typography>
        <Grid container spacing={2} style={{ backgroundColor: "#f3f7fd" }}>
          {[
            "acct_name",
            "acct_bill_state",
            "acct_bill_city",
            "acct_bill_street",
            "acct_bill_zipcode",
          ].map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={index}
              style={{ backgroundColor: "#f3f7fd" }}
            >
              <TextField
                label={labels[item]}
                name={item}
                value={inputs[item]}
                onChange={handleChange}
                variant="standard"
                fullWidth
                error={!!errors[item]}
                helperText={errors[item]}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Monthly Account Maintenance Fees"
              name="service_fee"
              value={`$${Number(data.serviceCharge.service_charge).toFixed(2)}`}
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
              onClick={handleOpenCheckingAccountClick}
            >
              Agree! Open a Checking Account
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>
    </div>
  );
};

export default OpenCheckingAccount;
