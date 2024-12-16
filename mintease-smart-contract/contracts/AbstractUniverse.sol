// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AbstractUniverse is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    uint256 public maxTokenCount;
    uint256 public mintPriceInWei;
    string[] private predefinedTokenURIs;

    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => address) public tokenSellers;

    constructor(
        address initialOwner,
        uint256 _maxTokenCount,
        uint256 _mintPriceInEth,
        string[] memory _predefinedURIs
    ) ERC721("Abstract Universe", "ASUV") Ownable(initialOwner) {
        require(_predefinedURIs.length == _maxTokenCount, "URI count must match maxTokenCount");
        tokenCounter = 0;
        maxTokenCount = _maxTokenCount;
        mintPriceInWei = _mintPriceInEth * 1 ether;
        predefinedTokenURIs = _predefinedURIs;
    }

    function mintNFT(address recipient) public payable returns (uint256) {
        require(tokenCounter < maxTokenCount, "Max token count reached");
        require(msg.value >= mintPriceInWei, "Insufficient payment");

        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, predefinedTokenURIs[tokenCounter]);

        tokenCounter += 1;
        return newTokenId;
    }

    function setMintPrice(uint256 _mintPriceInEth) public onlyOwner {
        mintPriceInWei = _mintPriceInEth * 1 ether;
    }

    function setTokenPrice(uint256 tokenId, uint256 priceInWei) public {
        require(
            ownerOf(tokenId) == msg.sender,
            "You are not the owner of this NFT"
        );
        tokenPrices[tokenId] = priceInWei;
        tokenSellers[tokenId] = msg.sender;
    }

    function buyNFT(uint256 tokenId) public payable {
        uint256 price = tokenPrices[tokenId];
        address seller = tokenSellers[tokenId];
        require(msg.value >= price, "Insufficient funds to buy NFT");
        require(seller != address(0), "NFT not for sale");

        payable(seller).transfer(msg.value);

        _safeTransfer(seller, msg.sender, tokenId, "");

        tokenPrices[tokenId] = 0;
        tokenSellers[tokenId] = address(0);
    }

    function getAllTokens() public view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            tokenIds[i] = i;
        }
        return tokenIds;
    }

    function getTokensForSale() public view returns (uint256[] memory) {
        uint256[] memory forSaleTokens = new uint256[](tokenCounter);
        uint256 counter = 0;
        for (uint256 i = 0; i < tokenCounter; i++) {
            if (tokenPrices[i] > 0) {
                forSaleTokens[counter] = i;
                counter++;
            }
        }

        uint256[] memory result = new uint256[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = forSaleTokens[i];
        }
        return result;
    }
}
