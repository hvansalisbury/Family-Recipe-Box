import React from 'react';

const styles = {
  title: {
    display: 'flex',
    height: 'calc(100vh - 50px)',
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
      <section style={styles.title}>
        <h1>FAMILY RECIPE BOX</h1>
      </section>
    </>
  );
};

export default SearchBooks;
