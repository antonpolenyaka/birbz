// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./ERC721URIStorage.sol";
import "./Counters.sol";

contract BirbzNFTToken is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => uint256[]) private _walletToTokens;
    uint256 constant private MAX_TOKENS_BY_WALLET = 10;

    constructor() ERC721("BIRBZ", "BIRBZ") {}

    function _checkBeforeMint(address wallet_, uint256 amount_) private view {
        require(amount_ <= 10, "ERROR: amount need to be equal or lower 10!");
        require(wallet_ != address(0), "ERROR: wallet need be different zero address!");
        // Check number of already minted plus new
        uint alreadyMinted = _walletToTokens[wallet_].length;
        require((alreadyMinted + amount_) < MAX_TOKENS_BY_WALLET, "ERROR: Is allowed only 10 tokens by wallet");
    }

    function _mintOne(address wallet_, string memory tokenURI_) private {
        uint256 newItemId = _tokenIds.current();
        _mint(wallet_, newItemId);
        _setTokenURI(newItemId, tokenURI_);
        _tokenIds.increment();
        _walletToTokens[wallet_].push(newItemId);
    }

    function mint(address wallet_, string memory tokenURI_) public {
        _checkBeforeMint(wallet_, 1);
        _mintOne(wallet_, tokenURI_);
    }

    function mintMany(address wallet_, uint256 amount_, string memory tokenURI_) public {
        _checkBeforeMint(wallet_, amount_);
        for(uint256 i = 1; i <= amount_; i++) {
            _mintOne(wallet_, tokenURI_);
        }
    }
}