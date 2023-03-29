import React from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { useNavigate } from 'react-router-dom';
import '../assets/css/recipes.css'

import Auth from '../utils/auth';

const Recipes = () => {
  const { loading, data } = useQuery(QUERY_ME);

  const userData = data?.me || {};

  console.log(userData);

  const navigate = useNavigate();

  const handleRecipeClick = async (e) => {
    const { target } = e;
    if (target.classList.contains('recipe-card-basic') || target.getElementByTagName('h4') || target.getElementByTagName('p')) {
      const recipeId = target.id; 
      console.log(recipeId);
      navigate(`/recipes/${recipeId}`);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    return;
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='recipes-container'>
        <h2>{userData.username}'s recipes</h2>
        <section className='recipes-section'>
          {userData.recipes?.map((recipe) => {
            return (
              <div className='recipe-card-basic' id={recipe._id} onClick={handleRecipeClick}>
                <h4>{recipe.title}</h4>
                <p>{recipe.description}</p>
                <div className='button-box'>
                <button onClick={() => navigate(`/recipes/${recipe._id}`)}>View Recipe</button>
                <button onClick={() => navigate(`/editrecipe/${recipe._id}`)}>Edit Recipe</button>
                <button onClick={handleDeleteRecipe(recipe._id)}>Delete Recipe</button>
                </div>
              </div>
            )
          })}
        </section>
      </div >
    </>
  );
};

export default Recipes;
