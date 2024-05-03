import React, { createContext, useEffect, useState } from 'react';
export const AccountContext = createContext();

export const AccountContextProvider = ({ children }) => {
    
    // Checking Account Context
    const [hasCheckingAccount, setHasCheckingAccount] = useState(
        JSON.parse(localStorage.getItem('hasCheckingAccount')) || false
    );

    const hasCheckingAccountSetTrue = () => {
        setHasCheckingAccount(true);
    };

    const hasCheckingAccountSetFalse = () => {
        setHasCheckingAccount(false);
    };

    useEffect(() => {
        localStorage.setItem('hasCheckingAccount', JSON.stringify(hasCheckingAccount));
    }, [hasCheckingAccount]);

    // Saving Account Context
    const [hasSavingAccount, setHasSavingAccount] = useState(
        JSON.parse(localStorage.getItem('hasSavingAccount')) || false
    );

    const hasSavingAccountSetTrue = () => {
        setHasSavingAccount(true);
    };

    const hasSavingAccountSetFalse = () => {
        setHasSavingAccount(false);
    };

    useEffect(() => {
        localStorage.setItem('hasSavingAccount', JSON.stringify(hasSavingAccount));
    }, [hasSavingAccount]);

    // Loan Account Context
    const [hasLoanAccount, setHasLoanAccount] = useState(
        JSON.parse(localStorage.getItem('hasLoanAccount')) || false
    );

    const hasLoanAccountSetTrue = () => {
        setHasLoanAccount(true);
    };

    const hasLoanAccountSetFalse = () => {
        setHasLoanAccount(false);
    };

    useEffect(() => {
        localStorage.setItem('hasLoanAccount', JSON.stringify(hasLoanAccount));
    }, [hasLoanAccount]);

    
    return (
        <AccountContext.Provider value={{ 
            hasCheckingAccount, hasCheckingAccountSetTrue, hasCheckingAccountSetFalse,
            hasSavingAccount, hasSavingAccountSetTrue, hasSavingAccountSetFalse,
            hasLoanAccount, hasLoanAccountSetTrue, hasLoanAccountSetFalse
            }}>
            {children}
        </AccountContext.Provider>
    );
};
