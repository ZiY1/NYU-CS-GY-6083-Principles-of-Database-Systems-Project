import React, { createContext, useEffect, useState } from 'react';
export const AccountContext = createContext();

export const AccountContextProvider = ({ children }) => {
    
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

    return (
        <AccountContext.Provider value={{ hasCheckingAccount, hasCheckingAccountSetTrue, hasCheckingAccountSetFalse }}>
            {children}
        </AccountContext.Provider>
    );
};
