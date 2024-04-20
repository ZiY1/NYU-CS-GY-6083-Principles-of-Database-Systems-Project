import { Link } from "react-router-dom";
import "./home.scss";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import CheckingAccount from "../../../components/checking_account/CheckingAccount";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home">
      <CheckingAccount/>
    </div>
  );
};

export default Home;