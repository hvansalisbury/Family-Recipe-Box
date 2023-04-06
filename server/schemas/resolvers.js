// This file is where we define the query and mutation functionality to interact with the database
const { AuthenticationError } = require('apollo-server-express');
// import the User and Recipe models
const { User, Recipe } = require('../models');
// import the signToken function from the auth.js file
const { signToken } = require('../utils/auth');

const resolvers = {
  // query for person who is logged in, query for a recipe, query for all users, query for all recipes
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    recipe: async (parent, { recipeId }, context) => {
      if (context.user) {
        const recipeData = await Recipe.findOne({ _id: recipeId }).select('-__v');

        return recipeData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
    },
    recipes: async (parent) => {
      console.log(parent)
      return Recipe.find()
        .select('-__v')
    }
  },
  // query for a user's saved recipes
  User: {
    recipes: async (parent) => {
      console.log(parent)
      const recipes = await Recipe.find({ _id: { $in: parent.recipes } }).select('-__v');
      return recipes;
    }
  },
  // mutations
  Mutation: {
    // create a user, sign a token, log a user in
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    // login user, sign a token, log a user in
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    // save a recipe, add recipe to user's saved recipes
    saveRecipe: async (parent, { input }, context) => {
      if (context.user) {
        console.log(input)
        const newRecipe = await Recipe.create(input);
        console.log(newRecipe)
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { recipes: newRecipe._id } },
          { new: true }
        );
        console.log(updatedUser)
        return newRecipe;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // save an ingredient, add ingredient to recipe's ingredients
    saveIngredient: async (parent, { input }, context) => {
      if (context.user) {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          { _id: input.recipeId },
          { $push: { ingredients: input } },
          { new: true }
        );

        return updatedRecipe;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    // save an instruction, add instruction to recipe's instructions
    saveInstruction: async (parent, { input }, context) => {
      if (context.user) {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          { _id: input.recipeId },
          { $push: { instructions: input } },
          { new: true }
        );

        return updatedRecipe;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    // delete a recipe, remove recipe from user's saved recipes
    deleteRecipe: async (parent, { _id }, context) => {
      if (context.user) {
        console.log(_id);
        const deletedRecipe = await Recipe.findByIdAndDelete(_id, { new: true });

        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { recipes: _id } },
          { new: true }
        );
        console.log(updatedUser);
        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    // edit any component of a recipe
    editRecipe: async (parent, { recipeId, input }, context) => {
      if (context.user) {
        console.log(recipeId);
        console.log(input);
        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, input, { new: true });
        return updatedRecipe;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    // edit ingredients of a recipe
    editIngredients: async (parent, { recipeId, input }, context) => {
      if (context.user) {
        console.log(recipeId);
        console.log(input);
        const deleteIngredients = await Recipe.findOne({ _id: recipeId }, (err, recipe) => {
          recipe.ingredients = undefined;
          recipe.save();
        },
          { new: true });
        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, input, { new: true });
        return updatedRecipe;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
