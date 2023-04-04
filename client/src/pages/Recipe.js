import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_RECIPE } from '../utils/queries';
import { EDIT_RECIPE, EDIT_INGREDIENT, EDIT_INSTRUCTION } from '../utils/mutations';
import { useNavigate, useParams } from 'react-router-dom';
import Auth from '../utils/auth';
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
  },
};

const Recipe = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalType, setModalType] = useState();

  let [inputText, setInputText] = useState();

  const navigate = useNavigate();

  const [editRecipe, { error }] = useMutation(EDIT_RECIPE);

  const { recipeId } = useParams();
  const { loading, data } = useQuery(QUERY_RECIPE, {
    variables: { recipeId: recipeId },
  });
  const [showRecipe, setShowRecipe] = useState({});

  useEffect(() => {
    if (data) {
      setShowRecipe(data);
    }
  }, [data]);

  let ingredientData = data?.recipe.ingredients || {};
  let instructionData = data?.recipe.instructions || {};

  const handleEditClick = async (e) => {
    e.preventDefault();
    setModalOpen(true);

    const targetEl = e.target;
    const parentEl = targetEl.parentNode;
    const editEl = targetEl.previousSibling;
    const index = editEl.getAttribute('index');
    if (targetEl.classList.contains('title') || targetEl.classList.contains('description')) {
      await setModalType('title-description');
      const name = editEl.getAttribute('name');
      const value = editEl.textContent.trim();
      setModalData({ index, name, value });
    } else if (targetEl.classList.contains('ingredients')) {
      await setModalType('ingredients');
      const amount = editEl.children[0].textContent.trim();
      const unit = editEl.children[2].textContent.trim();
      const item = editEl.children[4].textContent.trim();
      setModalData({ index, amount, unit, item });
    } else if (targetEl.classList.contains('instructions')) {
      await setModalType('instructions');
      const direction = editEl.textContent.trim();
      setModalData({ index, direction });
    };
  };

  const handleInputChange = (e) => {
    if (modalType !== 'ingredients') {
      const { target } = e;
      const inputType = target.name;
      const inputValue = target.value;
      const index = target.getAttribute('index');
      setInputText({ [inputType]: inputValue, index: index });
    } else {
      const { target } = e;
      const inputType = target.name;
      const inputValue = target.value;
      const index = target.getAttribute('index');

      setInputText({ ...inputText, [inputType]: inputValue, index: index });
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setModalOpen(false);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    switch (modalType) {
      case 'title-description':
        delete inputText.index;
        break;
      case 'ingredients':
        console.log(inputText)
        let cloneIngredients = JSON.parse(JSON.stringify(showRecipe.recipe.ingredients));
        console.log(cloneIngredients)
        for (let i = 0; i < cloneIngredients.length; i++) {
          Reflect.deleteProperty(cloneIngredients[i], '__typename')
          Reflect.deleteProperty(cloneIngredients[i], '_id')
        }
        console.log(inputText)
        cloneIngredients[inputText.index].amount = inputText.amount;
        cloneIngredients[inputText.index].unit = inputText.unit;
        cloneIngredients[inputText.index].item = inputText.item;
        inputText = { ingredients: cloneIngredients }
        console.log(inputText)
        break;
      case 'instructions':
        console.log(inputText)
        let cloneInstructions = JSON.parse(JSON.stringify(showRecipe.recipe.instructions));
        for (let i = 0; i < cloneInstructions.length; i++) {
          Reflect.deleteProperty(cloneInstructions[i], '__typename')
          Reflect.deleteProperty(cloneInstructions[i], '_id')
        }
        cloneInstructions[inputText.index].direction = inputText.direction;
        inputText = { instructions: cloneInstructions }
        break;
      default:
        return;
    };

    try {
      const { data } = await editRecipe({
        variables: { recipeId: recipeId, input: inputText },
      });

      setShowRecipe(data);
      return data;

    } catch (err) {
      console.error(err);
    }
    setInputText({});
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    localStorage.setItem('recipeId', recipeId);
    navigate('/ingredients');
  };

  const handleAddInstruction = async (e) => {
    e.preventDefault();
    localStorage.setItem('recipeId', recipeId);
    navigate('/instructions');
  };

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate("/");
    }
  }, [navigate]);

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
                <h2 index='' name='title'>{data.recipe.title}</h2>
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
                <p index='' name='description'>{data.recipe.description}</p>
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
                    <div index={index}>
                      <span arrayindex={index} name='amount'>{ingredient.amount}</span>
                      <span> </span>
                      <span arrayindex={index} name='unit'>{ingredient.unit}</span>
                      <span> - </span>
                      <span arrayindex={index} name='item'>{ingredient.item}</span>
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
              <div>
                <button className='add-button' onClick={handleAddIngredient}>
                  add ingredient
                </button>
              </div>
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
                    <li index={index} name='direction'>{instruction.direction}</li>
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
            <div>
              <button className='add-button' onClick={handleAddInstruction}>
                add instruction
              </button>
            </div>
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
            <div className='close-button-box'>
              <button className='close-button' onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <form id='title-description-form' className='editform' onSubmit={handleFormSubmit}>
              <h4>Edit {modalData.name}</h4>
              <div className='editformline'>
                <label className='editformlabel' htmlFor={modalData.name}>{modalData.name}: </label>
                <input index={modalData.index} className='editforminput' name={modalData.name} defaultValue={modalData.value} onChange={handleInputChange} />
                <button {...inputText ? { disabled: false } : { disabled: true }} type='submit'>Submit Edit</button>
              </div>
            </form>
          </Modal>
          : modalType === 'ingredients' ?
            <Modal
              appElement={document.getElementById('root')}
              ariaHideApp={false}
              isOpen={modalOpen}
              onRequestClose={() => setModalOpen(false)}
              style={styles}
            >
              <div className='close-button-box'>
                <button className='close-button' onClick={() => setModalOpen(false)}>&times;</button>
              </div>
              <form id='ingredients-form' className='editform' onSubmit={handleFormSubmit}>
                <h4>Edit Ingredient</h4>
                <div className='editformline'>
                  <label className='editformlabel' htmlFor='amount'>Amount: </label>
                  <input type='number' index={modalData.index} className='editforminput' datapath={modalData.datapath + 'amount'} name='amount' defaultValue={modalData.amount} onChange={handleInputChange} />
                </div>
                <div className='editformline'>
                  <label className='editformlabel' htmlFor='unit'>Unit: </label>
                  <input index={modalData.index} className='editforminput' datapath={modalData.datapath + 'unit'} name='unit' defaultValue={modalData.unit} onChange={handleInputChange} />
                </div>
                <div className='editformline'>
                  <label className='editformlabel' htmlFor='item'>Item: </label>
                  <input index={modalData.index} className='editforminput' datapath={modalData.datapath + 'item'} name='item' defaultValue={modalData.item} onChange={handleInputChange} />
                </div>
                <button {...inputText ? { disabled: false } : { disabled: true }} type='submit'>Submit Edit</button>
              </form>
            </Modal>
            :
            <Modal
              appElement={document.getElementById('root')}
              ariaHideApp={false}
              isOpen={modalOpen}
              onRequestClose={() => setModalOpen(false)}
              style={styles}
            >
              <div className='close-button-box'>
                <button className='close-button' onClick={() => setModalOpen(false)}>&times;</button>
              </div>
              <form id='instructions-form' className='editform' onSubmit={handleFormSubmit}>
                <h4>Edit Direction</h4>
                <div className='editformline'>
                  <label className='editformlabel' htmlFor='direction'>Direction: </label>
                  <input index={modalData.index} className='editforminput' datapath={modalData.datapath + 'direction'} name='direction' defaultValue={modalData.direction} onChange={handleInputChange} />
                </div>
                <button {...inputText ? { disabled: false } : { disabled: true }} type='submit'>Submit Edit</button>
              </form>
            </Modal>
        }
      </div>
    </>
  );
};

export default Recipe;
