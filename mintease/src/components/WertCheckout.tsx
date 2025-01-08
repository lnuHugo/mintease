import React, { useEffect, useRef } from "react";

interface WertCheckoutProps {
  address: string;
  contractAddress: string;
  tokenId: string;
}

const WertCheckout: React.FC<WertCheckoutProps> = ({
  address,
  contractAddress,
  tokenId,
}) => {
  const partnerId = import.meta.env.VITE_WERT_PARTNER_ID;
  const chainId = import.meta.env.VITE_CHAIN_ID;
  const widgetRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!partnerId || !chainId) {
      console.error("Missing Wert configuration in environment variables.");
      return;
    }

    const wertOptions = {
      partner_id: partnerId,
      origin: "https://sandbox.wert.io",
      address: address,
      commodity: "nft",
      commodity_amount: "0.01",
      contract_address: contractAddress,
      token_id: tokenId,
      chain_id: chainId,
    };

    const urlParams = new URLSearchParams(wertOptions).toString();
    const checkoutUrl = `https://sandbox.wert.io?${urlParams}`;

    if (widgetRef.current) {
      widgetRef.current.src = checkoutUrl;
    }
  }, [address, contractAddress, tokenId, partnerId, chainId]);

  return (
    <iframe
      ref={widgetRef}
      style={{
        width: "420px",
        height: "720px",
        border: "none",
      }}
    />
  );
};

export default WertCheckout;
