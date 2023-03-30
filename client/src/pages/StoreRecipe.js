import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { SAVE_RECIPE } from '../utils/mutations';

import '../assets/css/storerecipe.css'

import auth from '../utils/auth';

const StoreRecipe = (props) => {
  const [saveRecipeData, setSaveRecipeData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [saveRecipe, { error }] = useMutation(SAVE_RECIPE);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    if (inputType === 'title') {
      setTitle(inputValue);
    } else {
      setDescription(inputValue);
    };

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
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log(saveRecipeData);
    try {
      const { data } = await saveRecipe({
        variables: { input: saveRecipeData },
      });
      console.log(data);
      localStorage.setItem('recipeId', data.saveRecipe._id);
      navigate('/ingredients');
    } catch (err) {
      setErrorMessage('Unable to store recipe. Please try again.')
      console.error(err);
    }
    
    setSaveRecipeData({
      title: '',
      description: '',
    });
    setTitle('');
    setDescription('');
  };

  return (
    <>
      <section className='storerecipe-section'>
        <h2>Store your recipe</h2>
        <form className='storerecipe-form' onSubmit={handleFormSubmit}>
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
            <label for='title'>Title: </label>
            <input
              type='text'
              name='title'
              placeholder='Recipe Name'
              value={title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='storerecipe-formline'>
            <label for='description'>Description: </label>
            <textarea
              type='text'
              name='description'
              placeholder='Recipe Description'
              value={description}
              onChange={handleChange}
              rows='4'
            />
          </div>
          <div className='storerecipe-formline'>
            <div className='center-button'>
              <button
                type='submit'
                {...saveRecipeData.title && saveRecipeData.description ? { disabled: false } : { disabled: true }}
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
