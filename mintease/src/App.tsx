import { useState } from "react";
import "./styles/App.scss";
import { connectWallet, disconnectWallet } from "./utils/metamask";
import WertCheckout from "./components/WertCheckout/WertCheckout";

function App() {
const [address, setAddress] = useState<null | string>(null)

const contractAddress = "0x456...def"; // ERC-721-kontraktadress
const tokenId = "1"; // Token ID för NFT:n

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
    </div>
  );
}

export default App;
