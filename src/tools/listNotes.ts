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
  owner: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  createdDate: string;
  updatedDate: string;
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
    owner: note.owner,
    title: note.title,
    content: note.content,
    createdAt: Number(note.createdAt),
    updatedAt: Number(note.updatedAt),
    createdDate: new Date(Number(note.createdAt) * 1000).toISOString(),
    updatedDate: new Date(Number(note.updatedAt) * 1000).toISOString(),
  }));

  return { notes, count: notes.length };
}
