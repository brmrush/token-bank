// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RushToken is ERC20 {
  address public minter;
  address public owner;


  modifier validAddress(address _addr) {
    require(_addr != address(0), "Address is not valid.");
    _;
  }
  modifier onlyMinter() {
    require(msg.sender == minter, "Only owner can call this.");

    _;
  }

  event MinterChanged(address indexed from, address to);

  constructor() ERC20("Rush Token", "RST") {
    owner = msg.sender;
    minter = msg.sender;
  }


  function passMinterRole(address rushBank) public returns (bool) {
  	require(msg.sender==minter, 'Error, only owner can change pass minter role');
  	minter = rushBank;

    emit MinterChanged(msg.sender, rushBank);
    return true;
  }

  function mint(address account, uint256 amount) public validAddress(account) onlyMinter {
		require(msg.sender==minter, 'Error, msg.sender does not have minter role');
		_mint(account, amount);
	}

}