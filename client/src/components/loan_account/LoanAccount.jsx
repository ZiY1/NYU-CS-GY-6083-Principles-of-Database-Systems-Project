import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AccountContext } from "../../context/accountContext";
import moment from 'moment';
import { AccountTypes } from "../../../../api/constants/account_constants.js";

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
const LoanAccount = () => {

    const { hasLoanAccountSetTrue, hasLoanAccountSetFalse } = useContext(AccountContext);

    const navigate = useNavigate();

    const { data: loanData, isLoading: isLoanLoading, error: loanError } = useQuery({
        queryKey: ['loan_account'],
        queryFn: () => makeRequest.get("/loan_account/get").then((res) => res.data),
        retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
        onError: (err) => {
            hasLoanAccountSetFalse();
            console.error("Query error:", err);
        }
    });

    const univ_id = loanData?.loanAccountDetails?.univ_id;

    const { data: universityData, isLoading: isUniversityLoading, error: universityError } = useQuery({
        queryKey: ['university', univ_id],
        queryFn: () => makeRequest.get("/university/get", { 
            params: { univ_id } 
        }).then((res) => res.data),
        enabled: !!univ_id, // query will not execute until ic_id exists
        retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
        onError: (err) => {
            console.error("Query error:", err);
        }
    });

    const ic_id = loanData?.loanAccountDetails?.ic_id;

    const { data: insuranceCompanyData, isLoading: isInsuranceCompanyLoading, error: insuranceCompanyError } = useQuery({
        queryKey: ['insurance_company', ic_id],
        queryFn: () => makeRequest.get("/insur_co/get", { 
            params: { ic_id } 
        }).then((res) => res.data),
        enabled: !!ic_id, // query will not execute until ic_id exists
        retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
        onError: (err) => {
            console.error("Query error:", err);
        }
    });

    useEffect(() => {
        if (loanData) {
            // console.log('Data available, setting account status to true:', loanData);
            hasLoanAccountSetTrue();
        }
    }, [loanData, hasLoanAccountSetTrue]);

    // The function to handle opening a new account
    const handleOpenLoanAccountClick = () => {
        navigate('/open_loan_account/');
    };

    // The function to handle view an existing account
    const handleCardClick = () => {
        navigate('/edit_loan_account/');
    };

    const formatDateTime = (dateString) => {
        return moment(dateString).format('MMMM DD, YYYY, hh:mm:ss A');
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('MMMM DD, YYYY');
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
                <div className="loan_account_button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                    <Button onClick={handleOpenLoanAccountClick}>Open a Loan Account</Button>
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
            <div className="loan_account">
                <h1>Loan Account</h1>
                {loanData && (
                    <div className="card" onClick={() => handleCardClick()}>
                        <p>Account No: {loanData.loanAccountDetails.acct_no}</p>
                        <p>Account Name: {loanData.loanAccountDetails.acct_name}</p>
                        <p>Date Opened: {formatDateTime(loanData.loanAccountDetails.acct_date_opened)}</p>
                        <p>Billing State: {loanData.loanAccountDetails.acct_bill_state}</p>
                        <p>Billing City: {loanData.loanAccountDetails.acct_bill_city}</p>
                        <p>Billing Street: {loanData.loanAccountDetails.acct_bill_street}</p>
                        <p>Billing Zipcode: {loanData.loanAccountDetails.acct_bill_zipcode}</p>
                        <p>Monthly Loan Rate: {`${Number(loanData.loanAccountDetails.loan_rate).toFixed(2)}%`}</p>
                        <p>Loan Amount: {`$${Number(loanData.loanAccountDetails.loan_amount).toFixed(2)}`}</p>
                        <p>Loan Month: {`${Number(loanData.loanAccountDetails.loan_month)}`}</p>
                        <p>Loan Payment: {`$${Number(loanData.loanAccountDetails.loan_payment).toFixed(2)}`}</p>
                        {loanData.loanAccountDetails.loan_type === AccountTypes.STUDENT_LOAN && (
                            <>
                                <p>Loan Tyoe: Student Loan</p>
                                <p>Student ID: {loanData.loanAccountDetails.stud_id}</p>
                                <p>Student Type: {loanData.loanAccountDetails.stud_type}</p>
                                <p>Expected Graduation Date: {formatDate(loanData.loanAccountDetails.exp_grad_date)}</p>
                                <p>University Name: {universityData.univ.univ_name}</p>
                            </>
                        )}
                        {loanData.loanAccountDetails.loan_type === AccountTypes.HOME_LOAN && (
                            <>
                                <p>Loan Tyoe: Home Loan</p>
                                <p>House Built Year: {loanData.loanAccountDetails.built_year}</p>
                                <p>Home Insurance Account NO: {loanData.loanAccountDetails.home_ins_acc_no}</p>
                                <p>Insurance Premium: {loanData.loanAccountDetails.ins_premium}</p>
                                <p>Insurance Company Name: {insuranceCompanyData.insuranceCompany.ic_name}</p>
                            </>
                        )}
                        {loanData.loanAccountDetails.loan_type === AccountTypes.LOAN && (
                            <>
                                <p>Loan Tyoe: Other Loan</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanAccount;
