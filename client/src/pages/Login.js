import React, { useState, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import validateEmail from '../utils/validateEmail';
import '../assets/css/login.css'

import Auth from '../utils/auth';

const Login = (props) => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [login, { error }] = useMutation(LOGIN_USER);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    if (inputType === 'email') {
      setEmail(inputValue);
    } else {
      setPassword(inputValue);
    };

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
      !validateEmail(email)
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
      const { data } = await login({
        variables: { ...userFormData },
      });

      console.log(data);
      Auth.login(data.login.token);
    } catch (e) {
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
        <form className='form' noValidate validated={validated} onSubmit={handleFormSubmit}>
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
            <label for="email">email: </label>
            <input
              placeholder='email'
              name="email"
              required
              type="email"
              value={email}
              className='email-input'
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-line'>
            <label for='password'>password: </label>
            <input
              placeholder='password'
              name='password'
              required
              type='password'
              value={password}
              className='password-input'
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-line'>
            <div className='center-button'>
              <button
                // disabled
                type='submit'
                {...userFormData.email && userFormData.password ? { disabled: false } : { disabled: true }}
              >
                login
              </button>
            </div>
          </div>
        </form>
        <div className='signup-link'>
          <a href='/signup'>
            signup
          </a>
        </div>
      </section>
    </>
  );
};

export default Login;
