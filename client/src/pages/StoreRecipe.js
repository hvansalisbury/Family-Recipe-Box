import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { SAVE_RECIPE } from '../utils/mutations';

import Auth from '../utils/auth';

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
        <form className='form' onSubmit={handleFormSubmit}>
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
          <div className='form-line'>
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
          <div className='form-line'>
            <label for='description'>Description: </label>
            <input
              type='text'
              name='description'
              placeholder='Recipe Description'
              value={description}
              onChange={handleChange}
            />
          </div>
          <div className='form-line'>
            <div className='center-btn'>
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