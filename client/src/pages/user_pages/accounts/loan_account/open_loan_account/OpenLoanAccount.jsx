import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from '../../../../../components/altert_box/AlertBox';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { makeRequest } from "../../../../../axios";
import { AccountContext } from "../../../../../context/accountContext";
import { AccountTypes, StudentTypes } from "../../../../../../../api/constants/account_constants";
import { calculateMonthlyLoanPayment } from "../../../../../../../api/utils/account_utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OpenLoanAccount = () => {

    const formatDateForMySQL = (date) => {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().split('T')[0];
    };


    const navigate = useNavigate();

    const { hasLoanAccountSetTrue } = useContext(AccountContext);

    const queryClient = useQueryClient();

    const { data: loanRateData, isLoading: isLoanRateLoading, error: loanRateError } = useQuery({
        queryKey: ['loan_acct_loan_rate'],
        queryFn: () => makeRequest.get("/acct_rate/loan_interest_rate").then((res) => res.data),
        onError: (err) => {
            console.error("Query error:", err);
        }
    });

    const { data: allUnivData, isLoading: isAllUnivLoading, error: allUnivError } = useQuery({
        queryKey: ['all_universities'],
        queryFn: () => makeRequest.get("/university/get_all").then((res) => res.data),
        retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
        onError: (err) => {
            console.error("Query error:", err);
        }
    });

    const { data: allICData, isLoading: isAllICLoading, error: allICError } = useQuery({
        queryKey: ['all_ic'],
        queryFn: () => makeRequest.get("/insur_co/get_all").then((res) => res.data),
        retry: (failureCount, error) => error?.response?.status !== 404, // Retry when the error status is not 404
        onError: (err) => {
            console.error("Query error:", err);
        }
    });

    console.log(allICData);

    // Initialize form state
    const [acctInputs, setAcctInputs] = useState({
        acct_name: "",
        acct_bill_state: "",
        acct_bill_city: "",
        acct_bill_street: "",
        acct_bill_zipcode: ""
    });

    const [loanInputs, setLoanInputs] = useState({
        loan_amount: "",
        loan_month: "",
        loan_type: ""
    });

    const [studLoanInputs, setStudLoanInputs] = useState({
        stud_id: "",
        stud_type: "",
        exp_grad_date: "",
        univ_id: ""
    });

    const [homeLoanInputs, setHomeLoanInputs] = useState({
        built_year: "",
        home_ins_acc_no: "",
        ins_premium: "",
        ic_id: ""
    });

    // Initialize state for managing form errors
    const [errors, setErrors] = useState({});

    const [alert, setAlert] = useState({
        type: '',
        message: '',
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

        setAcctInputs(prev => ({
            ...prev,
            [name]: value
        }));

        // Optionally clear errors as the user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleLoanInputChange = (event) => {
        const { name, value } = event.target;

        setLoanInputs(prev => ({
            ...prev,
            [name]: value
        }));

        // Optionally clear errors as the user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleStudLoanInputChange = (event) => {
        const { name, value } = event.target;

        setStudLoanInputs(prev => ({
            ...prev,
            [name]: value
        }));

        // Optionally clear errors as the user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = formatDateForMySQL(date);
            setStudLoanInputs(prev => ({
                ...prev,
                exp_grad_date: formattedDate
            }));
        } else {
            setStudLoanInputs(prev => ({
                ...prev,
                exp_grad_date: ''
            }));
        }
    };

    const handleHomeLoanInputChange = (event) => {
        const { name, value } = event.target;

        setHomeLoanInputs(prev => ({
            ...prev,
            [name]: value
        }));

        // Optionally clear errors as the user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
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
                newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} is required.`; // Adding spaces before capital letters for better readability
            } else if (acctInputs[key].length > maxLengths[key]) {
                newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} must be at most ${maxLengths[key]} characters.`;
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
                newErrors.home_ins_acc_no = "Home insurance account number is required.";
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
            ...(loanInputs.loan_type === AccountTypes.HOME_LOAN && homeLoanInputs)
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

    if (isLoanRateLoading || isAllUnivLoading || isAllICLoading) return <div>Loading...</div>;

    if (loanRateError || allUnivError || allICError) return <div>Error fetching records!</div>;

    return (
        <div className="open_loan_account">
            <h1>Open Loan Account</h1>
            {alert.isVisible && <AlertBox type={alert.type} message={alert.message} onClose={hideAlert} />}
            <form>
                <div className="form-group">
                    <label htmlFor="acct_name">Account Name</label>
                    <input type="text" id="acct_name" name="acct_name" value={acctInputs.acct_name} onChange={handleAcctInputChange} />
                    {errors.acct_name && <p className="error">{errors.acct_name}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="acct_bill_state">Billing State</label>
                    <input type="text" id="acct_bill_state" name="acct_bill_state" value={acctInputs.acct_bill_state} onChange={handleAcctInputChange} />
                    {errors.acct_bill_state && <p className="error">{errors.acct_bill_state}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="acct_bill_city">Billing City</label>
                    <input type="text" id="acct_bill_city" name="acct_bill_city" value={acctInputs.acct_bill_city} onChange={handleAcctInputChange} />
                    {errors.acct_bill_city && <p className="error">{errors.acct_bill_city}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="acct_bill_street">Billing Street</label>
                    <input type="text" id="acct_bill_street" name="acct_bill_street" value={acctInputs.acct_bill_street} onChange={handleAcctInputChange} />
                    {errors.acct_bill_street && <p className="error">{errors.acct_bill_street}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="acct_bill_zipcode">Billing Zip Code</label>
                    <input type="text" id="acct_bill_zipcode" name="acct_bill_zipcode" value={acctInputs.acct_bill_zipcode} onChange={handleAcctInputChange} />
                    {errors.acct_bill_zipcode && <p className="error">{errors.acct_bill_zipcode}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="loan_rate">Monthly Loan Interest Rate</label>
                    <input
                        type="text"
                        id="loan_rate"
                        name="loan_rate"
                        value={`$${Number(loanRateData.loanInterestRate.loan_rate).toFixed(2)}`}
                        readOnly
                        className="read-only-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="loan_type">Loan Type</label>
                    <select id="loan_type" name="loan_type" value={loanInputs.loan_type} onChange={handleLoanInputChange}>
                        <option value="">Select Loan Type</option>
                        <option value={AccountTypes.STUDENT_LOAN}>Student Loan</option>
                        <option value={AccountTypes.HOME_LOAN}>Home Loan</option>
                        <option value={AccountTypes.LOAN}>Other Loans</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="loan_amount">Loan Amount ($)</label>
                    <input
                        type="number"
                        id="loan_amount"
                        name="loan_amount"
                        placeholder="Enter loan amount in USD"
                        value={loanInputs.loan_amount}
                        onChange={handleLoanInputChange}
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="loan_month">Loan Term (Months)</label>
                    <input
                        type="number"
                        id="loan_month"
                        name="loan_month"
                        placeholder="Duration in months"
                        value={loanInputs.loan_month}
                        onChange={handleLoanInputChange}
                        min="1"
                        step="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Calculated Monthly Payment ($)</label>
                    <input
                        type="text"
                        readOnly
                        value={calculatedLoanPayment || "Calculation needed"}
                        placeholder="Will be calculated"
                    />
                </div>
                {loanInputs.loan_type === AccountTypes.STUDENT_LOAN && (
                    <>
                        <div className="form-group">
                            <label htmlFor="stud_id">Student ID</label>
                            <input
                                type="text"
                                id="stud_id"
                                name="stud_id"
                                value={studLoanInputs.stud_id}
                                onChange={handleStudLoanInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stud_type">Student Type</label>
                            <select
                                id="stud_type"
                                name="stud_type"
                                value={studLoanInputs.stud_type}
                                onChange={handleStudLoanInputChange}
                            >
                                <option value="">Select Student Type</option>
                                <option value={StudentTypes.UNDERGRADE}>Undergraduate</option>
                                <option value={StudentTypes.GRADUATE}>Graduate</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exp_grad_date">Expected Graduation Date</label>
                            <DatePicker
                                selected={studLoanInputs.exp_grad_date ? new Date(studLoanInputs.exp_grad_date + 'T00:00:00') : null}
                                onChange={handleDateChange}
                                dateFormat="MMMM d, yyyy"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="univ_id">University</label>
                            <select
                                id="univ_id"
                                name="univ_id"
                                value={studLoanInputs.univ_id}
                                onChange={handleStudLoanInputChange}
                                disabled={isAllUnivLoading}
                            >
                                <option value="">Select University</option>
                                {allUnivData.universities?.map((univ) => (
                                    <option key={univ.univ_id} value={univ.univ_id}>
                                        {univ.univ_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
                {loanInputs.loan_type === AccountTypes.HOME_LOAN && (
                    <>
                        <div className="form-group">
                            <label htmlFor="built_year">House Built Year</label>
                            <input
                                type="number"
                                id="built_year"
                                name="built_year"
                                value={homeLoanInputs.built_year}
                                onChange={handleHomeLoanInputChange}
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="home_ins_acc_no">Home Insurance Account Number</label>
                            <input
                                type="text"
                                id="home_ins_acc_no"
                                name="home_ins_acc_no"
                                value={homeLoanInputs.home_ins_acc_no}
                                onChange={handleHomeLoanInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ins_premium">Insurance Premium (Annual)</label>
                            <input
                                type="number"
                                id="ins_premium"
                                name="ins_premium"
                                value={homeLoanInputs.ins_premium}
                                onChange={handleHomeLoanInputChange}
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ic_id">Insurance Company</label>
                            <select
                                id="ic_id"
                                name="ic_id"
                                value={homeLoanInputs.ic_id}
                                onChange={(e) => setHomeLoanInputs(prev => ({ ...prev, ic_id: e.target.value }))}
                            >
                                <option value="">Select Insurance Company</option>
                                {allICData.insuranceCompanies?.map((ic) => (
                                    <option key={ic.ic_id} value={ic.ic_id}>
                                        {ic.ic_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <button type="submit" onClick={handleOpenLoanAccountClick}>Agree! Open a Loan Account</button>
            </form>
        </div>
    );
};

export default OpenLoanAccount;
