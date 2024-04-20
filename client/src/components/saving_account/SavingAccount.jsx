import { useQuery } from '@tanstack/react-query';
import "./savingaccount.scss";
import { makeRequest } from '../../axios';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AccountContext } from "../../context/accountContext";
import moment from 'moment';

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
                <div>
                    <button onClick={handleOpenSavingAccountClick}>Open a Saving Account</button>
                </div>
            );
        } else {
            // Handle other errors
            return <div>An error occurred: {error.message}</div>;
        }
    }


    return (
        <div className="saving_account">
            <div className="saving_account">
                <h1>Saving Account</h1>
                {data && (
                    <div className="card" onClick={() => handleCardClick()}>
                        <p>Account No: {data.savingAccountDetails.acct_no}</p>
                        <p>Account Name: {data.savingAccountDetails.acct_name}</p>
                        <p>Date Opened: {formatDate(data.savingAccountDetails.acct_date_opened)}</p>
                        <p>Billing State: {data.savingAccountDetails.acct_bill_state}</p>
                        <p>Billing City: {data.savingAccountDetails.acct_bill_city}</p>
                        <p>Billing Street: {data.savingAccountDetails.acct_bill_street}</p>
                        <p>Billing Zipcode: {data.savingAccountDetails.acct_bill_zipcode}</p>
                        <p>Monthly Interest Rate: {`${Number(data.savingAccountDetails.interest_rate).toFixed(2)}%`}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavingAccount;
