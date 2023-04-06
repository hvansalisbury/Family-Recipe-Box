// ingredients page, renders the form to add ingredients to a recipe, and the list of ingredients already added to the recipe, with a button to save the ingredients to the recipe
import React, { useState, useEffect } from 'react';
// import the useNavigate hook from react-router-dom
import { useNavigate } from 'react-router-dom';
// import the auth middleware function
import Auth from '../utils/auth';
// import the useQuery and useMutation hooks from apollo client
import { useQuery, useMutation } from '@apollo/client';
// import the SAVE_INGREDIENT mutation and the QUERY_RECIPE query
import { SAVE_INGREDIENT } from '../utils/mutations';
import { QUERY_RECIPE } from '../utils/queries';
// import the css file
import '../assets/css/storerecipe.css'
// import the SaveIngredients component
const SaveIngredients = (props) => {
  // get the recipeId from local storage
  const recipeId = localStorage.getItem('recipeId');
  // use the useQuery hook to execute the QUERY_RECIPE query, passing in the recipeId as a variable
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });
  // useState hook to set ingredient data, and show alow alert
  const [saveIngredientData, setSaveIngredientData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  // use the useMutation hook to execute the SAVE_INGREDIENT mutation
  const [saveIngredient, { error }] = useMutation(SAVE_INGREDIENT);
  // useState hook to set error message
  const [errorMessage, setErrorMessage] = useState('');
  // handle input change and save to state
  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    setSaveIngredientData({ ...saveIngredientData, [inputType]: inputValue });
  };
  // handle input blur and save to state
  const handleBlur = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    inputValue === ''
      ? setErrorMessage(`${inputType} is required!`)
      : setErrorMessage('')
  };
  // useEffect hook to show error message
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);
  // use the useNavigate hook
  const navigate = useNavigate();
  // handle form submit
  const handleFormSubmit = async (event, withNavigate = false) => {
    event.preventDefault();
    // check if form is valid
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    // save the recipeId to the saveIngredientData object
    const recipeid = localStorage.getItem('recipeId');
    // save the saveIngredientData object to the input object
    saveIngredientData.recipeId = recipeid;
    // save the input object to the input variable
    const input = { input: saveIngredientData };
    // execute the saveIngredient mutation, passing in the input variable
    try {
      const { data } = await saveIngredient({
        variables: { ...input },
      });
      // if the mutation is successful, navigate to the instructions page
      if (withNavigate && data) {
        navigate('/instructions');
      } else {
        // clear the form
        setSaveIngredientData({
          unit: '',
          amount: '',
          item: '',
        });
      }
      // if the mutation is not successful, show an error message
    } catch (err) {
      setErrorMessage('Unable to save ingredients. Please try again.')
      console.error(err);
    }
  };
  // handle recipe click link
  const handleRecipeClick = (event) => {
    event.preventDefault();
    localStorage.removeItem('recipeId');
    navigate(`/recipes/${recipeId}`);
  };
  // if not logged in, navigate to the home page
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate("/");
    }
  }, [navigate]);
  // if loading, show loading message
  if (loading) {
    return <div>Loading...</div>;
  }
  // ingredients page
  return (
    <>
      <section className='storerecipe-section'>
        <div className='recipe-details'>
          {/* show information from user query */}
          <h2>{data.recipe?.title}</h2>
          <p>{data?.recipe?.description}</p>
          {(data.recipe.ingredients.length > 0)
            ? <h4>Ingredients</h4>
            : ''}
            {/* ingredients map function to render each ingredient as a separate element */}
          {data.recipe.ingredients.map((ingredient, index) => {
            return (
              <div key={index}>{ingredient.amount} {ingredient.unit} {ingredient.item}</div>
            )
          })}
        </div>
        <h2>Add Ingredient</h2>
        {/* add ingredient form, with error message, event handler functions, etc. */}
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
            <label htmlFor='title'>Amount: </label>
            <input
              type='number'
              name='amount'
              placeholder='amount of ingredient'
              defaultValue={saveIngredientData.amount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='storerecipe-formline'>
            <label htmlFor='description'>Unit of Measure: </label>
            <input
              type='text'
              name='unit'
              placeholder='cup, tbsp, tsp, etc.'
              defaultValue={saveIngredientData.unit}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='storerecipe-formline'>
            <label htmlFor='description'>Ingredient: </label>
            <input
              type='text'
              name='item'
              placeholder='flour, sugar, etc.'
              defaultValue={saveIngredientData.item}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='storerecipe-formline'>
            <div className='center-button'>
              <button
                id='more-ingredients-btn'
                type='submit'
                // buttons are disabled until all fields are filled out
                {...saveIngredientData.amount && saveIngredientData.unit && saveIngredientData.item
                  ? { disabled: false }
                  : { disabled: true }}
                onClick={handleFormSubmit}
              >
                Enter More Ingredients
              </button>
              <button
                id='enter-directions-btn'
                {...saveIngredientData.amount && saveIngredientData.unit && saveIngredientData.item
                  ? { disabled: false }
                  : { disabled: true }}
                onClick={(event) => handleFormSubmit(event, true)}
              >
                Enter Directions
              </button>
            </div>
          </div>
        </form>
        <div>
          <button className='back-button' onClick={handleRecipeClick}>
            Back to Recipe
          </button>
        </div>
      </section>
    </>
  );
};

export default SaveIngredients;
