import { ethers } from 'ethers';

const cancelPendingTransaction = async () => {
    // Connect to the Ethereum provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Get the current nonce for the address
    const currentNonce = await signer.getTransactionCount();
    
    // Check the pending transaction count
    const pendingNonce = await provider.getTransactionCount(await signer.getAddress(), 'pending');

    if (pendingNonce > currentNonce) {
        console.log("You have a pending transaction. Proceeding to cancel...");

        // Create a transaction to cancel the pending transaction
        const cancelTx = {
            to: await signer.getAddress(), // Sending to yourself
            value: ethers.parseEther("0.0"), // No Ether sent
            nonce: currentNonce, // Use the same nonce as the pending transaction
            gasPrice: ethers.parseUnits('50', 'gwei'), // Set a high gas price
            gasLimit: 21000 // Standard gas limit for a simple transaction
        };

        try {
            // Send the cancel transaction
            const txResponse = await signer.sendTransaction(cancelTx);
            console.log("Cancel transaction sent:", txResponse);
            
            // Wait for the transaction to be mined
            await txResponse.wait();
            console.log("Cancel transaction mined!");
        } catch (error) {
            console.error("Error sending cancel transaction:", error);
        }
    } else {
        console.log("No pending transactions found.");
    }
};

// Call the function to execute
export default cancelPendingTransaction;
