import WertWidget from "@wert-io/widget-initializer";

const partnerId = import.meta.env.VITE_WERT_PARTNER_ID;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

interface WertConfig {
  commodity_amount: number;
  sc_input_data: string;
  signature: string;
  address: string;
  redirect_url?: string;
  click_id?: string;
  listeners?: object;
}

const extra = {
  item_info: {
    author: "MintEase",
    author_image_url:
      "https://gateway.pinata.cloud/ipfs/bafkreiai3byzljvttel7ufjtu3oep4hfkljhzpyxpjnickosqbv4hxqaq4",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmRU4pAAWQrDzvsgSvnQm14fi5odcF9vCBkpUZjJNfeh4c",
    name: "Abstract Universe NFT",
    category: "Abstract Universe",
  },
};

export const mintWithWert = ({
  commodity_amount,
  sc_input_data,
  signature,
  address,
}: WertConfig) => {
  const wertWidget = new WertWidget({
    partner_id: partnerId,
    origin: "https://sandbox.wert.io",
    address: address,
    commodity: "ETH",
    network: "sepolia",
    commodity_amount: commodity_amount,
    sc_address: contractAddress,
    sc_input_data: sc_input_data,
    signature: signature,
    extra: extra,
  });

  console.log(wertWidget);

  wertWidget.open();
};

export const buyWithWert = (
  { commodity_amount, sc_input_data, signature, address }: WertConfig,
  details: object
) => {
  const wertWidget = new WertWidget({
    partner_id: partnerId,
    origin: "https://sandbox.wert.io",
    address: address,
    commodity: "ETH",
    network: "sepolia",
    commodity_amount: commodity_amount,
    sc_address: contractAddress,
    sc_input_data: sc_input_data,
    signature: signature,
    extra: details,
  });

  console.log(wertWidget);

  wertWidget.open();
};
