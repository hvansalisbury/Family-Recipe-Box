import React, { useState, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import validateEmail from '../utils/validateEmail';
import '../assets/css/login.css'

import Auth from '../utils/auth';

const Signup = (props) => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [addUser, { error }] = useMutation(ADD_USER);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    if (inputType === 'email') {
      setEmail(inputValue);
    } else if (inputType === 'username') {
      setUsername(inputValue);
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
      const { data } = await addUser({
        variables: { ...userFormData },
      });
      console.log(data)
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
            <label for="username">username: </label>
            <input
              placeholder='username'
              name="username"
              required
              type="text"
              value={username}
              className='username-input'
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
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
            <div className='center-btn'>
              <button
                type='submit'
                {...userFormData.email && userFormData.password ? { disabled: false } : { disabled: true }}
              >
                signup
              </button>
            </div>
          </div>
        </form>
        <div>
          <a className='signup-link' href='/login'>
            login
          </a>
        </div>
      </section>
    </>
  );
};

export default Signup;
