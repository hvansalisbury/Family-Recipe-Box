// This is the landing page for the app
import React from 'react';
import '../assets/css/landing.css';
// styles object
const styles = {
  title: {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'whitesmoke',
    WebkitTextStroke: '2px darkslategrey',
  },
}

const SearchBooks = () => {
  return (
    <>
    {/* centers title in page */}
      <section style={styles.title}>
        <h1>FAMILY RECIPE BOX</h1>
      </section>
    </>
  );
};

export default SearchBooks;
