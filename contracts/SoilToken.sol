// SPDX-License-Identifier: MIT

pragma solidity ^0.8.5;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract SoilToken is ERC20Capped, AccessControl {
    bytes32 public constant MINTING_ROLE = keccak256("MINTING_ROLE");

    constructor()
        ERC20Capped(10 * 10**9 * 10**decimals())
        ERC20("Soil Token", "SOIL")
    {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function mint(address to, uint256 amount) public onlyRole(MINTING_ROLE) {
        _mint(to, amount);
    }
}
