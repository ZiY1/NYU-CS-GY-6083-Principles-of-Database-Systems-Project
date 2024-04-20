import React, { useContext, useState } from "react";
import "./opencheckingaccount.scss";
import { useNavigate } from "react-router-dom";
import AlertBox from '../../../../../components/altert_box/AlertBox';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { makeRequest } from "../../../../../axios";
import { AccountContext } from "../../../../../context/accountContext";

const OpenCheckingAccount = () => {

    const navigate = useNavigate();

    const { hasCheckingAccountSetTrue } = useContext(AccountContext);

    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery({
        queryKey: ['checking_acct_service_charge'],
        queryFn: () => makeRequest.get("/acct_rate/service_charge").then((res) => res.data),

        onError: (err) => {
            console.error("Query error");
        }
    });

    console.log(data);

    // Initialize form state
    const [inputs, setInputs] = useState({
        acct_name: "",
        acct_bill_state: "",
        acct_bill_city: "",
        acct_bill_street: "",
        acct_bill_zipcode: ""
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
    const handleChange = (event) => {
        const { name, value } = event.target;

        setInputs(prev => ({
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

    // Function to validate form inputs
    const validateForm = () => {
        const newErrors = {};

        // Define maximum lengths based on your database schema
        const maxLengths = {
            acct_name: 30,
            acct_bill_state: 30,
            acct_bill_city: 30,
            acct_bill_street: 30,
            acct_bill_zipcode: 30
        };

        Object.keys(inputs).forEach((key) => {
            if (!inputs[key]) {
                newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} is required.`; // Adding spaces before capital letters for better readability
            } else if (inputs[key].length > maxLengths[key]) {
                newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} must be at most ${maxLengths[key]} characters.`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;


    };

    // Mutations
    const mutation = useMutation({
        mutationFn: (newCheckingAccountDetails) => {
            return makeRequest.post("/checking_account/open", newCheckingAccountDetails);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["checking_account"] });
            hasCheckingAccountSetTrue();
        },
    });

    // Function to handle form submission
    const handleOpenCheckingAccountClick = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        mutation.mutate(inputs);

        navigate("/");
    };

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error fetching account details!</div>;

    return (
        <div className="open_checking_account">
            <h1>Open Checking Account</h1>
            {alert.isVisible && <AlertBox type={alert.type} message={alert.message} onClose={hideAlert} />}
            <form>
                <div className="form-group">
                    <label htmlFor="acct_name">Account Name</label>
                    <input type="text" id="acct_name" name="acct_name" value={inputs.acct_name} onChange={handleChange} />
                    {errors.acct_name && <p className="error">{errors.acct_name}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="acct_bill_state">Billing State</label>
                    <input type="text" id="acct_bill_state" name="acct_bill_state" value={inputs.acct_bill_state} onChange={handleChange} />
                    {errors.acct_bill_state && <p className="error">{errors.acct_bill_state}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="acct_bill_city">Billing City</label>
                    <input type="text" id="acct_bill_city" name="acct_bill_city" value={inputs.acct_bill_city} onChange={handleChange} />
                    {errors.acct_bill_city && <p className="error">{errors.acct_bill_city}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="acct_bill_street">Billing Street</label>
                    <input type="text" id="acct_bill_street" name="acct_bill_street" value={inputs.acct_bill_street} onChange={handleChange} />
                    {errors.acct_bill_street && <p className="error">{errors.acct_bill_street}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="acct_bill_zipcode">Billing Zip Code</label>
                    <input type="text" id="acct_bill_zipcode" name="acct_bill_zipcode" value={inputs.acct_bill_zipcode} onChange={handleChange} />
                    {errors.acct_bill_zipcode && <p className="error">{errors.acct_bill_zipcode}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="service_fee">Monthly Account Maintenance Fees</label>
                    <input
                        type="text"
                        id="service_fee"
                        name="service_fee"
                        value={`$${Number(data.serviceCharge.service_charge).toFixed(2)}`}
                        readOnly
                        className="read-only-input"
                    />
                </div>
                <button type="submit" onClick={handleOpenCheckingAccountClick}>Agree! Open a Checking Account</button>
            </form>

        </div>
    );
};

export default OpenCheckingAccount;
