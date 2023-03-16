const { Schema } = require('mongoose');
const Ingredient = require('./Ingredient');
const Instruction = require('./Instruction');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const recipeSchema = new Schema({

  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [Ingredient],
  instructions: [Instruction]
});

module.exports = recipeSchema;
