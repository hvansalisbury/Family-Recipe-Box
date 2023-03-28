import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_RECIPE } from '../utils/queries';

import Auth from '../utils/auth';

const Recipe = () => {
  const recipeId = localStorage.getItem('recipeId');
  console.log(recipeId);
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId }
  });

console.log(data.recipe);

const ingredients = data?.recipe.ingredients || {};
const instructions = data?.recipe.instructions || {};

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div>
        <section>
        <h2>{data.recipe.title}</h2>
        <div>{data.recipe.description}</div>
          {ingredients.map((ingredient) => {
            return (
              <div className='ingredient-card'>
                <div>{ingredient.amount} {ingredient.unit} - {ingredient.item}</div>
              </div>
            )
          })}
          {instructions.map((instruction) => {
            return (
              <div className='instruction-card'>
                <div>{instructions.indexOf(instruction) + 1}. {instruction.direction}</div>
              </div>
            )
          })}
        </section>


      </div >
    </>
  );
};

export default Recipe;
