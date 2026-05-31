import { ethers } from "ethers";
import {
  ABI,
  appendBuilderCode,
  getWriteContract,
  CONTRACT_ADDRESS,
} from "../contract.js";

export const updateNoteSchema = {
  name: "update_note",
  description:
    "Update an existing note on Onchain Notes (Base mainnet) by its ID.",
  inputSchema: {
    type: "object" as const,
    properties: {
      noteId: {
        type: "number",
        description: "The on-chain ID of the note to update",
      },
      title: {
        type: "string",
        description: "New title for the note (max 100 characters)",
        maxLength: 100,
      },
      content: {
        type: "string",
        description: "New content for the note (max 5000 characters)",
        maxLength: 5000,
      },
    },
    required: ["noteId", "title", "content"],
  },
};

export async function updateNote(
  noteId: number,
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

  const iface = new ethers.Interface(ABI);
  const encoded = iface.encodeFunctionData("updateNote", [
    BigInt(noteId),
    title,
    content,
  ]);
  const dataWithBuilder = appendBuilderCode(encoded);

  const tx = await signer.sendTransaction({
    to: CONTRACT_ADDRESS,
    data: dataWithBuilder,
  });

  await tx.wait();

  return {
    txHash: tx.hash,
    message: `Note #${noteId} updated successfully. Transaction: ${tx.hash}`,
  };
}
