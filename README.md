# onchain-notes-mcp

[![npm version](https://img.shields.io/npm/v/onchain-notes-mcp?color=blue)](https://www.npmjs.com/package/onchain-notes-mcp)
[![npm downloads](https://img.shields.io/npm/dm/onchain-notes-mcp)](https://www.npmjs.com/package/onchain-notes-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base Mainnet](https://img.shields.io/badge/Base-Mainnet-0052FF?logo=base&logoColor=white)](https://base.org)

**MCP server that lets AI agents write, read, and manage onchain notes on Base via natural language.**

---

## What is this?

[MCP (Model Context Protocol)](https://modelcontextprotocol.io) is an open standard that lets AI clients like Claude Desktop and Cursor call external tools. This package exposes an MCP server that connects those AI clients to [Onchain Notes](https://onchain-notes.vercel.app) — a fully on-chain note-taking dApp deployed on Base mainnet.

**Onchain Notes** stores your notes as permanent, verifiable records on the Base blockchain. No backend, no database, no central server — just your wallet and the chain.

**Put together:** you open Claude, type `"Save a note about my project ideas"`, and the AI calls this MCP server, which signs and broadcasts a transaction to Base on your behalf. Your note is now on-chain.

---

## 🎬 Example Usage

Once configured, try these prompts in Claude Desktop or Cursor:

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

## 📦 Installation

### Option 1 — Run directly with npx (recommended)

No install required. Just add it to your MCP client config (see below) and it runs on demand:

```bash
npx onchain-notes-mcp
```

### Option 2 — Global install

```bash
npm install -g onchain-notes-mcp
```

### Option 3 — Build from source

```bash
git clone https://github.com/memosr/onchain-notes-mcp.git
cd onchain-notes-mcp
npm install
npm run build
PRIVATE_KEY=0x... node dist/index.js
```

---

## ⚙️ Client Configuration

### Claude Desktop

Open your config file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following under `mcpServers`:

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

Restart Claude Desktop — the onchain-notes tools will appear automatically.

### Cursor

In your Cursor MCP config (`.cursor/mcp.json` or global MCP settings):

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

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PRIVATE_KEY` | Yes | Your wallet's private key (with or without `0x` prefix) |

---

## 🛠️ Available Tools

| Tool | Type | Description |
|---|---|---|
| `create_note` | Write | Create a new note on-chain |
| `list_notes` | Read | Fetch all notes for your wallet |
| `update_note` | Write | Edit an existing note by ID |
| `delete_note` | Write | Permanently remove a note by ID |
| `get_note_count` | Read | Return the total number of your notes |

### Tool Schemas

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

## 🔐 Security

### Non-custodial design

Your private key **never leaves your machine**. It is read from the `env` block in your local MCP config file, used only to sign transactions locally via ethers.js, and never transmitted to any remote server or third party.

### Best practices

- **Never commit your private key** to version control.
- Store it only in your local MCP config file, which should never be shared or checked in.
- Use a **dedicated wallet** with a small ETH balance just for this MCP server — not your main wallet. A few dollars of ETH on Base covers hundreds of transactions.

```bash
# Generate a fresh wallet with Foundry's cast
cast wallet new
```

Fund the new address with a small amount of ETH on Base for gas, then use only that key in the MCP config.

### Builder Code attribution

All write transactions include a builder code suffix appended to the calldata. This attributes usage to **memosr.base.eth** via the Onchain Notes builder registry and does not affect transaction behavior or your note data.

---

## 🌐 About Base

[Base](https://base.org) is an Ethereum L2 built by Coinbase. It offers fast, low-cost transactions with full EVM compatibility and Ethereum-grade security. Gas fees for note operations are typically a fraction of a cent.

- **Network**: Base Mainnet
- **Chain ID**: 8453
- **Contract**: [`0xc9ccC404749895Cf45691897429e130E0a418200`](https://basescan.org/address/0xc9ccC404749895Cf45691897429e130E0a418200)
- **RPC endpoints** (used automatically with fallback):
  - `https://base.llamarpc.com`
  - `https://base-rpc.publicnode.com`
  - `https://mainnet.base.org`

---

## 🤝 Contributing

PRs are welcome. If you find a bug or want to request a feature, please [open an issue](https://github.com/memosr/onchain-notes-mcp/issues) with as much context as possible.

```bash
git clone https://github.com/memosr/onchain-notes-mcp.git
cd onchain-notes-mcp
npm install
npm run build
```

---

## 📝 License

MIT — see [LICENSE](./LICENSE)

---

Built with ❤️ by [memosr.base.eth](https://onchain-notes.vercel.app) · [Farcaster @memosr](https://warpcast.com/memosr) · [Live dApp](https://onchain-notes.vercel.app)
