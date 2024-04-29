import { Link } from "react-router-dom";
import "./home.scss";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import CheckingAccount from "../../../components/checking_account/CheckingAccount";
import SavingAccount from "../../../components/saving_account/SavingAccount";
import LoanAccount from "../../../components/loan_account/LoanAccount";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home">
      {/* Add Link button */}
      <Link to="/profile" className="button">
        My Profile
      </Link>

      <CheckingAccount />
      <SavingAccount />
      <LoanAccount />
    </div>
  );
};

export default Home;
