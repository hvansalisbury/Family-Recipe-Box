// This file contains the queries that will be used to fetch data from the server.
import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      recipes {
        _id
        title
        description
        ingredients {
          _id
          amount
          unit
          item
          recipeId
        }
        instructions {
          _id
          direction
          recipeId
        }
      }
    }
  }
`;

export const QUERY_RECIPES = gql`
  {
    recipes {
      _id
      title
      description
      ingredients {
        amount
        unit
        item
        recipeId
      }
      instructions {
        direction
        recipeId
      }
    }
  }
`;

export const QUERY_RECIPE = gql`
  query getRecipe($recipeId: ID!) {
    recipe(recipeId: $recipeId) {
      _id
      title
      description
      ingredients {
        _id
        amount
        unit
        item
        recipeId
      }
      instructions {
        _id
        direction
        recipeId
      }
    }
  }
`;
