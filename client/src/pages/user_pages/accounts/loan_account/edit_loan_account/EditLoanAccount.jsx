import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../../../axios";
import { AccountContext } from "../../../../../context/accountContext";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import AlertBox from "../../../../../components/altert_box/AlertBox";
import {
  AccountTypes,
  StudentTypes,
} from "../../../../../../../api/constants/account_constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const StyledDatePicker = styled(DatePicker)`
  padding: 8px 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    border-color: #0044ff;
    outline: none;
  }
`;
import {
    Paper,
    Typography,
    TextField,
    Grid,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
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

const EditLoanAccount = () => {
  const formatDateForMySQL = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    // console.log(adjustedDate.toISOString().split('T')[0]);
    return adjustedDate.toISOString().split("T")[0];
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { hasLoanAccountSetFalse } = useContext(AccountContext);

  const {
    data: loanData,
    isLoading: isLoanDataLoading,
    error: loanDataError,
  } = useQuery({
    queryKey: ["loan_account_details"],
    queryFn: () => makeRequest.get("/loan_account/get").then((res) => res.data),
    onError: (err) => {
      console.error("Query error");
    },
  });

  const {
    data: allUnivData,
    isLoading: isAllUnivLoading,
    error: allUnivError,
  } = useQuery({
    queryKey: ["all_universities"],
    queryFn: () =>
      makeRequest.get("/university/get_all").then((res) => res.data),
    retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
    onError: (err) => {
      console.error("Query error:", err);
    },
  });

  const {
    data: allICData,
    isLoading: isAllICLoading,
    error: allICError,
  } = useQuery({
    queryKey: ["all_ic"],
    queryFn: () => makeRequest.get("/insur_co/get_all").then((res) => res.data),
    retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
    onError: (err) => {
      console.error("Query error:", err);
    },
  });

  // Initialize form state with fetched data or defaults
  const [acctInputs, setAcctInputs] = useState({
    acct_name: "",
    acct_bill_state: "",
    acct_bill_city: "",
    acct_bill_street: "",
    acct_bill_zipcode: "",
  });

  const [loanInputs, setLoanInputs] = useState({
    loan_type: "",
  });

  const [studLoanInputs, setStudLoanInputs] = useState({
    stud_id: "",
    stud_type: "",
    exp_grad_date: "",
    univ_id: "",
  });

  const [homeLoanInputs, setHomeLoanInputs] = useState({
    built_year: "",
    home_ins_acc_no: "",
    ins_premium: "",
    ic_id: "",
  });

  // Update state when data is available
  useEffect(() => {
    if (loanData) {
      setAcctInputs({
        acct_name: loanData.loanAccountDetails.acct_name || "",
        acct_bill_state: loanData.loanAccountDetails.acct_bill_state || "",
        acct_bill_city: loanData.loanAccountDetails.acct_bill_city || "",
        acct_bill_street: loanData.loanAccountDetails.acct_bill_street || "",
        acct_bill_zipcode: loanData.loanAccountDetails.acct_bill_zipcode || "",
      });

      setLoanInputs({
        loan_type: loanData.loanAccountDetails.loan_type || "",
      });

      // Format the student loan expected graduation date for MySQL
      const formattedExpGradDate = loanData.loanAccountDetails.exp_grad_date
        ? formatDateForMySQL(
            new Date(loanData.loanAccountDetails.exp_grad_date)
          )
        : "";

      setStudLoanInputs({
        stud_id: loanData.loanAccountDetails.stud_id || "",
        stud_type: loanData.loanAccountDetails.stud_type || "",
        exp_grad_date: formattedExpGradDate || "",
        univ_id: loanData.loanAccountDetails.univ_id || "",
      });

      setHomeLoanInputs({
        built_year: loanData.loanAccountDetails.built_year || "",
        home_ins_acc_no: loanData.loanAccountDetails.home_ins_acc_no || "",
        ins_premium: loanData.loanAccountDetails.ins_premium || "",
        ic_id: loanData.loanAccountDetails.ic_id || "",
      });
    }
  }, [loanData]);

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

  // Handle input changes
  const handleAcctInputChange = (event) => {
    const { name, value } = event.target;

    setAcctInputs((prev) => ({
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

  const handleStudLoanInputChange = (event) => {
    const { name, value } = event.target;

    setStudLoanInputs((prev) => ({
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

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = formatDateForMySQL(date);
      setStudLoanInputs((prev) => ({
        ...prev,
        exp_grad_date: formattedDate,
      }));
    } else {
      setStudLoanInputs((prev) => ({
        ...prev,
        exp_grad_date: "",
      }));
    }
  };

  const handleHomeLoanInputChange = (event) => {
    const { name, value } = event.target;

    setHomeLoanInputs((prev) => ({
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

  // TODO: more throughout validation
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

    Object.keys(acctInputs).forEach((key) => {
      if (!acctInputs[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`; // Adding spaces before capital letters for better readability
      } else if (acctInputs[key].length > maxLengths[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} must be at most ${
          maxLengths[key]
        } characters.`;
      }
    });

    // Conditional validations for student loan inputs
    if (loanData.loanAccountDetails.loan_type === AccountTypes.STUDENT_LOAN) {
      if (!studLoanInputs.stud_id) {
        newErrors.stud_id = "Student ID is required.";
      }

      if (!studLoanInputs.stud_type) {
        newErrors.stud_type = "Student type is required.";
      }

      if (!studLoanInputs.exp_grad_date) {
        newErrors.exp_grad_date = "Expected graduation date is required.";
      }

      if (!studLoanInputs.univ_id) {
        newErrors.univ_id = "University is required.";
      }
    }

    // Conditional validations for home loan inputs
    if (loanData.loanAccountDetails.loan_type === AccountTypes.HOME_LOAN) {
      if (!homeLoanInputs.built_year) {
        newErrors.built_year = "House built year is required.";
      }

      if (!homeLoanInputs.home_ins_acc_no) {
        newErrors.home_ins_acc_no =
          "Home insurance account number is required.";
      }

      if (!homeLoanInputs.ins_premium) {
        newErrors.ins_premium = "Insurance premium is required.";
      } else if (parseFloat(homeLoanInputs.ins_premium) <= 0) {
        newErrors.ins_premium = "Insurance premium must be greater than zero.";
      }

      if (!homeLoanInputs.ic_id) {
        newErrors.ic_id = "Insurance company is required.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loanType = loanData?.loanAccountDetails?.loan_type;

  // console.log('Loan type being sent:', loanType);

  const updateMutation = useMutation({
    mutationFn: (updateDetails) =>
      makeRequest
        .put(`/loan_account/update/`, updateDetails, {
          params: { loan_type: loanType },
        })
        .then((res) => {
          console.log("Response data:", res.data); // Print the response data
          return res.data;
        }),
    onSuccess: (data) => {
      console.log("Success data:", data);
      queryClient.invalidateQueries({ queryKey: ["loan_account_details"] });
      queryClient.invalidateQueries({ queryKey: ["loan_account"] });
      showAlert("success", "Changes saved successfully!");
    },
    onError: (error) => {
      showAlert(
        "error",
        "Failed to save changes: " +
          (error.response?.data?.message || "Unknown error")
      );
      console.error("Error details:", error.response);
    },
  });

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...acctInputs,
      ...(loanData.loanAccountDetails.loan_type === AccountTypes.STUDENT_LOAN &&
        studLoanInputs),
      ...(loanData.loanAccountDetails.loan_type === AccountTypes.HOME_LOAN &&
        homeLoanInputs),
    };

    console.log(payload);

    updateMutation.mutate(payload);
  };

  const deleteMutation = useMutation({
    mutationFn: () =>
      makeRequest.delete(`/loan_account/delete/`, {
        params: { loan_type: loanType },
      }),
    enabled: !!loanType, // query will not execute until loanType exists
    onSuccess: () => {
      showAlert("success", "Account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["loan_account_details"] });
      queryClient.invalidateQueries({ queryKey: ["loan_account"] });
      hasLoanAccountSetFalse();
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

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      console.log(loanType);
      deleteMutation.mutate();
    }
  };

  if (isLoanDataLoading || isAllUnivLoading || isAllICLoading)
    return <div>Loading...</div>;

  if (loanDataError || allUnivError || allICError)
    return <div>Error fetching records!</div>;

  return (
    <div className="open_loan_account">
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
          Edit Loan Account
        </Typography>
        <Grid container spacing={2} style={{ backgroundColor: "#f3f7fd" }}>
          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Account Number"
              value={loanData.loanAccountDetails.acct_no}
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
              value={acctInputs.acct_name}
              onChange={handleAcctInputChange}
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
              value={acctInputs.acct_bill_state}
              onChange={handleAcctInputChange}
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
              value={acctInputs.acct_bill_city}
              onChange={handleAcctInputChange}
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
              value={acctInputs.acct_bill_street}
              onChange={handleAcctInputChange}
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
              value={acctInputs.acct_bill_zipcode}
              onChange={handleAcctInputChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_zipcode}
              helperText={errors.acct_bill_zipcode}
            />
          </Grid>

          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Monthly Loan Interest Rate"
              name="loan_rate"
              value={`$${Number(loanData.loanAccountDetails.loan_rate).toFixed(
                2
              )}`}
              onChange={handleAcctInputChange}
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              error={!!errors.acct_bill_zipcode}
              helperText={errors.acct_bill_zipcode}
            />
          </Grid>

          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Loan Type"
              name="loan_type"
              value={
                loanData.loanAccountDetails.loan_type ===
                AccountTypes.STUDENT_LOAN
                  ? "Student Loan"
                  : loanData.loanAccountDetails.loan_type ===
                    AccountTypes.HOME_LOAN
                  ? "Home Loan"
                  : loanData.loanAccountDetails.loan_type === AccountTypes.LOAN
                  ? "Other Loans"
                  : "" // No default text is displayed if no loan type is selected
              }
              onChange={handleAcctInputChange}
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              error={!!errors.acct_bill_zipcode}
              helperText={errors.acct_bill_zipcode}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Loan Amount"
              id="loan_amount"
              name="loan_amount"
              value={`$${loanData.loanAccountDetails.loan_amount}`}
              variant="standard"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Loan Term"
              id="loan_month"
              name="loan_month"
              value={`${loanData.loanAccountDetails.loan_month} Month`}
              variant="standard"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
            <TextField
              label="Monthly Payment"
              id="loan_payment"
              name="loan_payment"
              value={`$${loanData.loanAccountDetails.loan_payment}`}
              variant="standard"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          {loanData.loanAccountDetails.loan_type ===
            AccountTypes.STUDENT_LOAN && (
            <>
              <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
                <TextField
                  label="Student ID"
                  id="stud_id"
                  name="stud_id"
                  value={studLoanInputs.stud_id}
                  onChange={handleStudLoanInputChange}
                  variant="standard"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="student-type-label">Student Type</InputLabel>
                  <Select
                    labelId="student-type-label"
                    id="stud_type"
                    name="stud_type"
                    value={studLoanInputs.stud_type}
                    onChange={handleStudLoanInputChange}
                  >
                    <MenuItem value="">Select Student Type</MenuItem>
                    <MenuItem value={StudentTypes.UNDERGRADE}>Undergraduate</MenuItem>
                    <MenuItem value={StudentTypes.GRADUATE}>Graduate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>


              <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
              
              <InputLabel id="loan_type">Expected Graduation Date</InputLabel>

                  <StyledDatePicker
                    label="Expected Graduation Date"
                    value={
                      studLoanInputs.exp_grad_date
                        
                    }
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" fullWidth />
                    )}
                    inputFormat="MMMM d, yyyy"
                  />
                
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  variant="standard"
                  fullWidth
                  disabled={isAllUnivLoading}
                >
                  <InputLabel id="university-label">University</InputLabel>
                  <Select
                    labelId="university-label"
                    id="univ_id"
                    name="univ_id"
                    value={studLoanInputs.univ_id}
                    onChange={handleStudLoanInputChange}
                  >
                    <MenuItem value="">Select University</MenuItem>
                    {allUnivData.universities?.map((univ) => (
                      <MenuItem key={univ.univ_id} value={univ.univ_id}>
                        {univ.univ_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          {loanData.loanAccountDetails.loan_type === AccountTypes.HOME_LOAN && (
            <>
            <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
    <TextField
      label="House Built Year"
      id="built_year"
      name="built_year"
      type="number"
      value={homeLoanInputs.built_year}
      onChange={handleHomeLoanInputChange}
      variant="standard"
      fullWidth
      inputProps={{ min: "1900", max: new Date().getFullYear() }}
    />
  </Grid>
  <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
    <TextField
      label="Home Insurance Account Number"
      id="home_ins_acc_no"
      name="home_ins_acc_no"
      value={homeLoanInputs.home_ins_acc_no}
      onChange={handleHomeLoanInputChange}
      variant="standard"
      fullWidth
    />
  </Grid>
  <Grid item xs={12} sm={6} style={{ backgroundColor: "#f3f7fd" }}>
    <TextField
      label="Insurance Premium (Annual)"
      id="ins_premium"
      name="ins_premium"
      type="number"
      value={homeLoanInputs.ins_premium}
      onChange={handleHomeLoanInputChange}
      variant="standard"
      fullWidth
      inputProps={{ step: "0.01" }}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <FormControl variant="standard" fullWidth>
      <InputLabel id="insurance-company-label">Insurance Company</InputLabel>
      <Select
        labelId="insurance-company-label"
        id="ic_id"
        name="ic_id"
        value={homeLoanInputs.ic_id}
        onChange={(e) => setHomeLoanInputs((prev) => ({ ...prev, ic_id: e.target.value }))}
      >
        <MenuItem value="">Select Insurance Company</MenuItem>
        {allICData.insuranceCompanies?.map((ic) => (
          <MenuItem key={ic.ic_id} value={ic.ic_id}>
            {ic.ic_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
            </>
          )}
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

export default EditLoanAccount;
