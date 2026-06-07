{
        "permissions": {
                "allow": [],
                "deny" : [],
                "ask": []
        },
        "additionalDirectories": [],
        // Default permission mode for session
        // "default" = Prompt on first use of each tool
        // "acceptEdits" = Auto accept file edits, prompt for others
        // "plan" = Read only Claude can analyze but not modify anything
        // "bypassPermissions" = Skip all prompts (only use in safe/sandboxed environments)
        "defaultMode": "default",
        // "default" = recommended model for your account
        // "sonnet" = latest sonnet
        // "opus" = latest opus
        // "haiku" = Fast lightweight Haiku
        // "sonnet[1m] = sonnet with 1 million token context window
        // "opusplan" = Opus for planning sonnet for execution
        "model": "sonnet",
        "apiKeyHelper": "/path/to/script.sh", // helpful for rotating creds
        "env": {
                "NODE_ENV": "development"
        },
        // Hooks
        // list of hooks`
        // Sandbox
        "sandbox" : {
                "enabled": true,

        }
}