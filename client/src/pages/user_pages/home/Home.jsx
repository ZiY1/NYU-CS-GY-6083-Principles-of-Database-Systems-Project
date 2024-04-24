import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import CheckingAccount from "../../../components/checking_account/CheckingAccount";
import SavingAccount from "../../../components/saving_account/SavingAccount";
import LoanAccount from "../../../components/loan_account/LoanAccount";


const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home">

      <CheckingAccount />
      <br></br>
      <SavingAccount />
      <br></br>
      <LoanAccount />


    </div>
  );
};

export default Home;