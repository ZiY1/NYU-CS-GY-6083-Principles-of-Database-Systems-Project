import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import CheckingAccount from "../../../components/checking_account/CheckingAccount";
import SavingAccount from "../../../components/saving_account/SavingAccount";
import LoanAccount from "../../../components/loan_account/LoanAccount";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '20px', padding: '40px 0 0 0', minHeight: '100vh', overflow: 'auto' }}>
    <CheckingAccount />
    <SavingAccount />
    <LoanAccount />
  </div>
  );
};

export default Home;
