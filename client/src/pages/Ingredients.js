import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { SAVE_INGREDIENT } from '../utils/mutations';

import Auth from '../utils/auth';

const SaveIngredients = (props) => {
  const [saveIngredientData, setSaveIngredientData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [saveIngredient, { error }] = useMutation(SAVE_INGREDIENT);

  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    if (inputType === 'unit') {
      setUnit(inputValue);
    } else if (inputType === 'amount') {
      setAmount(inputValue);
    } else {
      setItem(inputValue);
    };

    setSaveIngredientData({ ...saveIngredientData, [inputType]: inputValue });
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
    saveIngredientData.recipeId = recipeid;
    const input = {input: saveIngredientData};
    console.log(input);
    try {
      const { data } = await saveIngredient({
        variables: { input },
      });
      console.log(data);
    } catch (err) {
      setErrorMessage('Unable to save ingredients. Please try again.')
      console.error(err);
    }
    
    setSaveIngredientData({
      unit: '',
      amount: '',
      item: '',
    });
    setAmount('');
    setUnit('');
    setItem('');
  };

  return (
    <>
      <section className='storerecipe-section'>
        <h2>Add Ingredient</h2>
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
            <label for='title'>Amount: </label>
            <input
              type='number'
              name='amount'
              placeholder='amount of ingredient'
              value={amount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-line'>
            <label for='description'>Unit of Measure: </label>
            <input
              type='text'
              name='unit'
              placeholder='cup, tbsp, tsp, etc.'
              value={unit}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-line'>
            <label for='description'>Ingredient: </label>
            <input
              type='text'
              name='item'
              placeholder='flour, sugar, etc.'
              value={item}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='form-line'>
            <div className='center-btn'>
              <button
                type='submit'
                {...saveIngredientData.amount && saveIngredientData.unit && saveIngredientData.item 
                  ? { disabled: false } 
                  : { disabled: true }}
              >
                Enter More Ingredients
              </button>
              <button
                type='submit'
                {...saveIngredientData.amount && saveIngredientData.unit && saveIngredientData.item 
                  ? { disabled: false } 
                  : { disabled: true }}
                  onClick={() => navigate('/save-instructions')}
              >
                Enter Directions
              </button>

            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default SaveIngredients;
