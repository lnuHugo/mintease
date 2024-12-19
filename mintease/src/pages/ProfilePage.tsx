import { useEffect, useState } from "react";
import "../styles/pages/ProfilePage.scss";
import {
  getOwnedNFTs,
  getNFTsForSaleByOwner,
  setNFTForSale,
  removeNFTFromSale,
} from "../utils/contract";
import { NFT } from "../data/interface";

const ProfilePage = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [nftsForSale, setNftsForSale] = useState<NFT[]>([]);
  const [prices, setPrices] = useState<{ [tokenId: string]: string }>({});
  const [submittingTokenId, setSubmittingTokenId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const ownedNFTs = await getOwnedNFTs(userAddress);
        setNfts(ownedNFTs);

        const forSaleNFTs = await getNFTsForSaleByOwner(userAddress);

        setNftsForSale(forSaleNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    fetchNFTs();
  }, [nfts]);

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

  const handleRemoveFromSale = async (tokenId: number) => {
    setIsSubmitting(true);
    try {
      await removeNFTFromSale(tokenId);
      alert(`NFT with tokenId ${tokenId} removed from sale.`);

      setNfts((prevNfts) =>
        prevNfts.map((nft) =>
          Number(nft.tokenId) === tokenId ? { ...nft, price: null } : nft
        )
      );
    } catch (error) {
      alert("Failed to remove NFT from sale. See console for details.");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="profile-page">
      <div className="nft-section">
        <h2>Your NFTs</h2>
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

      <div className="nft-section">
        <h2>NFTs for Sale</h2>
        <div className="nft-grid">
          {nftsForSale.length > 0 ? (
            nftsForSale.map((nft, index) => (
              <div key={index} className="nft-card">
                <img
                  src={nft.metadata.image}
                  alt={nft.metadata.name}
                  className="nft-image"
                />
                <h3>{nft.metadata.name}</h3>
                <p>Price: {nft.price} ETH</p>
                <button
                  onClick={() => handleRemoveFromSale(Number(nft.tokenId))} // Använd en omslagsfunktion
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Removing..." : "Remove from Sale"}
                </button>
              </div>
            ))
          ) : (
            <p>No NFTs for sale.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
