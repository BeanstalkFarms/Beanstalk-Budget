// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @author Publius
 * @title Mock Token
**/
contract MockToken is ERC20 {

    constructor() payable ERC20("Mock Token", "MOCK") {}

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

}