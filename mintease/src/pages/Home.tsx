import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { getTokenCounter } from "../utils/contract";
import { connectWallet, disconnectWallet } from "../utils/metamask";
import "../styles/pages/Home.scss";
import MintCard from "../components/MintCard";

const Home = () => {
  const [address, setAddress] = useState<null | string>(null);
  const [tokenCounter, setTokenCounter] = useState<number | null>(null);

  useEffect(() => {
    const fetchTokenCounter = async () => {
      try {
        const counter = await getTokenCounter();

        setTokenCounter(counter);
      } catch (error) {
        console.error("Error fetching token counter:", error);
      }
    };

    fetchTokenCounter();
  }, []);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const tokenId = "1";

  const handleConnect = async () => {
    const result = await connectWallet();
    setAddress(result);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setAddress(null);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="text">
          <h1>
            Mint Your <span className="nft">NFT</span>
            <br /> with <span>Ease</span>
          </h1>
          <p>
            The simplest platform to mint and purchase NFTs using fiat payments.
            No crypto wallet? No problem.
          </p>
        </div>
        <div className="buttons">
          <button className="btn-standard">Explore Collection</button>
          <button className="btn-outline">List Artwork</button>
        </div>
      </section>
      <section className="mint-section">
        <h2>Get Started with Abstract Universe</h2>
        <MintCard
          collectionName="Abstract Universe"
          imageURL="https://gateway.pinata.cloud/ipfs/QmRU4pAAWQrDzvsgSvnQm14fi5odcF9vCBkpUZjJNfeh4c"
          mintPriceInWei={ethers.parseEther("0.1").toString()} // Exempel: 0.1 ETH
        />
      </section>
      {!address && <button onClick={handleConnect}>Connect</button>}
      {address && (
        <>
          <button onClick={handleDisconnect}>Disconnect</button>
          <p>{address}</p>
          {/* <WertCheckout address={address} contractAddress={contractAddress} tokenId={tokenId}/> */}
        </>
      )}
      {tokenCounter && <p>{tokenCounter}</p>}
    </div>
  );
};

export default Home;
