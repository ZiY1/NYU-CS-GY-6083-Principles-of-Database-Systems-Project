import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import CheckingAccount from "../../../components/checking_account/CheckingAccount";
import SavingAccount from "../../../components/saving_account/SavingAccount";
import LoanAccount from "../../../components/loan_account/LoanAccount";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home" style={{ gap: "0px", margin: "0px", padding: "0px" }}>
      <br></br>
      <br></br>
      <CheckingAccount />
      <div></div>

      <SavingAccount />
      <div></div>
      <LoanAccount />
      <br></br>
      <br></br>
    </div>
  );
};

export default Home;
