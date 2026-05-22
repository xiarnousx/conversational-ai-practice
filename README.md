# Practicing Conversational AI with Claude - Level 3

# Building Implementaions for MCP Server in Python

## Area of focus

- Transport
- Tools
- Promot

# FYI MCP Server Layers:

- Message Protocol
- Transport
- Tools
- Resources
- Prompt
- Roots
- Sampling


# MCP Inspector:

- npx @modelcontextprotocol/inspector@latest
- command:
```bash
uv --directory /home/ihab/PoC/conversational-ai/weather_mcp run server.py
```

# To Connect From Claude Desktop App

```json
{
"mcpServers": {
    "weather": {
      "command": "wsl.exe",
      "args": [
        "--",
        "bash",
        "-c",
        "/home/ihab/.nvm/versions/node/v20.18.0/bin/node /home/ihab/PoC/conversational-ai/weather_mcp_nodejs/index.js"
      ]
    }
  }
  ...
}
```
