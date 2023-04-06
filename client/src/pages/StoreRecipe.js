// Purpose: To store the recipe in the database
import React, { useState, useEffect } from 'react';
// useNavate hook from react-router-dom
import { useNavigate } from 'react-router-dom';
// import useMutation from apollo client
import { useMutation } from '@apollo/client';
// import the SAVE_RECIPE mutation
import { SAVE_RECIPE } from '../utils/mutations';
// import the css file
import '../assets/css/storerecipe.css'
// import Auth middleware
import Auth from '../utils/auth';
// store recipe page
const StoreRecipe = (props) => {
  // useState hook to set the saveRecipeData state, show alert state
  const [saveRecipeData, setSaveRecipeData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  // useMutation hook to save the recipe
  const [saveRecipe, { error }] = useMutation(SAVE_RECIPE);
  // useState hook to set the error message state
  const [errorMessage, setErrorMessage] = useState('');
// handle input change function to set the saveRecipeData state
  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    setSaveRecipeData({ ...saveRecipeData, [inputType]: inputValue });
  };
// handle input blur function to set the error message state
  const handleBlur = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    inputValue === ''
      ? setErrorMessage(`${inputType} is required!`)
      : setErrorMessage('')
  };
// useEffect hook to set the show alert state
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);
// navigate hook from react-router-dom
  const navigate = useNavigate();
// handle form submit function to save the recipe
  const handleFormSubmit = async (event, withNavigate = false) => {
    event.preventDefault();
    // check if form is valid
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    // use saveRecipe mutation to save the recipe, pass in the saveRecipeData state
    try {
      const { data } = await saveRecipe({
        variables: { input: saveRecipeData },
      });
      // set the recipeId in localStorage
      localStorage.setItem('recipeId', data.saveRecipe._id);
      // if withNavigate is true, navigate to the ingredients page
      if (withNavigate && data) {
        navigate('/ingredients');
      }
    } catch (err) {
      // if there is an error, set the error message state
      setErrorMessage('Unable to store recipe. Please try again.')
      console.error(err);
    }
    // if withNavigate is false, clear the saveRecipeData state
    if (!withNavigate) {
      setSaveRecipeData({
        title: '',
        description: '',
      });
    }
  };
// useEffect hook to check if the user is logged in
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate("/");
    }
  }, [navigate]);


  return (
    <>
      <section className='storerecipe-section'>
        <h2>Store your recipe</h2>
        {/* form to submit title and description */}
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
