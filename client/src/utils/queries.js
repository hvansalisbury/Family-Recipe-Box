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
