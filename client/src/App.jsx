import Login from "./pages/user_pages/login/Login";
import Register from "./pages/user_pages/register/Register";
import Home from "./pages/user_pages/home/Home";
import OpenCheckingAccount from "./pages/user_pages/accounts/checking_account/open_checking_account/OpenCheckingAccount.jsx";
import EditCheckingAccount from "./pages/user_pages/accounts/checking_account/edit_checking_account/EditCheckingAccount.jsx";
import OpenSavingAccount from "./pages/user_pages/accounts/saving_account/open_saving_account/OpenSavingAccount.jsx";
import EditSavingAccount from "./pages/user_pages/accounts/saving_account/edit_saving_account/EditSavingAccount.jsx";
import OpenLoanAccount from "./pages/user_pages/accounts/loan_account/open_loan_account/OpenLoanAccount.jsx";
import EditLoanAccount from "./pages/user_pages/accounts/loan_account/edit_loan_account/EditLoanAccount.jsx";
import Profile from "./pages/user_pages/profile/Profile.jsx";

import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { AccountContext } from "./context/accountContext.jsx";
import NavBar from "./components/nav_bar/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const { currentUser } = useContext(AuthContext);

  const { hasCheckingAccount, hasSavingAccount, hasLoanAccount } =
    useContext(AccountContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
          <NavBar />
          <Outlet />
        </div>
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

  const ProtectedOpenLoanAccountRoute = ({ children }) => {
    if (hasLoanAccount) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const ProtectedEditLoanAccountRoute = ({ children }) => {
    if (!hasLoanAccount) {
      return <Navigate to="/" />;
    }

    return children;
  };

  // Define route for profile page
  const ProtectedProfileRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
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
        {
          path: "/open_loan_account",
          element: (
            <ProtectedOpenLoanAccountRoute>
              <OpenLoanAccount />
            </ProtectedOpenLoanAccountRoute>
          ),
        },
        {
          path: "/edit_loan_account",
          element: (
            <ProtectedEditLoanAccountRoute>
              <EditLoanAccount />
            </ProtectedEditLoanAccountRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedProfileRoute>
              <Profile />
            </ProtectedProfileRoute>
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
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
