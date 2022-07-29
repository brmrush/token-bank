// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./RushToken.sol";

contract RushStake {

    address public owner;

    uint public rewardRatePerBlock;

    RushToken private tokenInterface;

    uint256 mintAmount;

    constructor(address _tokenInterface) {
        owner = msg.sender;
        tokenInterface = RushToken(_tokenInterface);
        rewardRatePerBlock = 25;
        mintAmount = 1000000000;
    }

    struct Stake {
        address stakeOwner;
        uint stakeStartBlock;
        uint stakeAmount;
    }

    mapping(address => uint) public addressToTotalStakedAmount;
    mapping(address => Stake[]) private addressToStakes;

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    modifier hasTokenInStake() {
        require(addressToTotalStakedAmount[msg.sender] > 0, "User has no token in stake");
        _;
    }

    modifier hasRewardsToUnstake() {
        require(totalUnclaimedRewards(msg.sender) > 0, "User has no rewards yet");
        _;
    }

    

    function stake(uint _amount) external {
        require(_amount > 0, "Stake amount should be bigger than zero.");
        require(tokenInterface.balanceOf(msg.sender) >= _amount);
        
        tokenInterface.transferFrom(msg.sender, address(this), _amount);
        addressToTotalStakedAmount[msg.sender] += _amount;
        Stake memory newStake = Stake(msg.sender, block.number, _amount);
        addressToStakes[msg.sender].push(newStake);
    }

    function unstake() external hasTokenInStake() hasRewardsToUnstake() {

        tokenInterface.transfer(msg.sender, addressToTotalStakedAmount[msg.sender]);
        uint totalRewards = totalUnclaimedRewards(msg.sender);
        tokenInterface.mint(msg.sender, totalRewards);
        delete addressToTotalStakedAmount[msg.sender];
        delete addressToStakes[msg.sender];
    }

    function mintToken(address _to) public {
        tokenInterface.mint(_to, mintAmount);
    }



    function totalUnclaimedRewards(address _staker) public view returns (uint256) {
        uint256 unclaimedRewards = 0;
        Stake[] memory userStakes = addressToStakes[_staker];
        for(uint256 i = 0; i < userStakes.length; i++) {
            unclaimedRewards += (block.number - userStakes[i].stakeStartBlock) * rewardRatePerBlock / 100 ;
        }
        return unclaimedRewards;
    }

    function getCurrentBlock() external view returns (uint256) {
        return block.number;
    }

    function getMintAmount() external view returns (uint256) {
        return mintAmount;
    }

    function setMintAmount(uint256 _mintAmount) external onlyOwner() {
        mintAmount = _mintAmount;
    }


}