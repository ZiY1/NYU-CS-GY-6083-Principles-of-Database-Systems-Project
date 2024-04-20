import { useQuery } from '@tanstack/react-query';
import "./checkingaccount.scss";
import { makeRequest } from '../../axios';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { AccountContext } from "../../context/accountContext";
import moment from 'moment';

const CheckingAccount = () => {

    const { currentUser } = useContext(AuthContext);

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
    const handleCardClick = (accountDetails) => {
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
                    <button onClick={handleOpenCheckingAccountClick}>Open a Checking Account</button>
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
                <h1>Checking Account</h1>
                {data && (
                    <div className="card" onClick={() => handleCardClick(data.checkingAccountDetails)}>
                        <p>Account No: {data.checkingAccountDetails.acct_no}</p>
                        <p>Account Name: {data.checkingAccountDetails.acct_name}</p>
                        <p>Date Opened: {formatDate(data.checkingAccountDetails.acct_date_opened)}</p>
                        <p>Billing State: {data.checkingAccountDetails.acct_bill_state}</p>
                        <p>Billing City: {data.checkingAccountDetails.acct_bill_city}</p>
                        <p>Billing Street: {data.checkingAccountDetails.acct_bill_street}</p>
                        <p>Billing Zipcode: {data.checkingAccountDetails.acct_bill_zipcode}</p>
                        <p>Service Charge: {`$${Number(data.checkingAccountDetails.service_charge).toFixed(2)}`}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckingAccount;
