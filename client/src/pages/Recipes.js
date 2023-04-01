import React, { useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_RECIPE } from '../utils/mutations';
import { useNavigate } from 'react-router-dom';

import '../assets/css/recipes.css'

import Auth from '../utils/auth';

const Recipes = () => {
  const { loading, data, refetch } = useQuery(QUERY_ME);
  const [deleteRecipe, { error }] = useMutation(DELETE_RECIPE);
  const [showRecipe, setShowRecipe] = useState({});

  const handleDeleteRecipe = async (recipeId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await deleteRecipe({
        variables: { recipeId },
      });
      setShowRecipe(data.deleteRecipe);
      console.log(showRecipe);
      refetch();

    } catch (err) {
      console.error(err);
    }
  };

  const userData = data?.me || {};

  const navigate = useNavigate();

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
              <div className='recipe-card-basic' key={recipe._id} id={recipe._id}>
                <h4>{recipe.title}</h4>
                <p>{recipe.description}</p>
                <div className='button-box'>
                  <button onClick={() => navigate(`/recipes/${recipe._id}`)}>View Recipe</button>
                  <button onClick={() => navigate(`/editrecipe/${recipe._id}`)}>Edit Recipe</button>
                  <button onClick={(recipeId) => handleDeleteRecipe(`${recipe._id}`)}>Delete Recipe</button>
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
