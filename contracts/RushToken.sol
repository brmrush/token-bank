// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RushToken is ERC20 {
  address public owner;
  address public minter;


  modifier validAddress(address _addr) {
    require(_addr != address(0), "Address is not valid.");
    _;
  }
  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this.");
    _;
  }
  modifier onlyMinter() {
    require(msg.sender == minter, "Only owner can call this.");
    _;
  }


  constructor() ERC20("Rush Token", "RST") {
    owner = msg.sender;
    minter = msg.sender;
  }

  function transferMinterRole(address _minter) external onlyOwner() {
    minter = _minter;
  }
  //Usually it should be used with modifiers onlyOwner() or onlyMinter()
  //or it should be minted once if you want your tokens total supply to be
  //fixed

  function mint(address account, uint amount) onlyMinter() external {
		_mint(account, amount);
	}


}