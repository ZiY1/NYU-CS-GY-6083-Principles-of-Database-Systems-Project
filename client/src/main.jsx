import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthContextProvider } from './context/authContext.jsx';
import { AccountContextProvider } from './context/accountContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
    <AccountContextProvider>
      <App />
      </AccountContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
