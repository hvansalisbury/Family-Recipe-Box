// This page is for the user to view their recipes
import React, { useState, useEffect } from 'react';
// import useQuery and useMutation from apollo client
import { useQuery, useMutation } from '@apollo/client';
// import the QUERY_ME query and the DELETE_RECIPE mutation
import { QUERY_ME } from '../utils/queries';
import { DELETE_RECIPE } from '../utils/mutations';
// import useNavigate from react-router-dom
import { useNavigate } from 'react-router-dom';
// import the css file
import '../assets/css/recipes.css'
// import Auth middleware
import Auth from '../utils/auth';
// recipes page
const Recipes = () => {
  // useQuery hook to get the user's recipes, fetchPolicy: 'network-only' to make sure the data is up to date, otherwise it will use the cache
  const { loading, data, refetch } = useQuery(QUERY_ME, {fetchPolicy: 'network-only'});
  // useMutation hook to delete a recipe
  const [deleteRecipe, { error }] = useMutation(DELETE_RECIPE);
  // useState hook to set the showRecipes state
  const [showRecipes, setShowRecipes] = useState({});

  console.log(data?.me.recipes)
  // set the userRecipes equal to the data from the query
  const userRecipes = data?.me.recipes || [];
  // useEffect hook to set the showRecipes state to the data from the query
  useEffect(() => {
    if (data) {
      setShowRecipes(data.me);
      console.log(data.me)
    }
  }, [data]);
  
  console.log(data)
  // handleDeleteRecipe function to delete a recipe
  const handleDeleteRecipe = async (recipeId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    // if there is no token, return false
    if (!token) {
      return false;
    }
    // try to delete the recipe, pass in the recipeId
    try {
      const { data } = await deleteRecipe({
        variables: { recipeId },
      });
      // set show recipes to the data from the mutation
      setShowRecipes(data.deleteRecipe);
    } catch (err) {
      // if there is an error, log it to the console
      console.error(err);
    }
  };
  // useNavigate hook to navigate to the home page
  const navigate = useNavigate();
  // useEffect hook to check if the user is logged in, if not, navigate to the home page
  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate("/");
    }
  }, [navigate]);
  // if the page is loading, return loading
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  
  console.log(showRecipes);
  
  return (
    <>
      <div className='recipes-container'>
        <h2>{showRecipes.username}'s recipes</h2>
        <section className='recipes-section'>
          {/* map function to show each recipe and title, with delete recipe and view recipe buttons */}
          {showRecipes.recipes?.map((recipe) => {
            return (
              <div className='recipe-card-basic' key={recipe._id} id={recipe._id}>
                <h4>{recipe.title}</h4>
                <p>{recipe.description}</p>
                <div className='button-box'>
                  <button onClick={() => navigate(`/recipes/${recipe._id}`)}>View Recipe</button>
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
