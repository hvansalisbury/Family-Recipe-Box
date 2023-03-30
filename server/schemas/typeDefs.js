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
    amount: String!
    unit: String!
    item: String!
    recipeId: String
  }

  type Instruction {
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
    deleteRecipe(_id: ID!): Recipe
    EditRecipe(recipeId: ID!, input: RecipeInput!): Recipe
  }
`;

module.exports = typeDefs;
