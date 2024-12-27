import { useEffect, useState } from "react";
import "../styles/pages/ProfilePage.scss";
import {
  getOwnedNFTs,
  getNFTsForSaleByOwner,
  setNFTForSale,
  removeNFTFromSale,
} from "../utils/contract";
import { NFT } from "../data/interface";
import { useWallet } from "../context/WalletContext";
// import { getAddress } from "ethers";

const ProfilePage = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [nftsForSale, setNftsForSale] = useState<NFT[]>([]);
  const [prices, setPrices] = useState<{ [tokenId: string]: string }>({});
  const [submittingTokenId, setSubmittingTokenId] = useState<string | null>(
    null
  );
  const [removingTokenId, setRemovingTokenId] = useState<string | null>(null);
  const { signer } = useWallet();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        if (!signer) {
          setNfts([]);
          setNftsForSale([]);
          return;
        }

        const address = await signer.getAddress();
        const ownedNFTs = await getOwnedNFTs(address);
        const forSaleNFTs = await getNFTsForSaleByOwner(address);

        const notForSaleNFTs = ownedNFTs.filter(
          (nft) =>
            !forSaleNFTs.some((saleNft) => saleNft.tokenId === nft.tokenId)
        );

        setNfts(notForSaleNFTs);
        setNftsForSale(forSaleNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    fetchNFTs();
  }, [signer]);

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

      await setNFTForSale(parseInt(id), price);
      alert(`NFT with tokenId ${id} is now listed for ${price} ETH.`);
      setNfts((prevNfts) => prevNfts.filter((nft) => nft.tokenId !== id));
setNftsForSale((prevNftsForSale) => [
  ...prevNftsForSale,
  { ...nfts.find((nft) => nft.tokenId === id)!, price },
]);
    } catch (error) {
      alert("Failed to list NFT for sale. See console for details.");
      console.error(error);
    } finally {
      setSubmittingTokenId(null);
    }
  };

  const handleRemoveFromSale = async (tokenId: number) => {
    setRemovingTokenId(tokenId.toString());
    try {
      await removeNFTFromSale(tokenId);
      alert(`NFT with tokenId ${tokenId} removed from sale.`);

      setNftsForSale((prevNfts) =>
        prevNfts.filter((nft) => Number(nft.tokenId) !== tokenId)
      );
    } catch (error) {
      alert("Failed to remove NFT from sale. See console for details.");
      console.error(error);
    } finally {
      setRemovingTokenId(null);
      setNftsForSale((prevNfts) =>
        prevNfts.filter((nft) => Number(nft.tokenId) !== tokenId)
      );
      const nftToAddBack = nftsForSale.find((nft) => Number(nft.tokenId) === tokenId);
    if (nftToAddBack) {
      setNfts((prevNfts) => [...prevNfts, nftToAddBack]);
    }
    }
  };

  return (
    <div className="profile-page">
      <div className="nft-section">
        <h2>Your NFTs</h2>
        {!signer && <p>Please log in to see your NFTs</p>}
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
        <h2>Your NFTs for Sale</h2>
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
                  onClick={() => handleRemoveFromSale(Number(nft.tokenId))}
                  disabled={removingTokenId === nft.tokenId.toString()}
                >
                  {removingTokenId === nft.tokenId.toString()
                    ? "Removing..."
                    : "Remove from Sale"}
                </button>
              </div>
            ))
          ) : (
            <p>You have no listed NFTs for sale.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
