// This file defines the typeDefs for the GraphQL API
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    recipeCount: Int
    recipes: [Recipe]
  }

  type Recipe {
    _id: ID!
    title: String!
    description: String!
    ingredients: [Ingredient]
    instructions: [Instruction]
  }

  type Ingredient {
    _id: ID!
    amount: String!
    unit: String!
    item: String!
    recipeId: String
  }

  type Instruction {
    _id: ID!
    direction: String!
    recipeId: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input IngredientInput {
    amount: String!
    unit: String!
    item: String!
    recipeId: String
  }

  input InstructionInput {
    direction: String!
    recipeId: String
  }

  input RecipeInput {
    title: String!
    description: String!
    ingredients: [IngredientInput]
    instructions: [InstructionInput]
  }

  input EditRecipeInput {
    title: String
    description: String
    ingredients: [IngredientInput]
    instructions: [InstructionInput]
  }

  input EditIngredientInput {
    amount: String
    unit: String
    item: String
    recipeId: String
  }

  input EditInstructionInput {
    direction: String
    recipeId: String
  }

  type Query {
    me: User
    recipe(recipeId: ID!): Recipe
    recipes: [Recipe]
    users: [User]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveRecipe(input: RecipeInput!): Recipe
    saveIngredient(input: IngredientInput!): Recipe
    saveInstruction(input: InstructionInput!): Recipe
    deleteRecipe(_id: ID!): User
    editRecipe(recipeId: ID!, input: EditRecipeInput!): Recipe
    editIngredients(recipeId: ID!, input: EditIngredientInput!): Recipe
    editInstructions(recipeId: ID!, input: EditInstructionInput!): Recipe
  }
`;

module.exports = typeDefs;
