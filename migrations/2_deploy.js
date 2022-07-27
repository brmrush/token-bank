const RushToken = artifacts.require("RushToken");
const RushBank = artifacts.require("RushBank");

module.exports = async function(deployer) {
	//deploy Token
	await deployer.deploy(RushToken)

	//assign token into variable to get it's address
	const rushToken = await RushToken.deployed()
	
	//pass token address for dBank contract(for future minting)
	await deployer.deploy(RushBank, rushToken.address)

	//assign dBank contract into variable to get it's address
	const rushBank = await RushBank.deployed()

	//change token's owner/minter from deployer to dBank
	await rushToken.passMinterRole(rushBank.address)
};