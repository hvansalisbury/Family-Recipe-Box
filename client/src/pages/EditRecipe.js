import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_RECIPE } from '../utils/queries';
import { EDIT_RECIPE } from '../utils/mutations';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/css/editrecipe.css'

const EditRecipe = () => {
  const [saveRecipeData, setSaveRecipeData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [editRecipe, { error }] = useMutation(EDIT_RECIPE);


  const { recipeId } = useParams();
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });

  console.log(data)


  const [title, setTitle] = useState(data.recipe.title);
  const [description, setDescription] = useState(data.recipe.description);

  const ingredientData = data?.recipe.ingredients || {};
  const instructionData = data?.recipe.instructions || {};

  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');

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
    };

    try {
      const { data } = await editRecipe({
        variables: { _id: recipeId, input: saveRecipeData },
      });

      console.log(data);
      navigate('/recipes');
    } catch (err) {
      setErrorMessage('Unable to edit recipe. Please try again.')
      console.error(err);
    }

    setSaveRecipeData({
      title: '',
      description: ''
    });
    setTitle('');
    setDescription('');
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='editrecipe-section'>
        <form className='editrecipe-form'>
          <h2>Edit your recipe</h2>
          <div className='editrecipe-basic'>
            <div className='editrecipe-formline'>
              <label htmlFor='title'>Title: </label>
              <input
                type='text'
                name='title'
                id='title'
                value={title}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className='editrecipe-formline'>
              <label htmlFor='description'>Description: </label>
              <textarea
                type='text'
                name='description'
                placeholder='Recipe Description'
                value={description}
                onChange={handleChange}
                rows='2'
              />
            </div>
          </div>
          <div className='editingredients-card'>
            <h4>INGREDIENTS</h4>
            {ingredientData.map((ingredient) => {
              return (
                <div className='editrecipe-formline'>
                  <div className='amount-section'>
                    <label htmlFor='amount'>Amount: </label>
                    <input
                      type='number'
                      name='amount'
                      placeholder='amount of ingredient'
                      value={ingredient.amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className='unit-section'>
                    <label htmlFor='unit'>Unit of Measure: </label>
                    <input
                      type='text'
                      name='unit'
                      placeholder='cup, tbsp, tsp, etc.'
                      value={ingredient.unit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className='ingredient-section'>
                    <label htmlFor='item'>Ingredient: </label>
                    <input
                      type='text'
                      name='item'
                      placeholder='flour, sugar, etc.'
                      value={ingredient.item}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className='editinstructions-card'>
            <h4>INSTRUCTIONS</h4>
            
              {instructionData.map((instruction) => {
                return (
                  <div className='editrecipe-formline'>
                    <li>
                      <label htmlFor='title'>Direction: </label>
                      <textarea
                        rows='2'
                        type='text'
                        name='direction'
                        placeholder='instructions for this step'
                        value={instruction.direction}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </li>
                  </div>
                )
              })}
            
          </div>
        </form>
      </div>
    </>
  );
};

export default EditRecipe;
