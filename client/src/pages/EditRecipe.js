import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_RECIPE } from '../utils/queries';
import { useParams } from 'react-router-dom';
import '../assets/css/editrecipe.css'

const EditRecipe = () => {
  const { recipeId } = useParams();
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });

  console.log(data)

  const ingredientData = data?.recipe.ingredients || {};
  const instructionData = data?.recipe.instructions || {};

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='editrecipe-section'>
        <form className='editrecipe-form'>
            <div className='card-heading'>
              <h2>{data.recipe.title}</h2>
              <p>{data.recipe.description}</p>
            </div>
            <div className='ingredients-card'>
              <h4>INGREDIENTS</h4>
              {ingredientData.map((ingredient) => {
                return (
                  <div>
                    {ingredient.amount} {ingredient.unit} - {ingredient.item}
                  </div>
                )
              })}
            </div>
          <div className='instructions-card'>
            <h4>INSTRUCTIONS</h4>
            <ol>
            {instructionData.map((instruction) => {
              return (
                <li>{instruction.direction}</li>
              )
            })}
            </ol>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditRecipe;