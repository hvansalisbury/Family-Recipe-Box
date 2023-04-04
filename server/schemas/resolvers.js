const { AuthenticationError } = require('apollo-server-express');
const { User, Recipe } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
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
  User: {
    recipes: async (parent) => {
      console.log(parent)
      const recipes = await Recipe.find({ _id: { $in: parent.recipes } }).select('-__v');
      return recipes;
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
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
    editRecipe: async (parent, { recipeId, input }, context) => {
      if (context.user) {
        console.log(recipeId);
        console.log(input);
        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, input, { new: true });
        return updatedRecipe;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
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
