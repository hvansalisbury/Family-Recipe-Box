  import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StoreRecipe from './pages/StoreRecipe'
import SaveIngredients from './pages/Ingredients'
import SaveInstructions from './pages/Instructions';
import Recipes from './pages/Recipes';
import Recipe from './pages/Recipe';
import EditRecipe from './pages/EditRecipe';

import macarons from './assets/images/pexels-ylanite-koppens-2014693.jpg';
import tortellini from './assets/images/pexels-karolina-grabowska-4039609.jpg';
import calzone from './assets/images/pexels-karolina-grabowska-4084930.jpg';
import knife from './assets/images/pexels-lukas-349609.jpg';
import pizza from './assets/images/pexels-eneida-nieves-905847.jpg';
import bread from './assets/images/pexels-skyler-ewing-9482665.jpg'
import burger from './assets/images/pexels-valeria-boltneva-1639562.jpg'

const images = [
  {"image": macarons, "alt": "ylanite-koppens-macarons"}, 
  {"image": tortellini, "alt": "karolina-grabowska-tottelini"}, 
  {"image": calzone, "alt": "karolina-grabowska-calzone"},
  {"image": knife, "alt": "lukas-knife"}, 
  {"image": pizza, "alt": "eneida-nieves-pizza"},
  {"image": bread, "alt": "skyler-ewing-bread"},
  {"image": burger, "alt": "valeria-boltneva-burger"}
]

const randomImage = images[Math.floor(Math.random()*images.length)];

const styles = {
  image: {
    height: 'calc(100vh - 50px)',
    width: '100%',
    backgroundImage: `url(${randomImage.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
}

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <main style={styles.image} alt={randomImage.alt}>
          <Routes>
            <Route
              path="/"
              element={<Landing />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route
              path="/storerecipe"
              element={<StoreRecipe />}
            />
            <Route
              path="/ingredients"
              element={<SaveIngredients />}
            />
            <Route
              path="/instructions"
              element={<SaveInstructions />}
            />
            <Route
              path="/recipes"
              element={<Recipes />}
            />
            <Route
              path="/recipes/:recipeId"
              element={<Recipe />}
            />
            <Route
              path="/editrecipe/:recipeId"
              element={<EditRecipe />}
            />
            <Route
              path='*'
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
          </main>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
