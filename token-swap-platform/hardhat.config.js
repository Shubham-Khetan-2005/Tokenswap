/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); 
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,  // Access INFURA_PROJECT_ID from .env
      accounts: [`0x${process.env.PRIVATE_KEY}`],  // Access PRIVATE_KEY from .env
      gas: 2100000, // Default gas limit
      gasPrice: 8000000000, // 8 gwei gas price
    },
  },
};
