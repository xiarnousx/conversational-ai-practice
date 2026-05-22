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