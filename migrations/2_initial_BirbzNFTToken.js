const BirbzNFTToken = artifacts.require("BirbzNFTToken");

module.exports = function (deployer) {
  deployer.deploy(BirbzNFTToken);
};
