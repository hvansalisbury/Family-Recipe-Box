import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { SAVE_RECIPE } from '../utils/mutations';

import '../assets/css/storerecipe.css'

import Auth from '../utils/auth';

const StoreRecipe = (props) => {
  const [saveRecipeData, setSaveRecipeData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [saveRecipe, { error }] = useMutation(SAVE_RECIPE);

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    setSaveRecipeData({ ...saveRecipeData, [inputType]: inputValue });
  };

  const handleBlur = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    inputValue === ''
      ? setErrorMessage(`${inputType} is required!`)
      : setErrorMessage('')
  };

  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  const navigate = useNavigate();

  const handleFormSubmit = async (event, withNavigate = false) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      const { data } = await saveRecipe({
        variables: { input: saveRecipeData },
      });
      localStorage.setItem('recipeId', data.saveRecipe._id);
      if (withNavigate && data) {
        navigate('/ingredients');
      }
    } catch (err) {
      setErrorMessage('Unable to store recipe. Please try again.')
      console.error(err);
    }

    if (!withNavigate) {
      setSaveRecipeData({
        title: '',
        description: '',
      });
    }
  };

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate("/");
    }
  }, [navigate]);


  return (
    <>
      <section className='storerecipe-section'>
        <h2>Store your recipe</h2>
        <form className='storerecipe-form'>
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
          <div className='storerecipe-formline'>
            <label htmlFor='title'>Title: </label>
            <input
              type='text'
              name='title'
              placeholder='Recipe Name'
              defaultValue={saveRecipeData.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='storerecipe-formline'>
            <label htmlFor='description'>Description: </label>
            <textarea
              type='text'
              name='description'
              placeholder='Recipe Description'
              defaultValue={saveRecipeData.description}
              onChange={handleChange}
              rows='4'
            />
          </div>
          <div className='storerecipe-formline'>
            <div className='center-button'>
              <button
                {...saveRecipeData.title && saveRecipeData.description
                  ? { disabled: false }
                  : { disabled: true }}
                onClick={(event) => handleFormSubmit(event, true)}
              >
                Enter Ingredients
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default StoreRecipe;
