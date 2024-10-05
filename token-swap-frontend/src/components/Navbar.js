// src/components/Navbar.js
import React from 'react';

const Navbar = ({ connectWallet, currentAccount }) => {
  return (
    <nav className="navbar">
      <h2>Token Swap DApp</h2>
      {!currentAccount ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {currentAccount}</p>
      )}
    </nav>
  );
};

export default Navbar;
