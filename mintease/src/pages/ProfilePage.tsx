import { useEffect, useState } from "react";
import "../styles/pages/ProfilePage.scss";
import { getOwnedNFTs, setNFTForSale } from "../utils/contract";
import { NFT } from "../data/interface";

const ProfilePage = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [prices, setPrices] = useState<{ [tokenId: string]: string }>({});
  const [submittingTokenId, setSubmittingTokenId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getNfts = async () => {
      try {
        const nfts = await getOwnedNFTs(
          "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        );
        setNfts(nfts);
      } catch (error) {
        console.error(error);
      }
    };
    getNfts();
  }, []);

  const handlePriceChange = (tokenId: string, value: string) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [tokenId]: value,
    }));
  };

  const handleSubmit = async (id: string) => {
    try {
      setSubmittingTokenId(id);
      const price = prices[id];
      if (!price) {
        alert("Please enter a price before submitting.");
        return;
      }

      await setNFTForSale(parseInt(id), price); // Konvertera tokenId till nummer om det krävs i kontraktet
      alert(`NFT with tokenId ${id} is now listed for ${price} ETH.`);
    } catch (error) {
      alert("Failed to list NFT for sale. See console for details.");
      console.error(error);
    } finally {
      setSubmittingTokenId(null);
    }
  };

  return (
    <div className="profile-page">
      <div className="open-listings"></div>
      <div className="nft-grid">
        {nfts &&
          nfts.map((nft, index) => (
            <div key={index} className="nft-card">
              <img
                src={nft.metadata.image}
                alt={nft.metadata.name}
                className="nft-image"
              />
              <h3>{nft.metadata.name}</h3>
              <div className="sell-div">
                <input
                  type="number"
                  placeholder="Enter price in ETH"
                  step={0.01}
                  min={0}
                  value={prices[nft.tokenId] || ""}
                  onChange={(e) =>
                    handlePriceChange(nft.tokenId, e.target.value)
                  }
                  disabled={submittingTokenId === nft.tokenId}
                />
                <button
                  onClick={() => handleSubmit(nft.tokenId)}
                  disabled={
                    submittingTokenId === nft.tokenId || !prices[nft.tokenId]
                  }
                >
                  {submittingTokenId === nft.tokenId
                    ? "Submitting..."
                    : "List for Sale"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProfilePage;
