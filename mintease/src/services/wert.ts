import WertWidget from "@wert-io/widget-initializer";

const partnerId = import.meta.env.VITE_WERT_PARTNER_ID;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

interface WertConfig {
  commodity_amount: number;
  sc_input_data: string;
  signature: string;
  redirect_url?: string;
  click_id?: string;
  listeners?: object;
}

export const mintWithWert = ({
  commodity_amount,
  sc_input_data,
  signature,
}: WertConfig) => {
  const wertWidget = new WertWidget({
    partner_id: partnerId, // Korrekt namn på parametern
    origin: "https://sandbox.wert.io", // Ange ursprung för sandbox-miljö
    commodity: "ETH", // Kryptovaluta (kan vara ETH, BTC, etc.)
    network: "sepolia", // Blockkedjanätverk (t.ex. sepolia, mainnet)
    commodity_amount, // Mängden kryptovaluta
    sc_address: contractAddress, // Smarta kontraktets adress
    sc_input_data, // Indata för smart kontrakt
    signature, // Digital signatur
  });

  console.log(wertWidget);

  // Öppna widgeten
  wertWidget.open();
};
