# Strategy 1: Writing Context and persistent memory

Writing context in the context folder and a script in the scripts folder to add dynamic context based on branch name or user input

# Strategy 2: Intelligent context retrieval

Claude code automatically looks through folders to find helpful context files. If in sub folder also pull files from parent folder.
Also, before editing a file it checks the existing code style and function name and also make sure that the file exists which are relevant to edit tools.
In addition, it remembers different things, such as tool existance etc...

# Strategy 3: Compression of Context

Claude Code provide built in compression commands:

```
/clear command resets the conversation history for the current context window
keep the project and user memory
```

```
/compact command summarizes the existing ocoversation into a shorter form.
```


# Strategy 4: Context isolation with subagents

Each sub-agent runs in its own isolated context window and does not inherit the full conversation history of the main agent.