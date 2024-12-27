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
    partner_id: partnerId, 
    origin: "https://sandbox.wert.io",
    commodity: "ETH",
    network: "sepolia",
    commodity_amount,
    sc_address: contractAddress,
    sc_input_data,
    signature,
  });

  console.log(wertWidget);

  wertWidget.open();
};
