// This file defines the Instruction schema for the instructions in a recipe
const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const instructionSchema = new Schema({
  direction: {
    type: String,
    required: true,
  },
  recipeId: {
    type: String,
  },
});

module.exports = instructionSchema;
