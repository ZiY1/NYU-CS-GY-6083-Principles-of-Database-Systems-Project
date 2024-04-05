import { Link } from "react-router-dom";
import "./home.scss";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home">
    </div>
  );
};

export default Home;