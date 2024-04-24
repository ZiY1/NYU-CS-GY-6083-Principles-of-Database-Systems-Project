import Login from "./pages/user_pages/login/Login";
import Register from "./pages/user_pages/register/Register";
import Home from "./pages/user_pages/home/Home";
import OpenCheckingAccount from "./pages/user_pages/accounts/checking_account/open_checking_account/OpenCheckingAccount.jsx";
import EditCheckingAccount from "./pages/user_pages/accounts/checking_account/edit_checking_account/EditCheckingAccount.jsx";
import OpenSavingAccount from "./pages/user_pages/accounts/saving_account/open_saving_account/OpenSavingAccount.jsx";
import EditSavingAccount from "./pages/user_pages/accounts/saving_account/edit_saving_account/EditSavingAccount.jsx";
import styled, { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    background: #FDF9F3;
  }

  body, html, #root {
    height: 100%;
    font-family: -apple-system, Ubuntu , BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  

`;
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { AccountContext } from './context/accountContext.jsx';
import NavBar from "./components/nav_bar/NavBar";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';


function App() {

  const { currentUser } = useContext(AuthContext);

  const { hasCheckingAccount, hasSavingAccount } = useContext(AccountContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>

        <Wrapper>
          <NavBar />
          <Outlet />
        </Wrapper>

      </QueryClientProvider>
    );
  };

  const ProtectedHomeRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const ProtectedOpenCheckingAccountRoute = ({ children }) => {
    if (hasCheckingAccount) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const ProtectedEditCheckingAccountRoute = ({ children }) => {
    if (!hasCheckingAccount) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const ProtectedOpenSavingAccountRoute = ({ children }) => {
    if (hasSavingAccount) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const ProtectedEditSavingAccountRoute = ({ children }) => {
    if (!hasSavingAccount) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedHomeRoute>
          <Layout />
        </ProtectedHomeRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/open_checking_account",
          element: (
            <ProtectedOpenCheckingAccountRoute>
              <OpenCheckingAccount />
            </ProtectedOpenCheckingAccountRoute>
          ),
        },
        {
          path: "/edit_checking_account",
          element: (
            <ProtectedEditCheckingAccountRoute>
              <EditCheckingAccount />
            </ProtectedEditCheckingAccountRoute>
          ),
        },
        {
          path: "/open_saving_account",
          element: (
            <ProtectedOpenSavingAccountRoute>
              <OpenSavingAccount />
            </ProtectedOpenSavingAccountRoute>
          ),
        },
        {
          path: "/edit_saving_account",
          element: (
            <ProtectedEditSavingAccountRoute>
              <EditSavingAccount />
            </ProtectedEditSavingAccountRoute>
          ),
        },
      ],
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
  ]);

  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
