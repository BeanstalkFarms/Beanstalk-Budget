const { task } = require("hardhat/config")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require('@openzeppelin/hardhat-upgrades')
require("@nomiclabs/hardhat-etherscan")
const { deploy } = require('./scripts/deploy.js')


task("deploy", "Deploy the Budget Contracts", async() => {
  await deploy()
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9"
};