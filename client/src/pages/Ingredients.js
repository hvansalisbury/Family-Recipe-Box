import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import { SAVE_INGREDIENT } from '../utils/mutations';
import { QUERY_RECIPE } from '../utils/queries';

import '../assets/css/storerecipe.css'

const SaveIngredients = (props) => {
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: localStorage.getItem('recipeId') },
  });

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

  const handleFormSubmit = async (event, withNavigate = false) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    const recipeid = localStorage.getItem('recipeId');
    saveIngredientData.recipeId = recipeid;
    const input = { input: saveIngredientData };

    try {
      const { data } = await saveIngredient({
        variables: { ...input },
      });
      console.log(data);
      if (withNavigate && data) {
        navigate('/instructions');
      }
    } catch (err) {
      setErrorMessage('Unable to save ingredients. Please try again.')
      console.error(err);
    }

    if (!withNavigate) {
      setSaveIngredientData({
        unit: '',
        amount: '',
        item: '',
      });
      setAmount('');
      setUnit('');
      setItem('');
    };
  };
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
          {data.recipe.ingredients.map((ingredient) => {
            return (
              <div>{ingredient.amount} {ingredient.unit} {ingredient.item}</div>
            )
          })}
        </div>
        <h2>Add Ingredient</h2>
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
          <div className='storerecipe-formline'>
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
          <div className='storerecipe-formline'>
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
          <div className='storerecipe-formline'>
            <div className='center-btn'>
              <button
                id='more-ingredients-btn'
                type='submit'
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
      </section>
    </>
  );
};

export default SaveIngredients;
