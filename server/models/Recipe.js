const { Schema, model } = require('mongoose');
const ingredientSchema = require('./Ingredient');
const instructionSchema = require('./Instruction');

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [ingredientSchema],
    instructions: [instructionSchema]
  }
);

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;
