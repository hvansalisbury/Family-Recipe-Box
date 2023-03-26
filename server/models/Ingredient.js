const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const ingredientSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  recipeId: {
    type: String,
  },
});

module.exports = ingredientSchema;
