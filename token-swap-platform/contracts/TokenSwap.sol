// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.8.27;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}

contract TokenSwap {
    // Use constants for the router address and pool fee to reduce gas costs.
    address public constant routerAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

    // Use constant for the pool fee.
    uint24 public constant poolFee = 3;

    constructor() {}

    // Swap exact input for output
    function swapExactInputSingle(
        address tokenIn,       // Input token address
        address tokenOut,      // Output token address
        uint256 amountIn       // Amount of input token to swap
    ) external returns (uint256 amountOut) {
        IERC20 inputToken = IERC20(tokenIn);

        // User must approve the contract to transfer `tokenIn` tokens.
        require(inputToken.balanceOf(msg.sender) >= amountIn, "Insufficient balance");

        // Approve tokens for swapping
        inputToken.approve(address(swapRouter), amountIn);

        // Construct the swap parameters.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: poolFee,
            recipient: msg.sender, // Directly send swapped tokens to the user instead of contract.
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        // Perform the swap and return the output amount.
        amountOut = swapRouter.exactInputSingle(params);
    }

    // Swap exact output for input
    function swapExactOutputSingle(
        address tokenIn,        // Input token address
        address tokenOut,       // Output token address
        uint256 amountOut,      // Exact amount of output token desired
        uint256 amountInMaximum // Maximum amount of input tokens willing to spend
    ) external returns (uint256 amountIn) {
        IERC20 inputToken = IERC20(tokenIn);

        // User must approve the contract to transfer `tokenIn` tokens.
        require(inputToken.balanceOf(msg.sender) >= amountInMaximum, "Insufficient balance");

        // Approve tokens for swapping
        inputToken.approve(address(swapRouter), amountInMaximum);

        // Construct the swap parameters.
        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: poolFee,
            recipient: msg.sender, // Directly send swapped tokens to the user instead of contract.
            deadline: block.timestamp,
            amountOut: amountOut,
            amountInMaximum: amountInMaximum,
            sqrtPriceLimitX96: 0
        });

        // Perform the swap.
        amountIn = swapRouter.exactOutputSingle(params);

        // Refund any excess amount.
        if (amountIn < amountInMaximum) {
            unchecked {
                inputToken.transfer(msg.sender, amountInMaximum - amountIn);
            }
        }
    }
}
