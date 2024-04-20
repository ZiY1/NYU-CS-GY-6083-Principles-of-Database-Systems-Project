import "./editsavingaccount.scss";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { makeRequest } from "../../../../../axios";
import { AccountContext } from "../../../../../context/accountContext";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import AlertBox from '../../../../../components/altert_box/AlertBox';


const EditSavingAccount = () => {

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { hasSavingAccountSetFalse } = useContext(AccountContext);

    const { isLoading, error, data } = useQuery({
        queryKey: ['saving_account_details'],
        queryFn: () => makeRequest.get("/saving_account/get").then((res) => res.data),

        onError: (err) => {
            console.error("Query error");
        }
    });

    console.log(data);

    // Initialize form state with fetched data or defaults
    const [inputs, setInputs] = useState({
        acct_name: "",
        acct_bill_state: "",
        acct_bill_city: "",
        acct_bill_street: "",
        acct_bill_zipcode: ""
    });

    // Update state when data is available
    useEffect(() => {
        if (data) {
            setInputs({
                acct_name: data.savingAccountDetails.acct_name || "",
                acct_bill_state: data.savingAccountDetails.acct_bill_state || "",
                acct_bill_city: data.savingAccountDetails.acct_bill_city || "",
                acct_bill_street: data.savingAccountDetails.acct_bill_street || "",
                acct_bill_zipcode: data.savingAccountDetails.acct_bill_zipcode || ""
            });
        }
    }, [data]);

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ type: '', message: '', isVisible: false });

    // Alert functions
    const showAlert = (type, message) => setAlert({ type, message, isVisible: true });
    const hideAlert = () => setAlert({ ...alert, isVisible: false });

    // Input change handler
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
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

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (updateDetails) => makeRequest.put(`/saving_account/update/`, updateDetails),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saving_account_details"] });
            queryClient.invalidateQueries({ queryKey: ["saving_account"] });
            showAlert('success', 'Changes saved successfully!');
        },
        onError: (error) => {
            showAlert('error', 'Failed to save changes: ' + (error.response?.data?.message || 'Unknown error'));
        }
    });

    const handleSaveChanges = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        updateMutation.mutate(inputs);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            deleteMutation.mutate();
        }
    };

    const deleteMutation = useMutation({
        mutationFn: () => makeRequest.delete(`/saving_account/delete/`),
        onSuccess: () => {
            showAlert('success', 'Account deleted successfully');
            queryClient.invalidateQueries({ queryKey: ["saving_account_details"] });
            queryClient.invalidateQueries({ queryKey: ["saving_account"] });
            hasSavingAccountSetFalse();
            navigate('/');
        },
        onError: (err) => {
            showAlert('error', 'Failed to delete the account: ' + (err.response?.data?.message || 'Unknown error'));
        }
    });


    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error fetching account details!</div>;

    return (
        <div className="edit_saving_account">
            <h1>Edit Saving Account</h1>
            {alert.isVisible && <AlertBox type={alert.type} message={alert.message} onClose={hideAlert} />}
            <form>
                <div className="form-group">
                    <label htmlFor="acct_no">Account Number</label>
                    <input
                        type="text"
                        id="acct_no"
                        name="acct_no"
                        value={data.savingAccountDetails.acct_no}
                        readOnly
                        className="read-only-input"
                    />
                </div>
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
                    <label htmlFor="service_fee">Monthly Interest Rate</label>
                    <input
                        type="text"
                        id="service_fee"
                        name="service_fee"
                        value={`${Number(data.savingAccountDetails.interest_rate).toFixed(2)}%`}
                        readOnly
                        className="read-only-input"
                    />
                </div>
                <button type="submit" onClick={handleSaveChanges}>Save Changes</button>
                <button type="button" className="delete-button" onClick={handleDeleteAccount}>Delete Account</button>
            </form>
        </div>
    );
};

export default EditSavingAccount;