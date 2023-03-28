import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { SAVE_INSTRUCTION } from '../utils/mutations';

import Auth from '../utils/auth';

const SaveInstructions = (props) => {
  const [saveInstructionData, setSaveInstructionData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [saveInstruction, { error }] = useMutation(SAVE_INSTRUCTION);

  const [direction, setDirection] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    if (inputType === 'direction') {
      setDirection(inputValue);
    } 

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
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    const recipeid = localStorage.getItem('recipeId');
    saveInstructionData.recipeId = recipeid;
    const input = {input: saveInstructionData};
    console.log(input);
    try {
      const { data } = await saveInstruction({
        variables: { ...input },
      });
      console.log(data);
    } catch (err) {
      setErrorMessage('Unable to save ingredients. Please try again.')
      console.error(err);
    }
    
    setSaveInstructionData({
      direction: '',
    });
    setDirection('');
  };

  return (
    <>
      <section className='storerecipe-section'>
        <h2>Add Instructions</h2>
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
            <label for='title'>Direction: </label>
            <input
              type='text'
              name='direction'
              placeholder='instructions for this step'
              value={direction}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-line'>
            <div className='center-btn'>
              <button
                id='more-instructions-btn'
                type='submit'
                {...saveInstructionData.direction 
                  ? { disabled: false } 
                  : { disabled: true }}
              >
                Enter More Instructions
              </button>
              <button
                id='finalize-recipe-btn'
                type='submit'
                {...saveInstructionData.direction 
                  ? { disabled: false } 
                  : { disabled: true }}
                  onClick={() => navigate('/recipes')}
              >
                Finalize Recipe
              </button>

            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default SaveInstructions;
