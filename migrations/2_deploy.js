const RushToken = artifacts.require("RushToken");
const RushStake = artifacts.require("RushStake");

module.exports = async function(deployer) {
	//deploy Token
	await deployer.deploy(RushToken)

	//assign token into variable to get it's address
	const rushToken = await RushToken.deployed()
	
	//pass token address for dBank contract(for future minting)
	await deployer.deploy(RushStake, rushToken.address)

	//assign dBank contract into variable to get it's address
	const rushStake = await RushStake.deployed()

	//change token's owner/minter from deployer to dBank
	await rushToken.transferMinterRole(rushStake.address)
};