const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    recipes: [Recipe]
  }

  type Recipe {
    _id: ID!
    author: User
    title: String!
    description: String!
    ingredients: [Ingredient]
    instructions: [Instruction]
  }

  type Ingredient {
    amount: Int!
    unit: String!
    item: String!
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
  }

  input InstructionInput {
    step: Int!
    direction: String!
  }

  input RecipeInput {
    author: ID!
    title: String!
    description: String!
    ingredients: [IngredientInput]!
    instructions: [InstructionInput]!
  }

  type Query {
    me: User
    recipe: Recipe
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveRecipe(recipeData: RecipeInput!): User
    removeRecipe(_id: ID!): User
  }
`;

module.exports = typeDefs;
