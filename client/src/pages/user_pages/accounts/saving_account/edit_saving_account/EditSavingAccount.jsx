import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../../../axios";
import { AccountContext } from "../../../../../context/accountContext";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";

import { Paper, Typography, TextField, Grid } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
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

const EditSavingAccount = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { hasSavingAccountSetFalse } = useContext(AccountContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["saving_account_details"],
    queryFn: () =>
      makeRequest.get("/saving_account/get").then((res) => res.data),

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

  // Update state when data is available
  useEffect(() => {
    if (data) {
      setInputs({
        acct_name: data.savingAccountDetails.acct_name || "",
        acct_bill_state: data.savingAccountDetails.acct_bill_state || "",
        acct_bill_city: data.savingAccountDetails.acct_bill_city || "",
        acct_bill_street: data.savingAccountDetails.acct_bill_street || "",
        acct_bill_zipcode: data.savingAccountDetails.acct_bill_zipcode || "",
      });
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
      makeRequest.put(`/saving_account/update/`, updateDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saving_account_details"] });
      queryClient.invalidateQueries({ queryKey: ["saving_account"] });
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
    mutationFn: () => makeRequest.delete(`/saving_account/delete/`),
    onSuccess: () => {
      showAlert("success", "Account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["saving_account_details"] });
      queryClient.invalidateQueries({ queryKey: ["saving_account"] });
      hasSavingAccountSetFalse();
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
    <div className="edit_saving_account">
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
          Edit Saving Account
        </Typography>
        <form>
          <Grid container spacing={2} style={{ backgroundColor: "#f3f7fd" }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number"
                value={data.savingAccountDetails.acct_no}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <TextField
                label="Monthly Interest Rate"
                value={`${Number(
                  data.savingAccountDetails.interest_rate
                ).toFixed(2)}%`}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <CornerButton
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </CornerButton>
              <CornerButton2
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleDeleteAccount}
                style={{ marginLeft: "10px" }}
              >
                Delete Account
              </CornerButton2>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
    </div>
  );
};

export default EditSavingAccount;
