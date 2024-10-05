// src/App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SwapForm from './components/SwapForm';
import Navbar from './components/Navbar';
import './styles.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  // Connect to MetaMask using Ethers.js (version 6.x.x)
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const ethProvider = new ethers.BrowserProvider(window.ethereum); // Updated for ethers v6
        const accounts = await ethProvider.send("eth_requestAccounts", []); // Get the accounts
        const signer = await ethProvider.getSigner();
        const accountAddress = await signer.getAddress();
        
        setProvider(ethProvider); // Set the Ethers.js provider
        setCurrentAccount(accountAddress); // Set the current account
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask to interact with this app!");
    }
  };

  // Automatically connect if MetaMask is already authorized
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum); // Updated for ethers v6
          const accounts = await ethProvider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await ethProvider.getSigner();
            const accountAddress = await signer.getAddress();
            setProvider(ethProvider);
            setCurrentAccount(accountAddress);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <div className="App">
      <Navbar connectWallet={connectWallet} currentAccount={currentAccount} />
      <div className="container">
        <h1>Token Swap DApp</h1>
        <SwapForm currentAccount={currentAccount} provider={provider} />
      </div>
    </div>
  );
}

export default App;
