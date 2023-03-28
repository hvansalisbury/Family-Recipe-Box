import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/navbar.css'

import Auth from '../utils/auth';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header>
        <a className='heading' as={Link} to='/'>
          Family Recipe Box
        </a>
        <nav className=''>

          {Auth.loggedIn() ? (
            <>
              <a href="/storerecipe" className="navlink">
                Store a Recipe
              </a>
              <a href='/recipes' className="navlink">
                See Your Recipes
              </a>
              <a onClick={Auth.logout} className="navlink">
                Logout
              </a>
            </>
          ) : (
            <a href="/login" className="navlink">
              Login/Sign Up
            </a>
          )}
        </nav>
      </header>
    </>
  );
};

export default AppNavbar;
