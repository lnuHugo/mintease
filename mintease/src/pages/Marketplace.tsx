import { useEffect, useState } from "react";
import NftCard from "../components/NftCard";
import "../styles/pages/Marketplace.scss";
import { buyNFT, getNFTsForSale } from "../utils/contract";
import { useWallet } from "../context/WalletContext";
import { connectWallet } from "../utils/metamask";

const Marketplace = () => {
  const [nftsForSale, setNftsForSale] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [grid, setGrid] = useState("small");
  const { signer, setSigner } = useWallet();

  useEffect(() => {
    const fetchListings = async () => {
      const nfts = await getNFTsForSale();
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
      let activeSigner = signer;

      if (!activeSigner) {
        const signer = await connectWallet();
        if (!signer) return;
        activeSigner = signer;
        setSigner(signer);
      }

      await buyNFT(tokenId, activeSigner);
      setNftsForSale((prevNfts) =>
        prevNfts.filter((nft) => nft.tokenId !== tokenId)
      );
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      alert("Failed to purchase NFT. See console for details.");
    }
  };

  return (
    <section className="marketplace">
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
        <div className="icons">
          <div
            className={`icon ${grid === "small" ? "active" : ""}`}
            onClick={() => setGrid("small")}
          >
            <img src="/2x2-cell.svg" alt="Small grid layout" />
          </div>
          <div
            className={`icon ${grid === "row" ? "active" : ""}`}
            onClick={() => setGrid("row")}
          >
            <img src="/table-rows.svg" alt="Row layout" />
          </div>
        </div>
      </div>
      <div className={`card-grid ${grid}`}>
        {nftsForSale.length > 0 ? (
          nftsForSale.map((nft, index) => (
            <NftCard
              key={index}
              nft={nft}
              buttonText="Buy Now"
              onButtonClick={() => handleBuyNFT(Number(nft.tokenId))}
              format={grid}
            />
          ))
        ) : (
          <p>No NFTs for sale.</p>
        )}
      </div>
    </section>
  );
};

export default Marketplace;
