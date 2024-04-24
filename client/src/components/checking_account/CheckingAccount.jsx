import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AccountContext } from "../../context/accountContext";
import moment from 'moment';

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

const CheckingAccount = () => {

    const { hasCheckingAccountSetTrue, hasCheckingAccountSetFalse } = useContext(AccountContext);

    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery({
        queryKey: ['checking_account'],
        queryFn: () => makeRequest.get("/checking_account/get").then((res) => res.data),
        retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
        // onSuccess: (data) => {
        //     console.log('Query succeeded, setting account status to true');
        //     hasCheckingAccountSetTrue();
        // },
        onError: (err) => {
            hasCheckingAccountSetFalse();
            console.error("Query error");
        }
    });

    useEffect(() => {
        if (data) {
            console.log('Data available, setting account status to true:', data);
            hasCheckingAccountSetTrue();
        }
    }, [data, hasCheckingAccountSetTrue]);

    // The function to handle opening a new account
    const handleOpenCheckingAccountClick = () => {
        navigate('/open_checking_account/');
    };

    // The function to handle view an existing account
    const handleCardClick = () => {
        navigate('/edit_checking_account/');
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
            hasCheckingAccountSetFalse();
            // Render the button to open a new checking account
            return (
                <div>
                    <Button onClick={handleOpenCheckingAccountClick}>Open a Checking Account</Button>
                </div>
            );
        } else {
            // Handle other errors
            return <div>An error occurred: {error.message}</div>;
        }
    }


    return (
        <div className="checking_account">
            <div className="checking_account">
                <h3>Checking Account</h3>
                {data && (
                    <div className="card" onClick={() => handleCardClick()}>
                        <p>Account No: {data.checkingAccountDetails.acct_no}</p>
                        <p>Account Name: {data.checkingAccountDetails.acct_name}</p>
                        <p>Date Opened: {formatDate(data.checkingAccountDetails.acct_date_opened)}</p>
                        <p>Billing State: {data.checkingAccountDetails.acct_bill_state}</p>
                        <p>Billing City: {data.checkingAccountDetails.acct_bill_city}</p>
                        <p>Billing Street: {data.checkingAccountDetails.acct_bill_street}</p>
                        <p>Billing Zipcode: {data.checkingAccountDetails.acct_bill_zipcode}</p>
                        <p>Monthly Service Charge: {`$${Number(data.checkingAccountDetails.service_charge).toFixed(2)}`}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckingAccount;
