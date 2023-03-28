import React from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { useNavigate } from 'react-router-dom';

import Auth from '../utils/auth';

const Recipes = () => {
  const { loading, data } = useQuery(QUERY_ME);

  const userData = data?.me || {};

  console.log(userData);

  const navigate = useNavigate();

  const handleRecipeClick = async (e) => {
    const { target } = e;
    if (target.classList.contains('recipe-card')) {
      const recipeId = target.id; 
      console.log(recipeId);
      localStorage.setItem('recipeId', recipeId);
      navigate(`/recipe`);
    }
  
  };


  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div>
        <h2>{userData.username}'s recipes</h2>
        <section>
          {userData.recipes?.map((recipe) => {
            return (
              <div className='recipe-card' id={recipe._id} onClick={handleRecipeClick}>
                {recipe.title}
                <br></br>
                {recipe.description}
              </div>
            )
          })}
        </section>
      </div >
    </>
  );
};

export default Recipes;
