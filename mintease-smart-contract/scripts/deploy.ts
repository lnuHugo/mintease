import { ethers } from "ethers";
import { config } from "dotenv";
import abi from "../artifacts/contracts/AbstractUniverse.sol/AbstractUniverse.json";

config();

async function main() {
  const predefinedURIs = [
    "https://gateway.pinata.cloud/ipfs/QmR7mZdjawmz6rsT2thrqpbniuuT1bKc2CJoCMPVXeoPXW",
    "https://gateway.pinata.cloud/ipfs/QmdGg2nHbU62UTdWqZ9u7pLiYDE8Qss2hoFQ2f4e8YycvZ",
    "https://gateway.pinata.cloud/ipfs/QmZkPAsjZsSmfVsb7PQUHE2hZfKfdqbg7hmJf3DQXcuXGh",
    "https://gateway.pinata.cloud/ipfs/QmeCXArEcnyYbsxVmCiTtqUQZCz8iAxHxSnwhZJKJqPTPW",
    "https://gateway.pinata.cloud/ipfs/QmVy6JTmugVrC5EdvznxQwoxKRoVykaMA7b4VRwva9qbfG",
    "https://gateway.pinata.cloud/ipfs/QmRjs47zT1LsZ2npBCGnPCpTWeP7TGGc8KxyY4mMkLKiZa",
    "https://gateway.pinata.cloud/ipfs/QmUvhiyb7jVobtNMYZrNvwpnWrN4oTPPj69nq8bNXQdWsc",
    "https://gateway.pinata.cloud/ipfs/QmfQo92216JeyiA9TKeatfDHLsTvga3fERPdbczZm4QWTD",
    "https://gateway.pinata.cloud/ipfs/QmUo1DuEbALkUwixM1wkuvQzVVFRZijiywwCXLZ1MmbQFh",
    "https://gateway.pinata.cloud/ipfs/QmcWmNdeqrvpVT6c9tYEQtjDfpSqWrZimKSdSmSjAZajrd",
    "https://gateway.pinata.cloud/ipfs/QmUQZRCpXYz5XmCCe6QCKCcF4Em5Fc9234rRdnWyGNGvv2",
    "https://gateway.pinata.cloud/ipfs/QmX843qqskVKKz63LMBSzGDN1KyB5bDPot2LfsdEBBbQzG",
    "https://gateway.pinata.cloud/ipfs/QmRLFgEZBErMitP7Z8tQazDfruJLK5J2HxJjUhumg8KReB",
    "https://gateway.pinata.cloud/ipfs/QmYvHqGEoiebdkR2w4DAFThEGD5A7etj4C7gDQk7kB8fGj",
    "https://gateway.pinata.cloud/ipfs/QmWUgpPgSaMXkbqExC8curqZxDukJocdiiWkRXv7ZxQ4DG",
    "https://gateway.pinata.cloud/ipfs/QmfJ6KPLKHF5avUddSVXB5cgyQMWktqe1F7FsmXm6XmE1e",
    "https://gateway.pinata.cloud/ipfs/QmQmGVxKkUhpXWDokjjSNW3q8pXoNjyX6VFBLbsQDzFhvr",
    "https://gateway.pinata.cloud/ipfs/QmS4ofJkp5kBXLthoWXGwn2fUJHHTNUS7j6cW92ZLyj9rP",
    "https://gateway.pinata.cloud/ipfs/QmUXfW4VjraSCzg37nfWrDrrthT78SQdFmjEUTFrrHDAeU",
    "https://gateway.pinata.cloud/ipfs/QmSW97WvsqL1yaQKrUoWq6GL1voiCz4Y8MRWGohusErdno",
  ];

  const rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
  const privateKey = process.env.PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error(
      "SEPOLIA_RPC_URL and PRIVATE_KEY must be defined in .env file"
    );
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const factory = new ethers.ContractFactory(abi.abi, abi.bytecode, wallet);

  const contract = await factory.deploy(
    "0xEf412930Dd0B2b7bc8121F7333b0d4d09659a553",
    20,
    ethers.parseEther("0.01"),
    predefinedURIs
  );

  const receipt = await contract.waitForDeployment();
  console.log("Contract deployed to:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
