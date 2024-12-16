import { ethers } from "ethers";
import { useState, useEffect } from "react";
import CollectionPreview from "../components/CollectionPreview";
import { getTokenCounter } from "../utils/contract";
import { connectWallet, disconnectWallet } from "../utils/metamask";
import "../styles/pages/Home.scss";

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
      <section className="main-content">
        <div>
          <div className="text-section">
            <h1>Where digital art meets fiat payments</h1>
          </div>
          <div className="circle-div">
            <img className="circle circlegreen" src="/greencircle.svg" alt="" />
            <img className="circle circlemint" src="/mintcircle.svg" alt="" />
          </div>
        </div>

        <div className="image-div">
          <img
            src="/abstractuniverse1.png"
            alt="Art 1"
            className="image1"
          />
          <img
            src="/abstractuniverse2.png"
            alt="Art 2"
            className="image2"
          />
        </div>
      </section>

      {!address && <button onClick={handleConnect}>Connect</button>}
      {address && (
        <>
          <button onClick={handleDisconnect}>Disconnect</button>
          <p>{address}</p>
          {/* <WertCheckout address={address} contractAddress={contractAddress} tokenId={tokenId}/> */}
          <CollectionPreview
            collectionName="Abstract Universe"
            imageURL="https://gateway.pinata.cloud/ipfs/QmExampleHash/0.png"
            mintPriceInWei={ethers.parseEther("0.1").toString()} // Exempel: 0.1 ETH
          />
        </>
      )}
      {tokenCounter && <p>{tokenCounter}</p>}
    </div>
  );
};

export default Home;
