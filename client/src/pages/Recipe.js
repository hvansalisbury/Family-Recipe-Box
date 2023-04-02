import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_RECIPE } from '../utils/queries';
import { useParams } from 'react-router-dom';
import EditForm from '../components/EditForm';
import '../assets/css/recipe.css'

const Recipe = () => {
  const [display, setDisplay] = useState('noshow');
  const [currentTab, setCurrentTab] = useState();

  const renderTab = () => {
    switch (currentTab) {
      case 'edit':
        return <EditForm datapath='data.recipe.title' name='title' value={data.recipe.title} />
    }
  }

  const { recipeId } = useParams();
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });

  const ingredientData = data?.recipe.ingredients || {};
  const instructionData = data?.recipe.instructions || {};

  const showButton = (e) => {
    e.preventDefault();
    setDisplay('show');
  };

  const hideButton = (e) => {
    e.preventDefault();
    setDisplay('noshow');
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    const parentElem = e.target.parentNode;
    const editElem = e.target.previousSibling;
    const newInput = document.createElement('input');
    newInput.setAttribute('id', 'data.recipe.title');
    // newInput.value = editElem.textContent;
    // parentElem.replaceChild(newInput, editElem);
    const props = { datapath: editElem.id, name: data.recipe.title, value: editElem.textContent }
    return <EditForm props />
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='recipe-section'>
        <section className='recipe-card'>
          <aside>
            <div className='card-heading'>
              <div
                className='button-toggle'
                onMouseEnter={showButton}
                onMouseLeave={hideButton}
              >
                <h2 id='data.recipe.title'>{data.recipe.title}</h2>
                <button
                  className={display}
                  onClick={currentTab === 'edit' ? renderTab : ''}
                >
                  edit
                </button>
              </div>
              <p>{data.recipe.description}</p>
            </div>
            <div className='ingredients-card'>
              <h4>INGREDIENTS</h4>
              {ingredientData.map((ingredient, index) => {
                return (
                  <div key={index}>
                    {ingredient.amount} {ingredient.unit} - {ingredient.item}
                  </div>
                )
              })}
            </div>
          </aside>
          <div className='instructions-card'>
            <h4>INSTRUCTIONS</h4>
            <ol>
              {instructionData.map((instruction, index) => {
                return (
                  <li key={index}>{instruction.direction}</li>
                )
              })}
            </ol>
          </div>
        </section>
      </div>
    </>
  );
};

export default Recipe;
