import React, { useContext, useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { makeRequest } from "../../../../../axios";
import { AccountContext } from "../../../../../context/accountContext";

import { Paper, Typography, TextField, Grid } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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
const CornerButton = styled.button`
  position: absolute;
  bottom: 20px; // Distance from the bottom edge of the Paper
  right: 20px; // Distance from the right edge of the Paper
  padding: 10px 15px;
  background-color: #b1cbf2;
  color: rgb(253, 249, 243);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #9fb6d9;
    animation: ${jump} 0.2s ease-out forwards;
  }
`;

const CornerButton2 = styled.button`
  position: absolute;
  bottom: 20px; // Distance from the bottom edge of the Paper
  right: 200px; // Distance from the right edge of the Paper
  padding: 10px 15px;
  background-color: #b1cbf2;
  color: rgb(253, 249, 243);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #9fb6d9;
    animation: ${jump} 0.2s ease-out forwards;
  }
`;

const EditCheckingAccount = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { hasCheckingAccountSetFalse } = useContext(AccountContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["checking_account_details"],
    queryFn: () =>
      makeRequest.get("/checking_account/get").then((res) => res.data),

    onError: (err) => {
      console.error("Query error");
    },
  });

  console.log(data);

  // Initialize form state with fetched data or defaults
  const [inputs, setInputs] = useState({
    acct_name: "",
    acct_bill_state: "",
    acct_bill_city: "",
    acct_bill_street: "",
    acct_bill_zipcode: "",
  });

  useEffect(() => {
    if (data) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        acct_name: data.checkingAccountDetails.acct_name || "",
        acct_bill_state: data.checkingAccountDetails.acct_bill_state || "",
        acct_bill_city: data.checkingAccountDetails.acct_bill_city || "",
        acct_bill_street: data.checkingAccountDetails.acct_bill_street || "",
        acct_bill_zipcode: data.checkingAccountDetails.acct_bill_zipcode || "",
      }));
    }
  }, [data]);

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    isVisible: false,
  });

  // Alert functions
  const showAlert = (type, message) =>
    setAlert({ type, message, isVisible: true });
  const hideAlert = () => setAlert({ ...alert, isVisible: false });

  // Input change handler
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
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

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (updateDetails) =>
      makeRequest.put(`/checking_account/update/`, updateDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checking_account_details"] });
      queryClient.invalidateQueries({ queryKey: ["checking_account"] });
      showAlert("success", "Changes saved successfully!");
    },
    onError: (error) => {
      showAlert(
        "error",
        "Failed to save changes: " +
          (error.response?.data?.message || "Unknown error")
      );
    },
  });

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    updateMutation.mutate(inputs);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      deleteMutation.mutate();
    }
  };

  const deleteMutation = useMutation({
    mutationFn: () => makeRequest.delete(`/checking_account/delete/`),
    onSuccess: () => {
      showAlert("success", "Account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["checking_account_details"] });
      queryClient.invalidateQueries({ queryKey: ["checking_account"] });
      hasCheckingAccountSetFalse();
      navigate("/");
    },
    onError: (err) => {
      showAlert(
        "error",
        "Failed to delete the account: " +
          (err.response?.data?.message || "Unknown error")
      );
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error fetching account details!</div>;

  return (
    <div className="edit_checking_account">
    {alert.isVisible && (
      <Snackbar open={alert.isVisible} autoHideDuration={6000} onClose={hideAlert}>
        <Alert onClose={hideAlert} severity={alert.type} sx={{ width: '100%' }}>
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
          Edit Checking Account
        </Typography>
        <Grid container spacing={2} style={{ backgroundColor: "#f3f7fd" }}>
          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Account Number"
              value={data.checkingAccountDetails.acct_no}
              variant="standard"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Account Name"
              name="acct_name"
              value={inputs.acct_name}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_name}
              helperText={errors.acct_name}
            />
          </Grid>

          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Billing State"
              name="acct_bill_state"
              value={inputs.acct_bill_state}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_state}
              helperText={errors.acct_bill_state}
            />
          </Grid>

          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Billing City"
              name="acct_bill_city"
              value={inputs.acct_bill_city}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_city}
              helperText={errors.acct_bill_city}
            />
          </Grid>

          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Billing Street"
              name="acct_bill_street"
              value={inputs.acct_bill_street}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_street}
              helperText={errors.acct_bill_street}
            />
          </Grid>

          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Billing Zip Code"
              name="acct_bill_zipcode"
              value={inputs.acct_bill_zipcode}
              onChange={handleChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_zipcode}
              helperText={errors.acct_bill_zipcode}
            />
          </Grid>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <CornerButton type="submit" onClick={handleSaveChanges}>
            Save Changes
          </CornerButton>
          <CornerButton2
            type="button"
            className="delete-button"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </CornerButton2>
        </Grid>
      </StyledPaper>
    </div>
  );
};

export default EditCheckingAccount;
