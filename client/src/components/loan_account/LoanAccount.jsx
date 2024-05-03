import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AccountContext } from "../../context/accountContext";
import moment from "moment";
import { AccountTypes } from "../../../../api/constants/account_constants.js";
import { Grid, Typography, Box } from "@mui/material";
import StyledPaper from "../StyledPaper/StyledPaper";
import styled, { keyframes } from "styled-components";
const jump = keyframes`
  from{
    transform: translateY(0)
  }
  to{
    transform: translateY(-3px)
  }
`;
const Button = styled.button`
  width: 250px;
  max-width: 100%;
  text-align: center;
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

  &:hover {
    background: rgb(200, 50, 70);
    animation: ${jump} 0.2s ease-out forwards;
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

const LoanAccount = () => {
  const { hasLoanAccountSetTrue, hasLoanAccountSetFalse } =
    useContext(AccountContext);

  const navigate = useNavigate();

  const {
    data: loanData,
    isLoading: isLoanLoading,
    error: loanError,
  } = useQuery({
    queryKey: ["loan_account"],
    queryFn: () => makeRequest.get("/loan_account/get").then((res) => res.data),
    retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
    onError: (err) => {
      hasLoanAccountSetFalse();
      console.error("Query error:", err);
    },
  });

  const univ_id = loanData?.loanAccountDetails?.univ_id;

  const {
    data: universityData,
    isLoading: isUniversityLoading,
    error: universityError,
  } = useQuery({
    queryKey: ["university", univ_id],
    queryFn: () =>
      makeRequest
        .get("/university/get", {
          params: { univ_id },
        })
        .then((res) => res.data),
    enabled: !!univ_id, // query will not execute until ic_id exists
    retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
    onError: (err) => {
      console.error("Query error:", err);
    },
  });

  const ic_id = loanData?.loanAccountDetails?.ic_id;

  const {
    data: insuranceCompanyData,
    isLoading: isInsuranceCompanyLoading,
    error: insuranceCompanyError,
  } = useQuery({
    queryKey: ["insurance_company", ic_id],
    queryFn: () =>
      makeRequest
        .get("/insur_co/get", {
          params: { ic_id },
        })
        .then((res) => res.data),
    enabled: !!ic_id, // query will not execute until ic_id exists
    retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
    onError: (err) => {
      console.error("Query error:", err);
    },
  });

  useEffect(() => {
    if (loanData) {
      // console.log('Data available, setting account status to true:', loanData);
      hasLoanAccountSetTrue();
    }
  }, [loanData, hasLoanAccountSetTrue]);

  // The function to handle opening a new account
  const handleOpenLoanAccountClick = () => {
    navigate("/open_loan_account/");
  };

  // The function to handle view an existing account
  const handleCardClick = () => {
    navigate("/edit_loan_account/");
  };

  const formatDateTime = (dateString) => {
    return moment(dateString).format("MMMM DD, YYYY, hh:mm:ss A");
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MMMM DD, YYYY");
  };

  if (isLoanLoading || isInsuranceCompanyLoading || isUniversityLoading) {
    return <div>Loading...</div>;
  }

  if (loanError) {
    // Check if the error status is 404
    if (loanError.response && loanError.response.status === 404) {
      hasLoanAccountSetFalse();
      // Render the button to open a new loan account
      return (
        <div
          className="loan_account_button"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={handleOpenLoanAccountClick}>
            Open a Loan Account
          </Button>
        </div>
      );
    } else {
      // Handle other errors
      return <div>An error occurred: {loanError.message}</div>;
    }
  }

  if (insuranceCompanyError) {
    // TODO:
  }

  return (
    <div className="loan_account">
      {loanData && (
        <StyledPaper elevation={3} sx={{ p: 2, backgroundColor: "#f3f7fd" }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Loan Account
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Account No:</strong>{" "}
                {loanData.loanAccountDetails.acct_no}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Account Name:</strong>{" "}
                {loanData.loanAccountDetails.acct_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Date Opened:</strong>{" "}
                {formatDateTime(loanData.loanAccountDetails.acct_date_opened)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Billing State:</strong>{" "}
                {loanData.loanAccountDetails.acct_bill_state}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Billing City:</strong>{" "}
                {loanData.loanAccountDetails.acct_bill_city}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Billing Street:</strong>{" "}
                {loanData.loanAccountDetails.acct_bill_street}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Billing Zipcode:</strong>{" "}
                {loanData.loanAccountDetails.acct_bill_zipcode}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Monthly Loan Rate:</strong>{" "}
                {`${Number(loanData.loanAccountDetails.loan_rate).toFixed(2)}%`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Loan Amount:</strong>{" "}
                {`$${Number(loanData.loanAccountDetails.loan_amount).toFixed(
                  2
                )}`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Loan Month:</strong>{" "}
                {`${Number(loanData.loanAccountDetails.loan_month)}`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Loan Payment:</strong>{" "}
                {`$${Number(loanData.loanAccountDetails.loan_payment).toFixed(
                  2
                )}`}
              </Typography>
            </Grid>
            {loanData.loanAccountDetails.loan_type ===
              AccountTypes.STUDENT_LOAN && (
              <>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Loan Type:</strong> Student Loan
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Student ID:</strong>{" "}
                    {loanData.loanAccountDetails.stud_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Student Type:</strong>{" "}
                    {loanData.loanAccountDetails.stud_type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Expected Graduation Date:</strong>{" "}
                    {formatDate(loanData.loanAccountDetails.exp_grad_date)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>University Name:</strong>{" "}
                    {universityData.univ.univ_name}
                  </Typography>
                </Grid>
              </>
            )}
            {loanData.loanAccountDetails.loan_type ===
              AccountTypes.HOME_LOAN && (
              <>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Loan Type:</strong> Home Loan
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>House Built Year:</strong>{" "}
                    {loanData.loanAccountDetails.built_year}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Home Insurance Account No:</strong>{" "}
                    {loanData.loanAccountDetails.home_ins_acc_no}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Insurance Premium:</strong>{" "}
                    {loanData.loanAccountDetails.ins_premium}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Insurance Company Name:</strong>{" "}
                    {insuranceCompanyData.insuranceCompany.ic_name}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
          <br />
          <br />
          <br />
          <CornerButton onClick={handleCardClick}>EDIT</CornerButton>
        </StyledPaper>
      )}
    </div>
  );
};

export default LoanAccount;
