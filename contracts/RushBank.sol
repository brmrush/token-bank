// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./RushToken.sol";

contract RushBank {

  modifier onlyTokenOwner() {
    require(msg.sender == token.owner(), "Only owner can call this.");

    _;
  }

  modifier validAddress(address _addr) {
    require(_addr != address(0), "Address is not valid.");
    _;
  }
  
  RushToken private token;

  uint public mintAmount;
  uint public maxMintAmount;


  constructor(RushToken _token) {
    mintAmount = 10000;
    maxMintAmount = 50000;
    token = _token;
  }
  function deposit() payable public {
    require(msg.value >= 0.1 ether, 'Error, deposit must be >= 0.01 ETH');


  }
  function mintToken(address _to) public validAddress(_to) {
    require(token.balanceOf(_to) <= maxMintAmount, 'Error, maximum mint amount is exceeded.');
    token.mint(_to, mintAmount);
  }

  function changeMintAmount(uint _mintAmount) onlyTokenOwner public {
    mintAmount = _mintAmount;
  }

  function changeMaxMintAmount(uint _maxMintAmount) onlyTokenOwner public {
    maxMintAmount = _maxMintAmount;
  }

}