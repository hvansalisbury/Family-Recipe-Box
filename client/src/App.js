// imports react, react router
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// imports search books, saved books pages, and navbar component
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
// imports apollo client components
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, useQuery } from '@apollo/client';
import { GET_ME } from './utils/queries';
// imports set context from apollo client link 
import { setContext } from '@apollo/client/link/context';
// sets up apollo client to work with graphql
const httpLink = createHttpLink({
  uri: '/graphql',
});
// defines authLink to set the request headers
const authLink = setContext((_, { headers }) => {
  // gets token from local storage
  const token = localStorage.getItem('id_token');
  // returns the headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
// defines client to use authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
// function to render the app
function App() {
  // returns html to render
  return (
  
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route
              path='/'
              element={<SearchBooks />}
            />
            <Route
              path='/saved'
              element={<SavedBooks />}
            />
            <Route
              path='*'
              element={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}
// exports app
export default App;