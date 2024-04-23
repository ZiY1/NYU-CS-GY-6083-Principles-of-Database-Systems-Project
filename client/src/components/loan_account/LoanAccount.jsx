import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AccountContext } from "../../context/accountContext";
import moment from 'moment';
import { AccountTypes } from "../../../../api/constants/account_constants.js";

const LoanAccount = () => {

    const { hasLoanAccountSetTrue, hasLoanAccountSetFalse } = useContext(AccountContext);

    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery({
        queryKey: ['loan_account'],
        queryFn: () => makeRequest.get("/loan_account/get").then((res) => res.data),
        retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
        onError: (err) => {
            hasLoanAccountSetFalse();
            console.error("Query error");
        }
    });

    useEffect(() => {
        if (data) {
            console.log('Data available, setting account status to true:', data);
            hasLoanAccountSetTrue();
        }
    }, [data, hasLoanAccountSetTrue]);

    // The function to handle opening a new account
    const handleOpenLoanAccountClick = () => {
        // navigate('/open_loan_account/');
    };

    // The function to handle view an existing account
    const handleCardClick = () => {
        // navigate('/edit_loan_account/');
    };

    const formatDateTime = (dateString) => {
        return moment(dateString).format('MMMM DD, YYYY, hh:mm:ss A');
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('MMMM DD, YYYY');
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        // Check if the error status is 404
        if (error.response && error.response.status === 404) {
            hasLoanAccountSetFalse();
            // Render the button to open a new loan account
            return (
                <div>
                    <button onClick={handleOpenLoanAccountClick}>Open a Loan Account</button>
                </div>
            );
        } else {
            // Handle other errors
            return <div>An error occurred: {error.message}</div>;
        }
    }


    return (
        <div className="loan_account">
            <div className="loan_account">
                <h1>Loan Account</h1>
                {data && (
                    <div className="card" onClick={() => handleCardClick()}>
                        <p>Account No: {data.loanAccountDetails.acct_no}</p>
                        <p>Account Name: {data.loanAccountDetails.acct_name}</p>
                        <p>Date Opened: {formatDateTime(data.loanAccountDetails.acct_date_opened)}</p>
                        <p>Billing State: {data.loanAccountDetails.acct_bill_state}</p>
                        <p>Billing City: {data.loanAccountDetails.acct_bill_city}</p>
                        <p>Billing Street: {data.loanAccountDetails.acct_bill_street}</p>
                        <p>Billing Zipcode: {data.loanAccountDetails.acct_bill_zipcode}</p>
                        <p>Monthly Loan Rate: {`${Number(data.loanAccountDetails.loan_rate).toFixed(2)}%`}</p>
                        <p>Loan Amount: {`$${Number(data.loanAccountDetails.loan_amount).toFixed(2)}`}</p>
                        <p>Loan Month: {`${Number(data.loanAccountDetails.loan_month)}`}</p>
                        <p>Loan Payment: {`$${Number(data.loanAccountDetails.loan_payment).toFixed(2)}`}</p>
                        {data.loanAccountDetails.loan_type === AccountTypes.STUDENT_LOAN && (
                            <>
                                <p>Student ID: {data.loanAccountDetails.stud_id}</p>
                                <p>Student Type: {data.loanAccountDetails.stud_type}</p>
                                <p>Expected Graduation Date: {formatDate(data.loanAccountDetails.exp_grad_date)}</p>
                                <p>University ID: {data.loanAccountDetails.univ_id}</p>
                            </>
                        )}
                        {data.loanAccountDetails.loan_type === AccountTypes.HOME_LOAN && (
                            <>
                                <p>House Built Year: {data.loanAccountDetails.built_year}</p>
                                <p>Home Insurance Account NO: {data.loanAccountDetails.home_ins_acc_no}</p>
                                <p>Insurance Premium: {data.loanAccountDetails.ins_premium}</p>
                                <p>Insurance Company ID: {data.loanAccountDetails.ic_id}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanAccount;
