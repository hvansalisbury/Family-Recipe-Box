import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
import { useQuery, useMutation } from '@apollo/client';
import { SAVE_INSTRUCTION } from '../utils/mutations';
import { QUERY_RECIPE } from '../utils/queries';

import '../assets/css/storerecipe.css'

const SaveInstructions = (props) => {
  const recipeId = localStorage.getItem('recipeId');
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });

  const [saveInstructionData, setSaveInstructionData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [saveInstruction, { error }] = useMutation(SAVE_INSTRUCTION);

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    setSaveInstructionData({ ...saveInstructionData, [inputType]: inputValue });
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
    const recipeid = localStorage.getItem('recipeId');
    saveInstructionData.recipeId = recipeid;
    const input = { input: saveInstructionData };
    console.log(saveInstructionData);
    console.log(input);
    try {
      console.log(input);
      const { data } = await saveInstruction({
        variables: { ...input },
      });
      console.log(data);
      if (withNavigate && data) {
        localStorage.removeItem('recipeId');
        navigate('/recipes');
      } else {
        setSaveInstructionData({
          direction: '',
        });
      }
    } catch (err) {
      setErrorMessage('Unable to save ingredients. Please try again.')
      console.error(err);
    }
  };

  const handleRecipeClick = (event) => {
    event.preventDefault();
    localStorage.removeItem('recipeId');
    navigate(`/recipes/${recipeId}`);
  };


  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className='storerecipe-section'>
        <div className='recipe-details'>
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
