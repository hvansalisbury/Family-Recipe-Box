const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    recipeCount: Int
    recipes: [String]
  }

  type Recipe {
    _id: ID!
    title: String!
    description: String!
    ingredients: [Ingredient]
    instructions: [Instruction]
  }

  type Ingredient {
    amount: Int!
    unit: String!
    item: String!
    recipeId: String
  }

  type Instruction {
    step: Int!
    direction: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  input IngredientInput {
    unit: String!
    amount: Int!
    item: String!
    recipeId: String
  }

  input InstructionInput {
    step: Int!
    direction: String!
  }

  input RecipeInput {
    title: String!
    description: String!
    ingredients: [IngredientInput]
    instructions: [InstructionInput]
  }

  type Query {
    me: User
    recipe(id: ID!): Recipe
    recipes: [Recipe]
    users: [User]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveRecipe(input: RecipeInput!): Recipe
    saveIngredient(input: IngredientInput!): Recipe
    removeRecipe(id: ID!): Recipe
    updateRecipe(id: ID!, input: RecipeInput!): Recipe
  }
`;

module.exports = typeDefs;
