import React, { useState, useEffect } from 'react';

import macarons from '../assets/images/pexels-ylanite-koppens-2014693.jpg';

const styles = {
  title: {
    display: 'flex',
    height: 'calc(100vh - 50px)',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'whitesmoke',
    webkitTextStroke: '2px darkslategrey',
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
