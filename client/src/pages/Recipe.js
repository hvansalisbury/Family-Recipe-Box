import React, { useState } from 'react';
import Modal from 'react-modal';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_RECIPE } from '../utils/queries';
import { EDIT_RECIPE } from '../utils/mutations';
import { useParams } from 'react-router-dom';
import '../assets/css/recipe.css'

const styles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    width: 400,
  },
};

const Recipe = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalType, setModalType] = useState();

  const [inputText, setInputText] = useState();

  const [editRecipe, { error }] = useMutation(EDIT_RECIPE);

  const { recipeId } = useParams();
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });

  const ingredientData = data?.recipe.ingredients || {};
  const instructionData = data?.recipe.instructions || {};

  const handleEditClick = async (e) => {
    e.preventDefault();
    setModalOpen(true);

    const targetEl = e.target;
    const parentEl = targetEl.parentNode;
    const editEl = targetEl.previousSibling;
    const datapath = editEl.getAttribute('datapath');

    if (targetEl.classList.contains('title') || targetEl.classList.contains('description')) {
      await setModalType('title-description');
      const name = editEl.getAttribute('name');
      const value = editEl.textContent;
      setModalData({ datapath, name, value });
    } else if (targetEl.classList.contains('ingredients')) {
      await setModalType('ingredients');
      const amount = editEl.children[0].textContent;
      const unit = editEl.children[1].textContent;
      const item = editEl.children[2].textContent;
      setModalData({ datapath, amount, unit, item });
    } else if (targetEl.classList.contains('instructions')) {
      await setModalType('instructions');
      console.log(editEl.textContent)
      const direction = editEl.textContent;
      setModalData({ datapath, direction });
    };
  };

  const handleInputChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    setInputText({[inputType]: inputValue });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setModalOpen(false);    

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log(inputText);
    try {
      const { data } = await editRecipe({
        variables: { recipeId: recipeId, input: inputText },
      });
      
      return data;
      
    } catch (err) {
      console.error(err);
    }    
  setInputText({});
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
                id='1a'
              >
                <h2 datapath='input.title' name='title'>{data.recipe.title}</h2>
                <button
                  className='title hidden'
                  onClick={handleEditClick}
                >
                  edit
                </button>
              </div>
              <div
                className='button-toggle'
                id='2a'
              >
                <p datapath='input.description' name='description'>{data.recipe.description}</p>
                <button
                  className='description hidden'
                  onClick={handleEditClick}
                >
                  edit
                </button>
              </div>
            </div>
            <div className='ingredients-card'>
              <h4>INGREDIENTS</h4>
              {ingredientData.map((ingredient, index) => {
                return (
                  <div
                    key={index}
                    className='button-toggle'
                    id={index + 'b'}
                  >
                    <div datapath={`input.ingredients[${index}]`}>
                      <span name='amount'>{ingredient.amount}</span>
                      <span name='unit'>{ingredient.unit}</span> -
                      <span name='item'>{ingredient.item}</span>
                    </div>
                    <button
                      className='ingredients hidden'
                      onClick={handleEditClick}
                    >
                      edit
                    </button>
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
                  <div
                    key={index}
                    className='button-toggle'
                    id={index + 'c'}
                  >
                    <li datapath={`input.instructions[${index}]`}>{instruction.direction}</li>
                    <button
                      className='instructions hidden'
                      onClick={handleEditClick}
                    >
                      edit
                    </button>
                  </div>
                )
              })}
            </ol>
          </div>
        </section>
        {modalType === 'title-description' ?

          <Modal
            appElement={document.getElementById('root')}
            ariaHideApp={false}
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            style={styles}
          >

            <form id={modalData.datapath} className='editform' onSubmit={handleFormSubmit}>
              <h4>Edit {modalData.name}</h4>
              <div className='editformline'>
                <label className='editformlabel' htmlFor={modalData.name}>{modalData.name}: </label>
                <input className='editforminput' name={modalData.name} defaultValue={modalData.value} onChange={handleInputChange}/>
                <button type='submit'>Submit Edit</button>
              </div>
            </form>
            <button onClick={() => setModalOpen(false)}>Close</button>
          </Modal>
          : modalType === 'ingredients' ?
            <Modal
              appElement={document.getElementById('root')}
              ariaHideApp={false}
              isOpen={modalOpen}
              onRequestClose={() => setModalOpen(false)}
              style={styles}
            >

              <form id={modalData.datapath} className='editform' onSubmit={handleFormSubmit}>
                <h4>Edit Ingredient</h4>
                <div className='editformline'>
                  <label className='editformlabel' htmlFor='amount'>Amount: </label>
                  <input className='editforminput' name='amount' defaultValue={modalData.amount} onChange={handleInputChange} />
                </div>
                <div className='editformline'>
                  <label className='editformlabel' htmlFor='unit'>Unit: </label>
                  <input className='editforminput' name='unit' defaultValue={modalData.unit} onChange={handleInputChange} />
                </div>
                <div className='editformline'>
                  <label className='editformlabel' htmlFor='item'>Item: </label>
                  <input className='editforminput' name='item' defaultValue={modalData.item} onChange={handleInputChange} />
                </div>
                <button type='submit'>Submit Edits</button>
              </form>
              <button onClick={() => setModalOpen(false)}>Close Modal</button>
            </Modal>
            :
            <Modal
              appElement={document.getElementById('root')}
              ariaHideApp={false}
              isOpen={modalOpen}
              onRequestClose={() => setModalOpen(false)}
              style={styles}
            >

              <form id={modalData.datapath} className='editform' onSubmit={handleFormSubmit}>
                <h4>Edit Direction</h4>
                <div className='editformline'>
                  <label className='editformlabel' htmlFor='direction'>Direction: </label>
                  <input className='editforminput' name='direction' defaultValue={modalData.direction} onChange={handleInputChange} />
                </div>
                <button type='submit'>Submit Edits</button>
              </form>
              <button onClick={() => setModalOpen(false)}>Close Modal</button>
            </Modal>
        }
      </div>
    </>
  );
};

export default Recipe;
