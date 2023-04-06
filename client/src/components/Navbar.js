// navbar component, renders the navbar at the top of the page, with links to the login page, the store recipe page, and the recipes page
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/navbar.css'
// import the auth middleware function
import Auth from '../utils/auth';

const AppNavbar = () => {
  // conditional rendering of navbar elements based on whether the user is logged in or not
  return (
    <>
      <header>
        <Link className='heading' to='/'>
          Family Recipe Box
        </Link>
        <nav className=''>

          {Auth.loggedIn() ? (
            <>
              <Link to="/storerecipe" className="navlink">
                Store a Recipe
              </Link>
              <Link to='/recipes' className="navlink">
                See Your Recipes
              </Link>
              <a onClick={Auth.logout} className="navlink">
                Logout
              </a>
            </>
          ) : (
            <Link to="/login" className="navlink">
              Login/Sign Up
            </Link>
          )}
        </nav>
      </header>
    </>
  );
};

export default AppNavbar;