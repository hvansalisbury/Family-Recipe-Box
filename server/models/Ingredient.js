const { Schema } = require('mongoose');
const userSchema = require('./User');
const ingredientSchema = require('./Ingredient');
const directionSchema = require('./Direction');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const ingredientSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  measurement: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
});

module.exports = ingredientSchema;
