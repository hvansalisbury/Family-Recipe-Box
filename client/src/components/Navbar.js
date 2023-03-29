import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/navbar.css'

import Auth from '../utils/auth';

const AppNavbar = () => {
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