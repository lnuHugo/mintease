import { useEffect, useState } from "react";
import NftCard from "../components/NftCard";
import "../styles/pages/Marketplace.scss";
import { buyNFT, getNFTsForSale } from "../utils/contract";

const Marketplace = () => {
  const [nftsForSale, setNftsForSale] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchListings = async () => {
      const nfts = await getNFTsForSale();
      console.log(nfts);
      setNftsForSale(nfts);
    };
    fetchListings();
  }, []);

  const sortNfts = () => {
    const sortedNfts = [...nftsForSale].sort((a, b) => {
      const priceA = parseFloat(a.price || "0");
      const priceB = parseFloat(b.price || "0");

      if (sortOrder === "asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

    setNftsForSale(sortedNfts);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  const handleBuyNFT = async (tokenId: number) => {
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
        <div className="sort" onClick={sortNfts}>
          <p>
            {sortOrder === "asc" ? "Price low to high" : "Price high to low"}
          </p>
          <img
            src={
              sortOrder === "asc" ? "/nav-arrow-down.svg" : "/nav-arrow-up.svg"
            }
            alt=""
          />
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
      <div className="card-grid">
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
    </div>
  );
};

export default Marketplace;
