const RushToken = artifacts.require("RushToken");
const RushStake = artifacts.require("RushStake");

module.exports = async function(deployer) {
	await deployer.deploy(RushToken)
	const rushToken = await RushToken.deployed()
	await deployer.deploy(RushStake, rushToken.address)
	const rushStake = await RushStake.deployed()
	await rushToken.transferMinterRole(rushStake.address)
};