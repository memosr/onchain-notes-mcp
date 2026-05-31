import { getReadContract, getSigner, Note } from "../contract.js";

export const getNoteCountSchema = {
  name: "get_note_count",
  description:
    "Get the total number of notes stored on-chain for the connected wallet on Onchain Notes (Base mainnet). Read-only.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export async function getNoteCount(): Promise<{
  count: number;
  message: string;
}> {
  const signer = await getSigner();
  const contract = await getReadContract();

  const rawNotes: Note[] = await contract.getMyNotes.staticCall({
    from: signer.address,
  });

  const count = rawNotes.length;
  return {
    count,
    message: `You have ${count} note${count !== 1 ? "s" : ""} stored on-chain.`,
  };
}
