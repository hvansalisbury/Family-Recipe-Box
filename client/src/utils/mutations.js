import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_RECIPE = gql`
  mutation saveRecipe($input: RecipeInput!) {
    saveRecipe(input: $input) {
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

export const SAVE_INGREDIENT = gql`
  mutation saveIngredient($input: IngredientInput!) {
    saveIngredient(input: $input) {
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

export const SAVE_INSTRUCTION = gql`
  mutation saveInstruction($input: InstructionInput!) {
    saveInstruction(input: $input) {
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

export const DELETE_RECIPE = gql`
mutation deleteRecipe($recipeId: ID!) {
  deleteRecipe(_id: $recipeId) {
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

export const EDIT_RECIPE = gql`
mutation editRecipe($recipeId: ID!, $input: EditRecipeInput!) {
  editRecipe(_id: $recipeId, input: $input) {
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