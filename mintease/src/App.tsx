import { useEffect, useState } from "react";
import "./styles/App.scss";
import { connectWallet, disconnectWallet } from "./utils/metamask";
import WertCheckout from "./components/WertCheckout/WertCheckout";
import { getTokenCounter } from "./utils/contract";

function App() {
const [address, setAddress] = useState<null | string>(null)
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
}, [])

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
const tokenId = "1";

  const handleConnect = async () => {
    const result = await connectWallet()
    setAddress(result)
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setAddress(null)
  }

  return (
    <div className="app">
      <h1>MintEase</h1>
      {!address && <button onClick={handleConnect}>Connect</button>}
      {address && 
      <>
      <button onClick={handleDisconnect}>Disconnect</button>
      <p>{address}</p>
      <WertCheckout address={address} contractAddress={contractAddress} tokenId={tokenId}/>
      </>}
      {tokenCounter && <p>{tokenCounter}</p>}
    </div>
  );
}

export default App;
