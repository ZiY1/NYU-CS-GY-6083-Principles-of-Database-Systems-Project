import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AccountContext } from "../../context/accountContext";
import moment from 'moment';

import styled, { keyframes } from "styled-components";

import { Paper, Grid, Typography, Box } from "@mui/material";

const StyledPaper = styled(Paper)`
  position: relative; // Make the paper a reference for positioning
  padding: 20px; // Ensure padding for internal content
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

const Button = styled.button`
  max-width: 100%;
  width: 250px;
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

const SavingAccount = () => {

    const { hasSavingAccountSetTrue, hasSavingAccountSetFalse } = useContext(AccountContext);

    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery({
        queryKey: ['saving_account'],
        queryFn: () => makeRequest.get("/saving_account/get").then((res) => res.data),
        retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
        onError: (err) => {
            console.error("Query error");
        }
    });

    useEffect(() => {
        if (data) {
            console.log('Data available, setting account status to true:', data);
            hasSavingAccountSetTrue();
        }
    }, [data, hasSavingAccountSetTrue]);

    // The function to handle opening a new account
    const handleOpenSavingAccountClick = () => {
        navigate('/open_saving_account/');
    };

    // The function to handle view an existing account
    const handleCardClick = () => {
        navigate('/edit_saving_account/');
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('MMMM DD, YYYY, hh:mm:ss A'); // Example format
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        // Check if the error status is 404
        if (error.response && error.response.status === 404) {
            hasSavingAccountSetFalse();
            // Render the button to open a new saving account
            return (
                <div className="saving_account_button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                    <Button onClick={handleOpenSavingAccountClick}>Open a Saving Account</Button>
                </div>
            );
        } else {
            // Handle other errors
            return <div>An error occurred: {error.message}</div>;
        }
    }
    return (
        <div className="saving_account" style={{gap: "0px", margin: "0px", padding: "0px"}}>
          {data && (
            <div className="card">
              <StyledPaper elevation={3}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2 }}
                  style={{ backgroundColor: "#f3f7fd" }}
                >
                  Saving Account Details
                </Typography>
                <Grid container spacing={2} style={{ backgroundColor: "#f3f7fd" }}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body1" style={{ backgroundColor: "#f3f7fd" }}>
                        <strong>Account No:</strong> {data.savingAccountDetails.acct_no || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body1" style={{ backgroundColor: "#f3f7fd" }}>
                        <strong>Account Name:</strong> {data.savingAccountDetails.acct_name || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body1" style={{ backgroundColor: "#f3f7fd" }}>
                        <strong>Date Opened:</strong> {data ? formatDate(data.savingAccountDetails.acct_date_opened) : "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body1" style={{ backgroundColor: "#f3f7fd" }}>
                        <strong>Billing State:</strong> {data.savingAccountDetails.acct_bill_state || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body1" style={{ backgroundColor: "#f3f7fd" }}>
                        <strong>Billing City:</strong> {data.savingAccountDetails.acct_bill_city || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body1" style={{ backgroundColor: "#f3f7fd" }}>
                        <strong>Billing Street:</strong> {data.savingAccountDetails.acct_bill_street || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body1" style={{ backgroundColor: "#f3f7fd" }}>
                        <strong>Billing Zipcode:</strong> {data.savingAccountDetails.acct_bill_zipcode || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body1" style={{ backgroundColor: "#f3f7fd" }}>
                        <strong>Monthly Interest Rate:</strong> {data ? `${Number(data.savingAccountDetails.interest_rate).toFixed(2)}%` : "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <br></br>
                <br></br>
                <CornerButton
                  onClick={() => {
                    handleCardClick();
                  }}
                >
                  EDIT
                </CornerButton>
              </StyledPaper>
            </div>
          )}
        </div>
      );
      
};

export default SavingAccount;
