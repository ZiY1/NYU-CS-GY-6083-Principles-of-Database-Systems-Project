import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; // Make sure to import axios
import { AuthContext } from "../../context/authContext";
import "./navbar.scss";

const NavBar = () => {
    const { currentUser, logout } = useContext(AuthContext); // Adjust based on your context structure

    const navigate = useNavigate();

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            await logout();
            navigate('/login');
        } catch (error) {
            // Check if the backend returned a specific error message and display it
            // let errorMessage = "An unexpected error occurred. Please try again.";
            // if (error.response) {
            //     errorMessage = error.response.data || errorMessage;
            // }
        }
    };

    return (
        <div className='navbar'>
            <div className='left'>
                <Link to="/">
                    <span>SAFE</span>
                </Link>
            </div>
            <div className='right'>
                {currentUser && <div className="user"><span>{currentUser.user_name}</span></div>}
                <button type="button" onClick={handleLogout}>Logout</button> {/* Changed type to "button" */}
            </div>
        </div>
    );
};

export default NavBar;
