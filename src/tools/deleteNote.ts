import { ethers } from "ethers";
import {
  ABI,
  appendBuilderCode,
  getWriteContract,
  CONTRACT_ADDRESS,
} from "../contract.js";

export const deleteNoteSchema = {
  name: "delete_note",
  description:
    "Permanently delete a note on Onchain Notes (Base mainnet) by its ID. This action cannot be undone.",
  inputSchema: {
    type: "object" as const,
    properties: {
      noteId: {
        type: "number",
        description: "The on-chain ID of the note to delete",
      },
    },
    required: ["noteId"],
  },
};

export async function deleteNote(
  noteId: number
): Promise<{ txHash: string; message: string }> {
  const contract = await getWriteContract();
  const signer = contract.runner as ethers.Wallet;

  const iface = new ethers.Interface(ABI);
  const encoded = iface.encodeFunctionData("deleteNote", [BigInt(noteId)]);
  const dataWithBuilder = appendBuilderCode(encoded);

  const tx = await signer.sendTransaction({
    to: CONTRACT_ADDRESS,
    data: dataWithBuilder,
  });

  await tx.wait();

  return {
    txHash: tx.hash,
    message: `Note #${noteId} deleted successfully. Transaction: ${tx.hash}`,
  };
}
