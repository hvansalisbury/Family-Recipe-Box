import React, { useState, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import validateEmail from '../utils/validateEmail';
import '../assets/css/login.css'

import Auth from '../utils/auth';
import { Link } from 'react-router-dom';

const Signup = (props) => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [addUser, { error }] = useMutation(ADD_USER);

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    setUserFormData({ ...userFormData, [inputType]: inputValue });
  };

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

  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log(userFormData);
    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });
      Auth.login(data.addUser.token);
    } catch (err) {
      setErrorMessage('Unable to sign up. Please try again.')
      console.error(err);
    }

    // clear form values
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <section className='login-section'>
        <h2>Signup</h2>
        <form className='form' noValidate validated={validated} onSubmit={handleFormSubmit}>
          {errorMessage && (
            <div
              id='error-message'
              className="error-message"
              role='alert'
              onClose={() => setShowAlert(false)}
              show={showAlert}
              variant='danger'
            >
              {errorMessage}
            </div>
          )}
          <div className="form-line">
            <label htmlFor="username">username: </label>
            <input
              placeholder='username'
              name="username"
              required
              type="text"
              value={userFormData.username}
              className='username-input'
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
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
                signup
              </button>
            </div>
          </div>
        </form>
        <div className='login-link'>
          <Link to='/login'>
            login
          </Link>
        </div>
      </section>
    </>
  );
};

export default Signup;
