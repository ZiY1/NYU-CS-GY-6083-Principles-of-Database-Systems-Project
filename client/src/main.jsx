import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthContextProvider } from './context/authContext.jsx';
import { AccountContextProvider } from './context/accountContext.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
    <AccountContextProvider>
    <ThemeProvider theme={theme}>
    <App />

    </ThemeProvider>
      </AccountContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
