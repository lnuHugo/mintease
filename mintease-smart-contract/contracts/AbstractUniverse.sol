// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AbstractUniverse is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    uint256 public immutable maxTokenCount;
    uint256 public mintPriceInWei;
    string[] private predefinedTokenURIs;

    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => address) public tokenSellers;

    event TokenListed(
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller
    );
    event TokenSold(
        uint256 indexed tokenId,
        uint256 price,
        address indexed buyer
    );

    constructor(
        address initialOwner,
        uint256 _maxTokenCount,
        uint256 _mintPriceInWei,
        string[] memory _predefinedURIs
    ) ERC721("Abstract Universe", "ASUV") Ownable(initialOwner) {
        require(
            _predefinedURIs.length == _maxTokenCount,
            "URI count must match maxTokenCount"
        );
        tokenCounter = 0;
        maxTokenCount = _maxTokenCount;
        mintPriceInWei = _mintPriceInWei;
        predefinedTokenURIs = _predefinedURIs;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(
            ownerOf(tokenId) == msg.sender,
            "You are not the owner of this NFT"
        );
        _;
    }

    function mintNFT(address recipient) public payable returns (uint256) {
        require(tokenCounter < maxTokenCount, "Max token count reached");
        require(msg.value >= mintPriceInWei, "Insufficient payment");

        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, predefinedTokenURIs[tokenCounter]);

        tokenCounter += 1;

        if (msg.value > mintPriceInWei) {
            payable(msg.sender).transfer(msg.value - mintPriceInWei);
        }

        return newTokenId;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return predefinedTokenURIs[tokenId];
    }

    function setMintPrice(uint256 _mintPriceInEth) public onlyOwner {
        mintPriceInWei = _mintPriceInEth * 1 ether;
    }

    function setTokenPrice(
        uint256 tokenId,
        uint256 priceInWei
    ) public onlyTokenOwner(tokenId) {
        tokenPrices[tokenId] = priceInWei;
        tokenSellers[tokenId] = msg.sender;
        emit TokenListed(tokenId, priceInWei, msg.sender);
    }

    function removeNFTFromSale(uint256 tokenId) public onlyTokenOwner(tokenId) {
        require(tokenPrices[tokenId] > 0, "NFT is not listed for sale");

        tokenPrices[tokenId] = 0;
        tokenSellers[tokenId] = address(0);
    }

    function buyNFT(uint256 tokenId, address recipient) public payable {
        uint256 price = tokenPrices[tokenId];
        address seller = tokenSellers[tokenId];

        require(msg.value >= price, "Insufficient funds to buy NFT");
        require(seller != address(0), "NFT not for sale");

        tokenPrices[tokenId] = 0;
        tokenSellers[tokenId] = address(0);

        payable(seller).transfer(msg.value);

        _safeTransfer(seller, recipient, tokenId, "");

        emit TokenSold(tokenId, msg.value, recipient);
    }

    function getAllTokens() public view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            tokenIds[i] = i;
        }
        return tokenIds;
    }

    function getTokensForSale() public view returns (uint256[] memory) {
        uint256[] memory temp = new uint256[](tokenCounter);
        uint256 count = 0;

        for (uint256 i = 0; i < tokenCounter; i++) {
            if (tokenPrices[i] > 0) {
                temp[count] = i;
                count++;
            }
        }

        uint256[] memory forSaleTokens = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            forSaleTokens[i] = temp[i];
        }

        return forSaleTokens;
    }
}
