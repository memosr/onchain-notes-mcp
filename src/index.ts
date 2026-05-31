#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { createNote, createNoteSchema } from "./tools/createNote.js";
import { listNotes, listNotesSchema } from "./tools/listNotes.js";
import { updateNote, updateNoteSchema } from "./tools/updateNote.js";
import { deleteNote, deleteNoteSchema } from "./tools/deleteNote.js";
import { getNoteCount, getNoteCountSchema } from "./tools/getNoteCount.js";

const server = new Server(
  {
    name: "onchain-notes-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    createNoteSchema,
    listNotesSchema,
    updateNoteSchema,
    deleteNoteSchema,
    getNoteCountSchema,
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "create_note": {
        const { title, content } = args as { title: string; content: string };
        const result = await createNote(title, content);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "list_notes": {
        const result = await listNotes();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "update_note": {
        const { noteId, title, content } = args as {
          noteId: number;
          title: string;
          content: string;
        };
        const result = await updateNote(noteId, title, content);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "delete_note": {
        const { noteId } = args as { noteId: number };
        const result = await deleteNote(noteId);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "get_note_count": {
        const result = await getNoteCount();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP servers communicate over stdio — no console.log here
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err.message}\n`);
  process.exit(1);
});
