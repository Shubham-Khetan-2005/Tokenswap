async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TokenSwap = await ethers.getContractFactory("TokenSwap");

  // Set gas price and gas limit here
  const gasPrice = ethers.utils.parseUnits('10', 'gwei');  // Set to a lower gas price (e.g., 10 gwei)
  const gasLimit = 3000000; // Set a reasonable gas limit for the deployment

  const tokenSwap = await TokenSwap.deploy({
      gasPrice: gasPrice, 
      gasLimit: gasLimit
  });

  // await tokenSwap.deployed();

  console.log("TokenSwap contract deployed to:", tokenSwap.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
