// Purpose: To create a login page for the user to login to the application
import React, { useState, useEffect } from 'react';
// use useMutation hook from apollo client
import { useMutation } from '@apollo/client';
// import LOGIN_USER mutation
import { LOGIN_USER } from '../utils/mutations';
// import validateEmail function
import validateEmail from '../utils/validateEmail';
// import css file
import '../assets/css/login.css'
// import auth middleware function
import Auth from '../utils/auth';
// import Link component from react-router-dom
import { Link } from 'react-router-dom';
// login page component
const Login = (props) => {
  // useState hook to set user form data
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  // useState hook to set validation
  const [validated] = useState(false);
  // useState hook to set show alert
  const [showAlert, setShowAlert] = useState(false);
  // use useMutation hook to execute LOGIN_USER mutation
  const [login, { error }] = useMutation(LOGIN_USER);
  // useState hook to set error message
  const [errorMessage, setErrorMessage] = useState('');
  // handle input change and save to state
  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    setUserFormData({ ...userFormData, [inputType]: inputValue });
  };
  // handle input blur and save to state
  const handleBlur = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;
    inputValue === ''
      ? setErrorMessage(`${inputType} is required!`)
      : setErrorMessage('')
    // ternary operator to set error message if email is invalid
    if (inputType === 'email') {
      !validateEmail(userFormData.email)
        ? setErrorMessage(`${inputType} is invalid!`)
        : setErrorMessage('')
    };
  };
  // useEffect hook to show error message
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);
  // handle form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // check if form is valid
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    // use login mutation to execute LOGIN_USER mutation
    try {
      const { data } = await login({
        variables: { ...userFormData },
      });
      // save token to localStorage
      Auth.login(data.login.token);
    } catch (e) {
      // set error message
      setErrorMessage('Your credentials are incorrect! Please try again.')
      console.error(e);
    }
    // clear form values
    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <section className='login-section'>
        <h2>Login</h2>
        {/* login form */}
        <form className='form' onSubmit={handleFormSubmit}>
          {errorMessage && (
            <div
              id='error-message'
              className="error-message"
              role='alert'
              dismissible
              onClose={() => setShowAlert(false)}
              show={showAlert}
              variant='danger'
            >
              {errorMessage}
            </div>
          )}
          <div className="form-line">
            <label htmlFor="email">email: </label>
            <input
              placeholder='email'
              name="email"
              required
              type="email"
              value={userFormData.email}
              className='email-input'
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-line'>
            <label htmlFor='password'>password: </label>
            <input
              placeholder='password'
              name='password'
              required
              type='password'
              value={userFormData.password}
              className='password-input'
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-line'>
            <div className='center-button'>
              <button
                type='submit'
                {...userFormData.email && userFormData.password ? { disabled: false } : { disabled: true }}
              >
                login
              </button>
            </div>
          </div>
        </form>
        <div className='signup-link'>
          <Link to='/signup'>
            signup
          </Link>
        </div>
      </section>
    </>
  );
};

export default Login;
