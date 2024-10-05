import React, { useState } from 'react';
import { ethers, parseEther } from 'ethers'; // Import ethers and parseEther
import A from '../utils/TokenSwap.json'; // ABI file of the contract
const abi = A.abi;

function SwapForm({ currentAccount, provider }) {
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState('');
  // const [amountOutMin, setAmountOutMin] = useState('');
  const [swapStatus, setSwapStatus] = useState('');

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  // Function to handle token swap
  const handleSwap = async () => {
    if (!currentAccount) {
      alert("Please connect your MetaMask wallet.");
      return;
    }

    try {
      // Get the signer from the passed provider
      const signer = await provider.getSigner();
      const tokenSwapContract = new ethers.Contract(contractAddress, abi, signer);

      // Execute the swap transaction
      const tx = await tokenSwapContract.swapExactInputSingle(
        tokenIn,
        tokenOut,
        ethers.parseUnits(amountIn, 18), // Use parseEther directly from ethers v6
        // parseEther(amountOutMin), // Use parseEther directly from ethers v6
        // currentAccount,
        // Math.floor(Date.now() / 1000) + 60 * 20 // 20-minute deadline
      );

      setSwapStatus('Swap in progress...');

      // Wait for the transaction to be confirmed
      await tx.wait();

      setSwapStatus('Swap completed successfully!');
    } catch (error) {
      console.error("Error during the swap:", error);
      setSwapStatus('Swap failed.');
    }
  };

  return (
    <div className="swap-form">
      <input
        type="text"
        placeholder="Token In Address"
        value={tokenIn}
        onChange={(e) => setTokenIn(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token Out Address"
        value={tokenOut}
        onChange={(e) => setTokenOut(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount In"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      />
      {/* <input
        type="number"
        placeholder="Min Amount Out"
        value={amountOutMin}
        onChange={(e) => setAmountOutMin(e.target.value)}
      /> */}
      <button onClick={handleSwap}>Swap Tokens</button>
      <p>{swapStatus}</p>
    </div>
  );
}

export default SwapForm;
