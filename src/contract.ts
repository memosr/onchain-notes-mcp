import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0xc9ccC404749895Cf45691897429e130E0a418200";
export const CHAIN_ID = 8453; // Base mainnet

// Appended to all write transaction calldata for builder attribution (memosr.base.eth)
export const BUILDER_CODE =
  "0x62635f717975683568306a0b0080218021802180218021802180218021";

export const RPC_URLS = [
  "https://base.llamarpc.com",
  "https://base-rpc.publicnode.com",
  "https://mainnet.base.org",
];

export const ABI = [
  {
    name: "createNote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title", type: "string" },
      { name: "content", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "updateNote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "title", type: "string" },
      { name: "content", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "deleteNote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getMyNotes",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "title", type: "string" },
          { name: "content", type: "string" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
] as const;

export type Note = {
  id: bigint;
  title: string;
  content: string;
  timestamp: bigint;
};

/** Returns the first responsive RPC provider. */
export async function getProvider(): Promise<ethers.JsonRpcProvider> {
  for (const url of RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getBlockNumber();
      return provider;
    } catch {
      // try next
    }
  }
  throw new Error(
    "All RPC endpoints are unreachable. Check your network connection."
  );
}

/** Returns a signer loaded from the PRIVATE_KEY env var. */
export async function getSigner(): Promise<ethers.Wallet> {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "PRIVATE_KEY environment variable is not set. " +
        "Add it to your Claude Desktop MCP config under `env`."
    );
  }

  const key = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  const provider = await getProvider();
  const wallet = new ethers.Wallet(key, provider);

  const network = await provider.getNetwork();
  if (Number(network.chainId) !== CHAIN_ID) {
    throw new Error(
      `Wrong network. Connected to chainId ${network.chainId}, expected ${CHAIN_ID} (Base mainnet).`
    );
  }

  return wallet;
}

/** Returns a read-only contract instance. */
export async function getReadContract(): Promise<ethers.Contract> {
  const provider = await getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

/** Returns a writable contract instance backed by the user's signer. */
export async function getWriteContract(): Promise<ethers.Contract> {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}

/**
 * Appends BUILDER_CODE bytes to the encoded calldata.
 * The builder suffix is raw bytes (not ABI-encoded), so we strip the "0x"
 * prefix from BUILDER_CODE before concatenating.
 */
export function appendBuilderCode(calldata: string): string {
  const suffix = BUILDER_CODE.startsWith("0x")
    ? BUILDER_CODE.slice(2)
    : BUILDER_CODE;
  return calldata + suffix;
}
