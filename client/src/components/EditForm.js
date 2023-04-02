import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/recipe.css'

import Auth from '../utils/auth';

const EditForm = (props) => {
  return (
    <>
      <form id={props.datapath} className='editform'>
        <div className='editformline'>
          <label className='editformlabel' htmlFor={props.name}>{props.name}</label>
          <input className='editforminput' value={props.value}/>
        </div>
      </form>
    </>
  );
};

export default EditForm;