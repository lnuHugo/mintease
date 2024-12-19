import { useEffect, useState } from "react";
import NftCard from "../components/NftCard";
import "../styles/pages/Marketplace.scss";
import { buyNFT, getNFTsForSale } from "../utils/contract";

const Marketplace = () => {
  const [nftsForSale, setNftsForSale] = useState<any[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const nfts = await getNFTsForSale();
      console.log(nfts);
      setNftsForSale(nfts);
    };
    fetchListings();
  }, []);

  const handleBuyNFT = async (tokenId: number) => {
    console.log(typeof tokenId);

    try {
      await buyNFT(tokenId);
      alert(`NFT with tokenId ${tokenId} purchased successfully!`);
      setNftsForSale((prevNfts) =>
        prevNfts.filter((nft) => nft.tokenId !== tokenId)
      );
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      alert("Failed to purchase NFT. See console for details.");
    }
  };

  return (
    <div className="marketplace">
      <h3>Nfts for Sale</h3>
      <div className="filter-div">
        <div className="sort">
          <p>Price low to high</p>
          <img src="/nav-arrow-down.svg" alt="" />
        </div>
        <div className="icon">
          <img src="/2x2-cell.svg" alt="" />
        </div>
        <div className="icon">
          <img src="/table-rows.svg" alt="" />
        </div>
        <div className="icon">
          <img src="/table.svg" alt="" />
        </div>
      </div>
      {nftsForSale.length > 0 ? (
        nftsForSale.map((nft, index) => (
          <NftCard
            key={index}
            nft={nft}
            buttonText="Buy Now"
            onButtonClick={() => handleBuyNFT(Number(nft.tokenId))}
          />
        ))
      ) : (
        <p>No NFTs for sale.</p>
      )}
    </div>
  );
};

export default Marketplace;
