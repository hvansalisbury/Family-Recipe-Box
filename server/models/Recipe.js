const { Schema } = require('mongoose');
const userSchema = require('./User');
const ingredientSchema = require('./Ingredient');
const directionSchema = require('./Direction');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const recipeSchema = new Schema({
  author: userSchema,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ingredients: [ingredientSchema],
  directions: [directionSchema],
});

module.exports = recipeSchema;
