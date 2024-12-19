export interface NFT {
  tokenId: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
  price?: string | null;
}
