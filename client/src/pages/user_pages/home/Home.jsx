import { Link } from "react-router-dom";
import "./home.scss";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import CheckingAccount from "../../../components/checking_account/CheckingAccount";
import SavingAccount from "../../../components/saving_account/SavingAccount";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home">
      <CheckingAccount/>
      <SavingAccount/>
    </div>
  );
};

export default Home;