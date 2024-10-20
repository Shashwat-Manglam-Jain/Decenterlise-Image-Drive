// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition


const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("deployModule", (m) => {
  const upload = m.contract("Upload"); // Deploy the "Upload" contract
  return { upload };
});
