// Purpose: To allow the user to add instructions to a recipe
import React, { useState, useEffect } from 'react';
// import useNavigate hook from react-router-dom
import { useNavigate } from 'react-router-dom';
// import auth middleware function
import Auth from '../utils/auth';
// import useQuery and useMutation hooks from apollo client
import { useQuery, useMutation } from '@apollo/client';
// import SAVE_INSTRUCTION mutation and QUERY_RECIPE query
import { SAVE_INSTRUCTION } from '../utils/mutations';
import { QUERY_RECIPE } from '../utils/queries';
// import css file
import '../assets/css/storerecipe.css'
// import SaveInstructions component
const SaveInstructions = (props) => {
  // get recipeId from local storage
  const recipeId = localStorage.getItem('recipeId');
  // use useQuery hook to execute QUERY_RECIPE query, passing in recipeId as a variable
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });
  // useState hook to set instruction data and show alert
  const [saveInstructionData, setSaveInstructionData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  // use useMutation hook to execute SAVE_INSTRUCTION mutation
  const [saveInstruction, { error }] = useMutation(SAVE_INSTRUCTION);
  // useState hook to set error message
  const [errorMessage, setErrorMessage] = useState('');
  // handle input change and save to state
  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;
    
    setSaveInstructionData({ ...saveInstructionData, [inputType]: inputValue });
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
  // use useNavigate hook
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
    // save recipeId to state
    const recipeid = localStorage.getItem('recipeId');
    // save instruction data to state
    saveInstructionData.recipeId = recipeid;
    // save instruction data to state
    const input = { input: saveInstructionData };
    console.log(saveInstructionData);
    console.log(input);
    // execute SAVE_INSTRUCTION mutation
    try {
      console.log(input);
      const { data } = await saveInstruction({
        variables: { ...input },
      });
      console.log(data);
      // if successful, clear form and navigate to /recipes
      if (withNavigate && data) {
        localStorage.removeItem('recipeId');
        navigate('/recipes');
      } else {
        // clear form
        setSaveInstructionData({
          direction: '',
        });
      }
      // if error, set error message
    } catch (err) {
      setErrorMessage('Unable to save ingredients. Please try again.')
      console.error(err);
    }
  };
  // handle recipe click
  const handleRecipeClick = (event) => {
    event.preventDefault();
    localStorage.removeItem('recipeId');
    navigate(`/recipes/${recipeId}`);
  };
  // useEffect hook to check if user is logged in
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate("/");
    }
  }, [navigate]);
  // if loading, return loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className='storerecipe-section'>
        <div className='recipe-details'>
          {/* populate recipe information */}
          <h2>{data.recipe?.title}</h2>
          <p>{data?.recipe?.description}</p>
          {(data.recipe.ingredients.length > 0)
            ? <h4>Ingredients</h4>
            : ''}
          {data.recipe.ingredients.map((ingredient, index) => {
            return (
              <div key={index}>{ingredient.amount} {ingredient.unit} {ingredient.item}</div>
            )
          })}
          {(data.recipe.instructions.length > 0)
            ? <h4>Instructions</h4>
            : ''}
          {data.recipe.instructions.map((instruction, index) => {
            return (
              <div key={index}>{instruction.direction}</div>
            )
          })}
        </div>
        <h2>Add Instructions</h2>
        {/* form to save instructions */}
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
            <label htmlFor='direction'>Direction: </label>
            <textarea
              rows='4'
              type='text'
              name='direction'
              placeholder='instructions for this step'
              value={saveInstructionData.direction}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='storerecipe-formline'>
            <div className='center-button'>
              <button
                id='more-instructions-btn'
                type='submit'
                {...saveInstructionData.direction
                  ? { disabled: false }
                  : { disabled: true }}
                onClick={handleFormSubmit}
              >
                Enter More Instructions
              </button>
              <button
                id='finalize-recipe-btn'
                type='submit'
                {...saveInstructionData.direction
                  ? { disabled: false }
                  : { disabled: true }}
                onClick={(event) => handleFormSubmit(event, true)}
              >
                Finalize Recipe
              </button>

            </div>
          </div>
        </form>
        <div>
          <button className='back-button' onClick={handleRecipeClick}>
            back to recipe
          </button>
        </div>
      </section>
    </>
  );
};

export default SaveInstructions;
