import React, { useState } from 'react';
import '../assets/css/recipe.css'

import Auth from '../utils/auth';

const EditModal = (props) => {
  return (
    <>
      <form id={props.datapath} className='editform'>
        <h4>Edit {props.name}</h4>
        <div className='editformline'>
          <label className='editformlabel' htmlFor={props.name}>{props.name}</label>
          <input className='editforminput' value={props.value}/>
          <button type='submit'>Submit Edits</button>
        </div>
      </form>
    </>
  );
};

export default EditModal;