import React, { useState, useEffect } from 'react';

import macarons from '../assets/images/pexels-ylanite-koppens-2014693.jpg';

const styles = {
  image: {
    display: 'flex',
    height: 'calc(100vh - 50px)',
    width: '100%',
    backgroundImage: `url(${macarons})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'whitesmoke',
    webkitTextStroke: '2px darkslategrey',
  },
}

const SearchBooks = () => {
  return (
    <>
      <section style={styles.image} alt="Ylanite-Koppen-macarons">
        <h1>FAMILY RECIPE BOX</h1>
      </section>
    </>
  );
};

export default SearchBooks;
