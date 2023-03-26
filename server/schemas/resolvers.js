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
    recipe: async (_, { id }) => {
      if (context.user) {
        const recipeData = await Recipe.findById(id).select('-__v');

        return recipeData;
      }
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
    },
    recipes: async () => {
      return Recipe.find()
        .select('-__v')
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
        const newRecipe = await Recipe.create(input);
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { recipes: newRecipe._id } },
          { new: true }
        );
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
    removeRecipe: async (_, { id }, context) => {
      if (context.user) {
        console.log(id);
        const deletedRecipe = await Recipe.findByIdAndDelete(id);

        const updatedUser = await User.findOneAndUpdate(
          { _id: "642060d88bb66333bc70e244" },
          { $pull: { recipes: id } },
          { new: true }
        );
        console.log(updatedUser);
        return deletedRecipe;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    updateRecipe: async (parent, { id, input }, context) => {
      if (context.user) {
        console.log(id);
        console.log(input);
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, input);
        return updatedRecipe;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

  },
};

module.exports = resolvers;
