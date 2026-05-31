import { getReadContract, getSigner, Note } from "../contract.js";

export const listNotesSchema = {
  name: "list_notes",
  description:
    "List all notes stored on-chain for the connected wallet on Onchain Notes (Base mainnet). Read-only.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export type NoteResult = {
  id: number;
  title: string;
  content: string;
  timestamp: number;
  date: string;
};

export async function listNotes(): Promise<{
  notes: NoteResult[];
  count: number;
}> {
  // Need the wallet address to query — use a read contract called from the
  // signer's address via getMyNotes() (msg.sender on the contract)
  const signer = await getSigner();
  const contract = await getReadContract();

  const rawNotes: Note[] = await contract.getMyNotes.staticCall({
    from: signer.address,
  });

  const notes: NoteResult[] = rawNotes.map((note) => ({
    id: Number(note.id),
    title: note.title,
    content: note.content,
    timestamp: Number(note.timestamp),
    date: new Date(Number(note.timestamp) * 1000).toISOString(),
  }));

  return { notes, count: notes.length };
}
