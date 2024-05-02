import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../../components/altert_box/AlertBox";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import { makeRequest } from "../../../../../axios";
import { AccountContext } from "../../../../../context/accountContext";
import {
  AccountTypes,
  StudentTypes,
} from "../../../../../../../api/constants/account_constants";
import { calculateMonthlyLoanPayment } from "../../../../../../../api/utils/account_utils";

import "react-datepicker/dist/react-datepicker.css";

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
const OpenLoanAccount = () => {
  const formatDateForMySQL = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const navigate = useNavigate();

  const { hasLoanAccountSetTrue } = useContext(AccountContext);

  const queryClient = useQueryClient();

  const {
    data: loanRateData,
    isLoading: isLoanRateLoading,
    error: loanRateError,
  } = useQuery({
    queryKey: ["loan_acct_loan_rate"],
    queryFn: () =>
      makeRequest.get("/acct_rate/loan_interest_rate").then((res) => res.data),
    onError: (err) => {
      console.error("Query error:", err);
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

  console.log(allICData);

  // Initialize form state
  const [acctInputs, setAcctInputs] = useState({
    acct_name: "",
    acct_bill_state: "",
    acct_bill_city: "",
    acct_bill_street: "",
    acct_bill_zipcode: "",
  });

  const [loanInputs, setLoanInputs] = useState({
    loan_amount: "",
    loan_month: "",
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

  const handleLoanInputChange = (event) => {
    const { name, value } = event.target;

    setLoanInputs((prev) => ({
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

    // Validations for loan inputs
    if (!loanInputs.loan_amount) {
      newErrors.loan_amount = "Loan amount is required.";
    } else if (parseFloat(loanInputs.loan_amount) <= 0) {
      newErrors.loan_amount = "Loan amount must be greater than zero.";
    }

    if (!loanInputs.loan_month) {
      newErrors.loan_month = "Loan term in months is required.";
    } else if (parseInt(loanInputs.loan_month) <= 0) {
      newErrors.loan_month = "Loan term must be greater than zero.";
    }

    if (!loanInputs.loan_type) {
      newErrors.loan_type = "Loan type is required.";
    }

    // Conditional validations for student loan inputs
    if (loanInputs.loan_type === AccountTypes.STUDENT_LOAN) {
      if (!studLoanInputs.stud_id.trim()) {
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
    if (loanInputs.loan_type === AccountTypes.HOME_LOAN) {
      if (!homeLoanInputs.built_year) {
        newErrors.built_year = "House built year is required.";
      }

      if (!homeLoanInputs.home_ins_acc_no.trim()) {
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

  // Mutations
  const mutation = useMutation({
    mutationFn: (newLoanAccountDetails) => {
      return makeRequest.post("/loan_account/open", newLoanAccountDetails);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["loan_account"] });
      hasLoanAccountSetTrue();
    },
  });

  // Function to handle form submission
  const handleOpenLoanAccountClick = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const payload = {
      ...acctInputs,
      ...loanInputs,
      ...(loanInputs.loan_type === AccountTypes.STUDENT_LOAN && studLoanInputs),
      ...(loanInputs.loan_type === AccountTypes.HOME_LOAN && homeLoanInputs),
    };

    mutation.mutate(payload);

    navigate("/");
  };

  const [calculatedLoanPayment, setCalculatedLoanPayment] = useState("");

  // Effect to recalculate the loan payment whenever relevant inputs change
  useEffect(() => {
    if (loanInputs.loan_amount && loanInputs.loan_month && loanRateData) {
      const calculatedPayment = calculateMonthlyLoanPayment(
        parseFloat(loanInputs.loan_amount),
        parseFloat(loanRateData.loanInterestRate.loan_rate),
        parseInt(loanInputs.loan_month)
      );
      setCalculatedLoanPayment(calculatedPayment.toFixed(2));
    } else {
      setCalculatedLoanPayment(""); // Clear payment if inputs are not valid
    }
  }, [loanInputs.loan_amount, loanInputs.loan_month, loanRateData]);

  if (isLoanRateLoading || isAllUnivLoading || isAllICLoading)
    return <div>Loading...</div>;

  if (loanRateError || allUnivError || allICError)
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
          Open Loan Account
        </Typography>
        <Grid container spacing={2} style={{ backgroundColor: "#f3f7fd" }}>
          <Grid item xs={12} sm={6}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="loan_type"> Loan Types</InputLabel>
              <Select
                id="loan_type"
                name="loan_type"
                value={loanInputs.loan_type}
                onChange={handleLoanInputChange}
              >
                <MenuItem value="">
                  <em>Select Loan Type</em>
                </MenuItem>
                <MenuItem value={AccountTypes.STUDENT_LOAN}>
                  Student Loan
                </MenuItem>
                <MenuItem value={AccountTypes.HOME_LOAN}>Home Loan</MenuItem>
                <MenuItem value={AccountTypes.LOAN}>Other Loans</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Name"
              id="acct_name"
              name="acct_name"
              value={acctInputs.acct_name}
              onChange={handleAcctInputChange}
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
              value={acctInputs.acct_bill_state}
              onChange={handleAcctInputChange}
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
              value={acctInputs.acct_bill_city}
              onChange={handleAcctInputChange}
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
              value={acctInputs.acct_bill_street}
              onChange={handleAcctInputChange}
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
              value={acctInputs.acct_bill_zipcode}
              onChange={handleAcctInputChange}
              variant="standard"
              fullWidth
              error={!!errors.acct_bill_zipcode}
              helperText={errors.acct_bill_zipcode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Lone Rate"
              id="loan_rate"
              name="loan_rate"
              value={`$${Number(
                loanRateData.loanInterestRate.loan_rate
              ).toFixed(2)}`}
              InputProps={{
                readOnly: true,
              }}
              variant="standard"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Loan Amount"
              id="loan_amount"
              name="loan_amount"
              value={loanInputs.loan_amount}
              onChange={handleLoanInputChange}
              variant="standard"
              fullWidth
              error={!!errors.loan_amount}
              helperText={errors.loan_amount}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Loan Term (Months)"
              id="loan_month"
              name="loan_month"
              value={loanInputs.loan_month}
              onChange={handleLoanInputChange}
              variant="standard"
              placeholder="Duration in months"
              fullWidth
              error={!!errors.loan_month}
              helperText={errors.loan_month}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Calculated Monthly Payment ($)"
              value={calculatedLoanPayment || "Calculation needed"}
              variant="standard"
              placeholder="Will be calculated"
              fullWidth
              readOnly
            />
          </Grid>

          {loanInputs.loan_type === AccountTypes.STUDENT_LOAN && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Student ID"
                  id="stud_id"
                  name="stud_id"
                  value={studLoanInputs.stud_id}
                  onChange={handleStudLoanInputChange}
                  variant="standard"
                  fullWidth
                  error={!!errors.stud_id}
                  helperText={errors.stud_id}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="loan_type">Student Type</InputLabel>
                  <Select
                    id="stud_type"
                    name="stud_type"
                    value={studLoanInputs.stud_type}
                    onChange={handleStudLoanInputChange}
                  >
                    <MenuItem value="">
                      <em>Select Student Type</em>
                    </MenuItem>
                    <MenuItem value={StudentTypes.UNDERGRADE}>
                      Undergraduate
                    </MenuItem>
                    <MenuItem value={StudentTypes.GRADUATE}>Graduate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputLabel id="loan_type">Expected Graduation Date</InputLabel>

                <StyledDatePicker
                  label="Expected Graduation Date"
                  selected={
                    studLoanInputs.exp_grad_date
                      ? new Date(studLoanInputs.exp_grad_date + "T00:00:00")
                      : null
                  }
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="loan_type">University</InputLabel>
                  <Select
                    id="univ_id"
                    name="univ_id"
                    value={studLoanInputs.univ_id}
                    onChange={handleStudLoanInputChange}
                    disabled={isAllUnivLoading}
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

          {loanInputs.loan_type === AccountTypes.HOME_LOAN && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="House Built Year"
                  type="number"
                  id="built_year"
                  name="built_year"
                  value={homeLoanInputs.built_year}
                  onChange={handleHomeLoanInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  variant="standard"
                  fullWidth
                  error={!!errors.built_year}
                  helperText={errors.built_year}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Home Insurance Account Number"
                  type="text"
                  id="home_ins_acc_no"
                  name="home_ins_acc_no"
                  value={homeLoanInputs.home_ins_acc_no}
                  onChange={handleHomeLoanInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  variant="standard"
                  fullWidth
                  error={!!errors.home_ins_acc_no}
                  helperText={errors.home_ins_acc_no}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Insurance Premium (Annual)"
                  type="number"
                  id="ins_premium"
                  name="ins_premium"
                  value={homeLoanInputs.ins_premium}
                  onChange={handleHomeLoanInputChange}
                  step="0.01"
                  variant="standard"
                  fullWidth
                  error={!!errors.ins_premium}
                  helperText={errors.ins_premium}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="loan_type">Insurance Company</InputLabel>
                  <Select
                    id="ic_id"
                    name="ic_id"
                    value={homeLoanInputs.ic_id}
                    onChange={(e) =>
                      setHomeLoanInputs((prev) => ({
                        ...prev,
                        ic_id: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="">
                      <em>Select Insurance Company</em>
                    </MenuItem>
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
        </Grid>
        <br></br>
        <br></br>
        <br></br>
        <Button type="submit" onClick={handleOpenLoanAccountClick}>
          Agree! Open a Loan Account
        </Button>
      </StyledPaper>

      <form></form>
    </div>
  );
};

export default OpenLoanAccount;
