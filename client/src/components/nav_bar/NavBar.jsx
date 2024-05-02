import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

import styled, { keyframes } from "styled-components";

const jump = keyframes`
  from{
    transform: translateY(0)
  }
  to{
    transform: translateY(-3px)
  }
`;

const Button = styled.button`
  padding: 8px 9px;
  color: rgb(253, 249, 243);
  font-weight: 600;
  text-transform: uppercase;
  background: #f68a94; /* Change the background color to blue */
  border: none;
  border-radius: 3px;
  outline: 0;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-out;
  text-align: center;

  &:hover {
    background: #e81226; /* Change the hover background color to a darker shade of blue */
    animation: ${jump} 0.2s ease-out forwards;
  }
`;
const CenterDiv = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  background-color: #fff;
`;

const Wrapper2 = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 100;

    .user {
        background-color: #fff; /* Set the background color for div.user */
        padding: 0.5rem 1rem; /* Add some padding */
        border-radius: 4px; /* Add rounded corners */
    
        span {
          color: #333; /* Set the text color for the span */
          font-weight: 500; /* Set the font weight */
        }

  `;

const StyledSpan = styled.span`
  font-family: 'Roboto', sans-serif; /* Change the font family */
  font-size: 2rem; /* Increase the font size */
  font-weight: 700; /* Set the font weight to semi-bold */
  color: #333; /* Change the text color */
  text-transform: uppercase; /* Make the text uppercase */
  letter-spacing: 1px; /* Add some letter spacing */
  

`;

const NavBar = () => {
    const { currentUser, logout } = useContext(AuthContext);

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
      <div >
       
        <Wrapper2 className='navbar' >
          
          
          <div style={{backgroundColor: '#fff'}}><Link to="/">
          <StyledSpan style={{backgroundColor: '#fff'}}>S A F E B a n k</StyledSpan>
        </Link>
          </div>
          
  
          {currentUser && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              <div className="user">Hello: {currentUser.user_name}</div>
              <Button type="button" onClick={handleLogout}>Logout</Button>
            </div>
          )}
        </Wrapper2>
        <br />
      </div>
    );
};

export default NavBar;
