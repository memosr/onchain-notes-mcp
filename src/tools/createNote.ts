import { ethers } from "ethers";
import {
  ABI,
  appendBuilderCode,
  getWriteContract,
  CONTRACT_ADDRESS,
} from "../contract.js";

export const createNoteSchema = {
  name: "create_note",
  description:
    "Create a new note on Onchain Notes (Base mainnet). Stores the note permanently on-chain.",
  inputSchema: {
    type: "object" as const,
    properties: {
      title: {
        type: "string",
        description: "Note title (max 100 characters)",
        maxLength: 100,
      },
      content: {
        type: "string",
        description: "Note content / body (max 5000 characters)",
        maxLength: 5000,
      },
    },
    required: ["title", "content"],
  },
};

export async function createNote(
  title: string,
  content: string
): Promise<{ txHash: string; message: string }> {
  if (title.length > 100) {
    throw new Error("Title exceeds 100 character limit.");
  }
  if (content.length > 5000) {
    throw new Error("Content exceeds 5000 character limit.");
  }

  const contract = await getWriteContract();
  const signer = contract.runner as ethers.Wallet;

  // Encode calldata then append builder attribution bytes
  const iface = new ethers.Interface(ABI);
  const encoded = iface.encodeFunctionData("createNote", [title, content]);
  const dataWithBuilder = appendBuilderCode(encoded);

  const tx = await signer.sendTransaction({
    to: CONTRACT_ADDRESS,
    data: dataWithBuilder,
  });

  await tx.wait();

  return {
    txHash: tx.hash,
    message: `Note "${title}" created successfully. Transaction: ${tx.hash}`,
  };
}
