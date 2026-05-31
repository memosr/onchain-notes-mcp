# onchain-notes-mcp

[![npm version](https://img.shields.io/npm/v/onchain-notes-mcp?color=blue)](https://www.npmjs.com/package/onchain-notes-mcp)
[![npm downloads](https://img.shields.io/npm/dm/onchain-notes-mcp)](https://www.npmjs.com/package/onchain-notes-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base Mainnet](https://img.shields.io/badge/Base-Mainnet-0052FF?logo=base&logoColor=white)](https://base.org)

MCP server for reading and writing onchain notes on Base mainnet.

---

## What is this?

[MCP (Model Context Protocol)](https://modelcontextprotocol.io) is an open standard that lets AI clients like Claude Desktop and Cursor call external tools. This package exposes an MCP server that connects those clients to [Onchain Notes](https://onchain-notes.vercel.app) — a note-taking dApp deployed on Base mainnet.

Notes are stored entirely on-chain. No backend, no database — just your wallet and the contract.

---

## Usage

Once configured, you can use natural language in Claude Desktop or Cursor:

```
Save a note titled "Meeting prep" about today's standup agenda.
```

```
Show me all my onchain notes.
```

```
Update note #3 with a new title "Q2 Goals" and my revised objectives.
```

```
Delete note #5.
```

```
How many notes do I have stored on-chain?
```

---

## Installation

**Option 1 — npx (recommended)**

No install needed. Add it to your MCP config and it runs on demand.

**Option 2 — Global install**

```bash
npm install -g onchain-notes-mcp
```

**Option 3 — Build from source**

```bash
git clone https://github.com/memosr/onchain-notes-mcp.git
cd onchain-notes-mcp
npm install
npm run build
PRIVATE_KEY=0x... node dist/index.js
```

---

## Configuration

### Claude Desktop

Config file location:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add under `mcpServers`:

```json
{
  "mcpServers": {
    "onchain-notes": {
      "command": "npx",
      "args": ["onchain-notes-mcp"],
      "env": {
        "PRIVATE_KEY": "your_private_key_here"
      }
    }
  }
}
```

Restart Claude Desktop after saving.

### Cursor

In `.cursor/mcp.json` or your global MCP settings:

```json
{
  "mcpServers": {
    "onchain-notes": {
      "command": "npx",
      "args": ["onchain-notes-mcp"],
      "env": {
        "PRIVATE_KEY": "your_private_key_here"
      }
    }
  }
}
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `PRIVATE_KEY` | Yes | Your wallet's private key (with or without `0x` prefix) |

---

## Available tools

| Tool | Type | Description |
|---|---|---|
| `create_note` | Write | Create a new note on-chain |
| `list_notes` | Read | Fetch all notes for your wallet |
| `update_note` | Write | Edit an existing note by ID |
| `delete_note` | Write | Permanently remove a note by ID |
| `get_note_count` | Read | Return the total number of your notes |

### Schemas

**`create_note`**
```json
{
  "title": "string (max 100 chars, required)",
  "content": "string (max 5000 chars, required)"
}
```

**`list_notes`**
```json
{}
```
Returns an array of `{ id, title, content }` objects for the connected wallet.

**`update_note`**
```json
{
  "noteId": "number (required)",
  "title": "string (max 100 chars, required)",
  "content": "string (max 5000 chars, required)"
}
```

**`delete_note`**
```json
{
  "noteId": "number (required)"
}
```

**`get_note_count`**
```json
{}
```
Returns `{ count, message }`.

---

## Security

Your private key never leaves your machine. It's read from the `env` block in your local MCP config, used only to sign transactions locally via ethers.js, and never sent anywhere.

A few things worth doing:

- Don't commit your private key to version control.
- Use a dedicated wallet with a small ETH balance rather than your main wallet. A few dollars of ETH on Base covers hundreds of transactions.

```bash
# Generate a fresh wallet with Foundry's cast
cast wallet new
```

Fund the new address with a small amount of ETH on Base for gas, then use that key in the config.

All write transactions include a builder code suffix in the calldata. This attributes usage to **memosr.base.eth** via the Onchain Notes builder registry and doesn't affect transaction behavior or note data.

---

## Network details

- **Network**: Base Mainnet (Chain ID: 8453)
- **Contract**: [`0xc9ccC404749895Cf45691897429e130E0a418200`](https://basescan.org/address/0xc9ccC404749895Cf45691897429e130E0a418200)
- **RPC** (used automatically with fallback): `base.llamarpc.com`, `base-rpc.publicnode.com`, `mainnet.base.org`

Gas fees for note operations are typically a fraction of a cent.

---

## Contributing

```bash
git clone https://github.com/memosr/onchain-notes-mcp.git
cd onchain-notes-mcp
npm install
npm run build
```

Open an [issue](https://github.com/memosr/onchain-notes-mcp/issues) for bugs or feature requests.

---

## License

MIT — see [LICENSE](./LICENSE)

---

Built by memosr.base.eth. Open to PRs and issues.
