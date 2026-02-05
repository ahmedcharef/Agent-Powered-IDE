# Langfuse Integration Setup Guide

This project already has Langfuse integration configured for Cursor hooks. Follow these steps to complete the setup.

## What's Already Configured

✅ **Hook Handler**: Located at `.cursor/hooks/hook-handler.js`  
✅ **Dependencies**: Installed (`langfuse` and `dotenv`)  
✅ **Hook Configuration**: `.cursor/hooks.json` is set up with all 12 hooks  
✅ **Handler Modules**: All handler logic is in `.cursor/hooks/lib/`

## Setup Steps

### 1. Create a Langfuse Account

1. Go to [https://cloud.langfuse.com](https://cloud.langfuse.com) (or your self-hosted instance)
2. Sign up for a free account
3. Create a new project (or use the default)

### 2. Get Your API Keys

1. In Langfuse, go to **Settings** → **API Keys**
2. Copy your **Secret Key** (starts with `sk-lf-...`)
3. Copy your **Public Key** (starts with `pk-lf-...`)

### 3. Create Environment File

Create a `.env` file in the project root with your Langfuse credentials:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add your keys:

```env
# Langfuse Configuration
LANGFUSE_SECRET_KEY=sk-lf-your-secret-key-here
LANGFUSE_PUBLIC_KEY=pk-lf-your-public-key-here
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

**Note**: If you're using a self-hosted Langfuse instance, update `LANGFUSE_BASE_URL` accordingly.

### 4. Verify the Setup

The integration will automatically start working once you:
1. Have the `.env` file with valid credentials
2. Restart Cursor (to reload hooks)

## How It Works

### Automatic Tracing

Every time you interact with Cursor's AI agent, the hooks capture:

- **User Prompts**: What you ask the agent
- **Agent Responses**: The agent's replies
- **Agent Thinking**: Internal reasoning (if available)
- **File Operations**: Files read and edited
- **Shell Commands**: Commands executed
- **MCP Tool Calls**: Model Context Protocol operations
- **Session Completion**: Status and efficiency metrics

### Trace Structure

- **Trace**: One per conversation (grouped by `conversation_id`)
- **Session**: Grouped by workspace folder name
- **Generations**: User prompts and agent responses
- **Spans**: File operations, shell commands, MCP calls, thinking
- **Scores**: Completion status (0-1) and efficiency metrics

### Automatic Tagging

Traces are automatically tagged with:
- `cursor` - All traces
- `agent` or `tab` - Based on hook source
- `shell` - Shell command activity
- `mcp` - MCP tool usage
- `file-ops` - File read/write operations
- `thinking` - Agent reasoning captured
- Model name (e.g., `claude-3-5-sonnet`)
- `status-completed`, `status-aborted`, `status-error`

## Viewing Traces

1. Log in to your Langfuse dashboard
2. Navigate to **Traces**
3. Filter by:
   - **Session** (workspace name)
   - **Tags** (e.g., `cursor`, `agent`, `shell`)
   - **User** (if `user_email` is available)
4. Click on a trace to see:
   - Full conversation flow
   - All spans (file edits, commands, etc.)
   - Metadata and scores
   - Timeline of events

## Supported Hooks

| Hook | Description |
|------|-------------|
| `beforeSubmitPrompt` | Captures user prompts and attachments |
| `afterAgentResponse` | Records agent responses |
| `afterAgentThought` | Logs agent thinking/reasoning |
| `beforeShellExecution` | Tracks shell commands before execution |
| `afterShellExecution` | Captures shell command output |
| `beforeMCPExecution` | Logs MCP tool calls |
| `afterMCPExecution` | Records MCP tool results |
| `beforeReadFile` | Tracks file read operations |
| `afterFileEdit` | Captures file edits with line statistics |
| `stop` | Records session completion with status scores |
| `beforeTabFileRead` | Tab mode file reads |
| `afterTabFileEdit` | Tab mode file edits |

## Troubleshooting

### Traces Not Appearing

1. **Check `.env` file exists** in project root
   ```bash
   ls -la .env
   ```

2. **Verify credentials are correct**
   - Keys should start with `sk-lf-` and `pk-lf-`
   - No extra spaces or quotes

3. **Check Cursor console for errors**
   - Open Cursor's developer console
   - Look for `[Langfuse Hook]` error messages

4. **Test the hook handler manually**
   ```bash
   cd .cursor/hooks
   echo '{"hook_event_name":"test"}' | node hook-handler.js
   ```

### Hook Errors in Cursor

The handler is designed to fail gracefully:
- Errors are logged but don't block Cursor
- A permissive response is always returned
- Cursor operations continue normally

If you see errors:
- Check Node.js version (should be 18+)
- Verify dependencies are installed: `cd .cursor/hooks && npm install`
- Check file permissions on hook-handler.js

### Environment Variables Not Loading

The hook handler looks for `.env` in:
1. Project root (3 levels up from `.cursor/hooks/lib/`)
2. Current working directory (fallback)

Make sure your `.env` file is in the project root directory.

## Advanced Configuration

### Custom Base URL

For self-hosted Langfuse:
```env
LANGFUSE_BASE_URL=https://your-langfuse-instance.com
```

### Disabling Specific Hooks

Edit `.cursor/hooks.json` and remove hooks you don't want to track.

### Custom Metadata

The handlers automatically capture metadata. To add custom metadata, edit:
- `.cursor/hooks/lib/handlers.js` - Hook-specific handlers
- `.cursor/hooks/lib/langfuse-client.js` - Trace creation

## Project Structure

```
.cursor/
  hooks.json              # Cursor hooks configuration
  hooks/
    hook-handler.js       # Main entry point
    package.json          # Dependencies
    lib/
      langfuse-client.js  # Langfuse SDK wrapper
      handlers.js         # Hook-specific handlers
      utils.js            # Utility functions
.env                      # Your Langfuse credentials (create this)
```

## Next Steps

1. ✅ Create `.env` file with your Langfuse keys
2. ✅ Restart Cursor
3. ✅ Start using Cursor's AI features
4. ✅ Check Langfuse dashboard for traces

## Resources

- [Langfuse Documentation](https://langfuse.com/docs)
- [Cursor Hooks Documentation](https://cursor.com/docs/agent/hooks)
- [Langfuse GitHub](https://github.com/langfuse/langfuse)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Cursor's developer console for errors
3. Verify your Langfuse account is active
4. Check that your API keys have the correct permissions
