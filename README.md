# onchain-notes-mcp

MCP server for [Onchain Notes](https://onchain-notes.vercel.app) — a fully on-chain note-taking dApp on Base mainnet. Connect any MCP-compatible AI client (Claude Desktop, Cursor, etc.) and manage your notes with natural language.

## Features

- **create_note** — Write a new note to the blockchain
- **list_notes** — Fetch all your notes
- **update_note** — Edit an existing note by ID
- **delete_note** — Permanently remove a note by ID
- **get_note_count** — Count your stored notes

All write operations append a builder attribution suffix (`memosr.base.eth`) to the calldata.

---

## Quick Install

```bash
npm install -g onchain-notes-mcp
```

Or run directly without installing:

```bash
npx onchain-notes-mcp
```

---

## Claude Desktop Setup

Open your Claude Desktop config file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following entry under `mcpServers`:

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

Restart Claude Desktop. You should see the onchain-notes tools available.

---

## Cursor Setup

In your Cursor MCP settings (`.cursor/mcp.json` or global config):

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

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PRIVATE_KEY` | Yes | Your wallet's private key (with or without `0x` prefix) |

---

## Security

### Private Key Handling

- Your private key **never leaves your machine** — it is read from the `env` block in your local MCP config and used only to sign transactions locally via ethers.js.
- The MCP server process runs locally; no key material is sent to any server or third party.
- **Never commit your private key** to version control.
- Consider using a dedicated wallet with only the ETH needed for gas — not your main wallet.

### Recommended: Dedicated Wallet

Create a fresh wallet just for AI agent use:

```bash
# Generate a new wallet with ethers.js or cast
cast wallet new
```

Fund it with a small amount of ETH on Base for gas fees (~$1 worth is plenty for hundreds of notes).

---

## Example Prompts

Once configured in Claude Desktop, try:

```
Save a note titled "Meeting prep" with content about tomorrow's standup agenda.
```

```
Show me all my on-chain notes.
```

```
Update note #3 with a new title "Q2 Goals" and add my updated objectives.
```

```
Delete note #7.
```

```
How many notes do I have stored on-chain?
```

---

## Network Details

- **Network**: Base mainnet
- **Chain ID**: 8453
- **Contract**: [`0xc9ccC404749895Cf45691897429e130E0a418200`](https://basescan.org/address/0xc9ccC404749895Cf45691897429e130E0a418200)
- **RPC fallbacks**:
  - https://base.llamarpc.com
  - https://base-rpc.publicnode.com
  - https://mainnet.base.org

---

## Builder Attribution

All write transactions include a builder code suffix in the calldata, attributing usage to **memosr.base.eth** via the Onchain Notes builder registry.

---

## Development

```bash
git clone https://github.com/memosr/onchain-notes-mcp.git
cd onchain-notes-mcp
npm install
npm run build
PRIVATE_KEY=0x... node dist/index.js
```

---

## Links

- Live dApp: https://onchain-notes.vercel.app
- Contract on Basescan: https://basescan.org/address/0xc9ccC404749895Cf45691897429e130E0a418200
- MCP Protocol: https://modelcontextprotocol.io

---

## License

MIT — [memosr](https://github.com/memosr)
