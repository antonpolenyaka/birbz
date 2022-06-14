/*************************************************************************************
 * 
 * Autor & Owner: Birbz
 *
 * 446576656c6f7065723a20416e746f6e20506f6c656e79616b61 *****************************/

// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./ERC721URIStorage.sol";
import "./Counters.sol";
import "./Ownable.sol";

contract BirbzNFTToken is ERC721URIStorage, Ownable {

    // Enums

    enum Status {
        Active,
        NotActive,
        Paused
    }
    
    // Constants

    uint256 constant private MAX_TOKENS_BY_WALLET = 10;
    uint256 constant private MAX_AMOUNT_TO_MINT = 10;
    uint256 constant private INITIAL_MAX_SUPPLY = 5555;
    uint256 constant private DEFAULT_NFT_PRICE = 1;

    // Attributes & Properties

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => uint256[]) private _walletToTokens;
    uint256 private _price;
    Status private _status;
    mapping(address => bool) private _denylist;
    uint256 private _maxSupply;
    address private _contractAddress;

    // Events

    event NFTPriceChanged(uint256 oldPrice, uint256 newPrice);
    event ContractStatusChanged(Status oldStatus, Status newStatus);
    event MaxSupplyChanged(uint256 oldSupply, uint256 newSupply);
    event WalletAddedToDenyList(address wallet);
    event BalanceWithdrawed(address to, uint256 balance);

    // Constructors

    constructor() ERC721("BIRBZ", "BIRBZ") {
        _maxSupply = INITIAL_MAX_SUPPLY;
        _price = DEFAULT_NFT_PRICE;
        _status = Status.Active;
        _contractAddress = payable(address(this));
    }

    // Methods

    // Check if is possible mint new NFT's
    function _checkBeforeMint(address wallet_, uint256 amountToMint_) private view {
        // Contract status
        require(_status == Status.Active, "ERROR: Status of contract is not active");
        // Check amount to mint > 0
        require(amountToMint_ > 0, "ERROR: Amount NFT to mint is zero");
        // Check amount to mint
        require(amountToMint_ <= MAX_AMOUNT_TO_MINT, "ERROR: Amount NFT to mint is over max");
        // Check wallet address
        require(wallet_ != address(0), "ERROR: Wallet address is need to be diferent 0");
        // Check number of already minted plus new amount
        uint256 currentAmount = _walletToTokens[wallet_].length;
        require((currentAmount + amountToMint_) <= MAX_TOKENS_BY_WALLET, "ERROR: Is not possible mint this amount of NFT to this wallet");
        // Check deny list
        require(_denylist[wallet_] == false, "ERROR: Wallet is in deny list");
        // Check supply denied
        uint currentSupply = _tokenIds.current();
        require(currentSupply + amountToMint_ <= _maxSupply, "ERROR: Total supply denied");
        // Check ether amount denied
        uint256 requiredEthersAmount = _price * amountToMint_;
        require(msg.value >= requiredEthersAmount, "ERROR: Ether amount is lower of required");
    }

    // Safe mint one NFT with indicated URI
    function _mintOne(address wallet_, string memory tokenURI_) private {
        uint256 newItemId = _tokenIds.current();
        _safeMint(wallet_, newItemId);
        _setTokenURI(newItemId, tokenURI_);
        _tokenIds.increment();
        _walletToTokens[wallet_].push(newItemId);
    }

    // Mint one NFT with indicated URI & check if is possilbe to mint
    function mint(address wallet_, string memory tokenURI_) external payable {
        _checkBeforeMint(wallet_, 1);
        payable(_contractAddress).transfer(_price);
        _mintOne(wallet_, tokenURI_);
    }

    // Mint multiple NFT's with indicated URI & check if is possilbe to mint
    function mintMultiple(address wallet_, uint256 amountToMint_, string memory tokenURI_) external payable {
        _checkBeforeMint(wallet_, amountToMint_);
        uint256 requiredEthersAmount = _price * amountToMint_;
        payable(_contractAddress).transfer(requiredEthersAmount);
        for(uint256 i = 1; i <= amountToMint_; i++) {
            _mintOne(wallet_, tokenURI_);
        }
    }

    // Get price of NFT
    function getPrice() external view returns(uint256) {
        return _price;
    }

    // Set price of NFT
    function setPrice(uint256 price_) external onlyOwner {
        emit NFTPriceChanged(_price, price_);
        _price = price_;
    }

    // Set status of contract
    function getStatus() external view returns(Status) {
        return _status;
    }

    // Set status to contract
    function setStatus(Status status_) external onlyOwner {
        emit ContractStatusChanged(_status, status_);
        _status = status_;
    }

    // Set status of contract
    function getMaxSupply() external view returns(uint256) {
        return _maxSupply;
    }

    // Get status of contract
    function setMaxSupply(uint256 maxSupply_) external onlyOwner {
        emit MaxSupplyChanged(_maxSupply, maxSupply_);
        _maxSupply = maxSupply_;
    }

    // Add wallet to deny list, if wallet is in deny list, is not possible to mint NFT
    function addToDenyList(address wallet_) external onlyOwner {
        _denylist[wallet_] = true;
        emit WalletAddedToDenyList(wallet_);
    }

    // Remove wallet from deny list, if wallet is in deny list, is not possible to mint NFT
    function removeFromDenyList(address wallet_) external onlyOwner {
        _denylist[wallet_] = false;
    }

    // Check if wallet in deny list, if wallet is in deny list, is not possible to mint NFT
    function checkDenyList(address wallet_) external view returns(bool) {
        return _denylist[wallet_];
    }

    // Withdraw all current ethers in balance of contract
    function withdraw() external payable onlyOwner {
        address to = owner();
        uint256 balance = address(this).balance;
        require(payable(to).send(balance));
        emit BalanceWithdrawed(to, balance);
    }

    // Get amount to pay in ETH to mint NFT's
    function getAmountToPay(uint256 amountToMint) external view returns(uint256) {
        return _price * amountToMint;
    }

    fallback() external payable {        
    }

    receive() external payable {        
    }
}