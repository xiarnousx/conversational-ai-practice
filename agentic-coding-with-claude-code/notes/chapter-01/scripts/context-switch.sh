#!/bin/bash
# context-switch.sh — Claude Code UserPromptSubmit hook.
# Appends @context imports to CLAUDE.md based on the current git branch
# and keywords in the submitted prompt.

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CLAUDE_MD="$PROJECT_DIR/CLAUDE.md"

# Create CLAUDE.md if it doesn't exist
if [ ! -f "$CLAUDE_MD" ]; then
    echo "Creating $CLAUDE_MD..."
    touch "$CLAUDE_MD"
fi

add_context() {
    local context="$1"
    grep -qxF "$context" "$CLAUDE_MD" && return
    # Ensure the file ends with a newline before appending, otherwise the
    # import line would get glued onto the previous line's text.
    [ -s "$CLAUDE_MD" ] && [ -z "$(tail -c1 "$CLAUDE_MD")" ] || echo >> "$CLAUDE_MD"
    echo "$context" >> "$CLAUDE_MD"
}

# Branch-based context
branch=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null)

case "$branch" in
    "feature/auth-"*)
        add_context "@./context/auth-system.md"
        ;;
    "feature/payment-"*)
        add_context "@./context/payment-flow.md"
        ;;
    "hotfix/"*)
        add_context "@./context/production-hotfix.md"
        ;;
    *)
        echo "No specific context for branch: $branch"
        ;;
esac

# --- Query-Based Context ---
user_input="$1"

if [[ -z "$user_input" ]]; then
    exit 0
fi

if [[ $user_input == *"database"* || $user_input == *"migration"* ]]; then
    add_context "@./context/database-context.md"
elif [[ $user_input == *"API"* || $user_input == *"endpoint"* ]]; then
    add_context "@./context/api-context.md"
elif [[ $user_input == *"frontend"* || $user_input == *"component"* ]]; then
    add_context "@./context/frontend-context.md"
fi