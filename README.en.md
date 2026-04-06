# ADVA Code 🚀

English | [简体中文](README.md)

[![Fork](https://img.shields.io/badge/fork-Claude%20Code-2563eb)](README.md)
[![Status](https://img.shields.io/badge/status-restored%20%2B%20customized-10b981)](README.md)
[![Runtime](https://img.shields.io/badge/runtime-Bun%201.3.5%2B-3b82f6)](README.md)
[![Config](https://img.shields.io/badge/config-~%2F.adva-8b5cf6)](README.md)
[![Package](https://img.shields.io/badge/package-%40adva--code%2Fcli-0f766e)](README.md)
[![API](https://img.shields.io/badge/API-OpenAI%20%2B%20Anthropic-10b981)](README.md)

> An AI coding assistant with its own personality 🤖✨

ADVA Code is a fork of Claude Code that continues to be maintained and customized based on a restored source tree. It's not an official repository or a simple mirror, but a "modded version" full of personality—like giving your AI assistant a new outfit and teaching it some new tricks.

## 🎯 What You Get

- **Independent Space**: `~/.adva` configuration directory, completely separate from the original Claude Code
- **Development Tools**: Modern CLI/TUI development environment with Bun + TypeScript + Ink
- **Pet Companion**: Built-in complete Buddy pet system with bilingual (Chinese/English) support, appearance customization, and stat allocation
- **Infinite Possibilities**: Extensible command, tool, bridge, and shim structure
- **🔑 API Freedom**: Support for OpenAI format API keys, no longer limited to Anthropic (Important!)

## 🏗️ Project Structure

```
ADVA-Code/
├── src/                          # Main source directory (where the brain lives)
│   ├── bootstrap-entry.ts        # Bootstrap entry (the front door)
│   ├── main.tsx                  # Main program entry (the living room)
│   ├── dev-entry.ts              # Development mode entry (the back door)
│   ├── commands/                 # Slash command implementations (toolbox)
│   │   ├── install-slack-app/    # Slack app installation
│   │   ├── install-github-app/   # GitHub app installation
│   │   └── ...                   # More commands
│   ├── components/               # Ink/React terminal components (furniture)
│   │   ├── App.tsx               # Top-level app component
│   │   ├── REPL.tsx              # Interactive command line interface
│   │   ├── design-system/        # Design system components
│   │   ├── tasks/                # Task-related components
│   │   └── ...                   # More components
│   ├── services/                 # Runtime services (butler)
│   │   ├── mcp/                  # MCP client services
│   │   ├── tools/                # Tool execution services
│   │   ├── analytics/            # Analytics services
│   │   ├── plugins/              # Plugin services
│   │   └── ...                   # More services
│   ├── tools/                    # Tool layer implementations (tool library)
│   │   ├── BashTool/             # Bash command tool
│   │   ├── FileEditTool/         # File editing tool
│   │   ├── FileReadTool/         # File reading tool
│   │   ├── AgentTool/            # Agent tool
│   │   └── ...                   # More tools
│   ├── cli/                      # CLI-related functionality (console)
│   │   ├── handlers/             # CLI handlers
│   │   ├── transports/           # Transport layer
│   │   ├── print.ts              # Printing functionality
│   │   └── ...                   # More CLI functionality
│   ├── transports/               # Transport layer (communication pipes)
│   │   ├── Transport.ts          # Transport interface
│   │   ├── WebSocketTransport.ts # WebSocket transport
│   │   ├── SSETransport.ts       # SSE transport
│   │   └── ...                   # More transport methods
│   ├── state/                    # State management (memory)
│   │   ├── AppState.ts           # Application state
│   │   └── ...                   # More state management
│   ├── screens/                  # Screens (rooms)
│   │   ├── REPL.tsx              # REPL screen
│   │   ├── Doctor.tsx            # Diagnostic screen
│   │   └── ...                   # More screens
│   └── utils/                    # Utility functions (Swiss Army knife)
│       ├── config.ts             # Configuration management
│       ├── messages.ts           # Message handling
│       ├── sessionStorage.ts     # Session storage
│       ├── ide.ts                # IDE integration
│       └── ...                   # More utility functions
├── shims/                        # Local shim packages (adapters)
├── vendor/                       # Restored or compatibility-related code (spare parts)
├── package.json                  # Project configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # The file you're reading
```

## 📊 Current Status

- **Package Name**: `@adva-code/cli`
- **Default Command Name**: `adva`
- **Current Version**: `999.0.0-ADVA` (Version number doesn't matter, attitude does)
- **Main Entry**: `src/bootstrap-entry.ts`
- **Running Mode**: Primarily source code direct execution (like drinking hand-ground coffee)

## 🛠️ Requirements

- Bun >= 1.3.5
- Node.js >= 24
- Windows, macOS, or Linux terminal environment

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/BlcaCola/ADVA-Code.git
cd ADVA-Code

# 2. Install dependencies
bun install

# 3. Verify installation
bun run version

# 4. Start the application
bun run dev
```
On Windows, use `install.bat` for quick environment setup.
That's it—three simple steps and you'll have an AI coding assistant!

## 🎮 Common Commands

```bash
# Start CLI/TUI (main course)
bun run dev

# Same as above (alias, for the lazy)
bun run start

# View version (confirm identity)
bun run version

# Restore check (health checkup)
bun run dev:restore-check
```

## 🌍 Global Installation

Want the `adva` command available everywhere?

```bash
bun install
bun link
adva
```

Remember to run `bun link` again after updating the code, or you'll still be using the old version (like wearing yesterday's clothes).

## 📁 Configuration & Data Directories

ADVA Code has its own little world:

**Global Configuration**:
- `~/.adva` (headquarters)
- `~/.adva/.claude.json` (global configuration file, includes API settings)
- `~/.adva/settings.json` (user settings file)
- `~/.adva/agents` (where agents live)
- `~/.adva/agent-memory` (agents' memories)

**Project Configuration**:
- `.claude/settings.json` (project settings)
- `.claude/settings.local.json` (local settings, not committed)
- `.adva/skills` (skills directory)
- `.adva/agents` (project agents)

The purpose of this design is straightforward: **separation of concerns**. This fork's configuration, authentication, and cache are completely isolated from the original Claude Code, like two separate rooms.

**Important Notes**:
- API configuration (`customApiEndpoint`) should be set in `~/.adva/.claude.json`
- Other user-level settings are in `~/.adva/settings.json`
- Project-level settings are in `.claude/settings.json`

## 🔑 API Configuration (Important!)

### ⚡ OpenAI API Support

This is a **key difference** between ADVA Code and the original Claude Code:

- **Original Claude Code**: Only supports Anthropic API
- **ADVA Code**: Supports OpenAI format API keys, giving you more choices!

The target behavior is:

- Internally, the program still organizes requests in Anthropic Messages mode
- When OpenAI API format is selected, a middleware layer rewrites Messages requests into Chat Completions requests
- After the remote returns Chat Completions stream, the middleware layer converts it back to internally consumable Messages-style stream events

This means it's not simply changing a Base URL, but protocol-level input/output bridging.

Current status:

- API format selection interface and configuration persistence have been added
- OpenAI compatibility bridging module is under iteration
- Currently still a feature in development; issues like incomplete streaming events, message mapping anomalies, or insufficient tool call compatibility may occur
- If you just want stable usage, prioritize the Anthropic-compatible interface mode; if you're testing OpenAI format, treat it as an experimental feature.

### Configuration Methods

**Configuration File**

Edit `~/.adva/.claude.json`:

```json
{
  "customApiEndpoint": {
    "provider": "openai",
    "baseURL": "https://api.openai.com/v1",
    "apiKey": "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
    "model": "gpt-4"
  }
}
```

**Interactive Configuration**

Use the `/config` command after starting ADVA Code for interactive configuration.

### Supported API Providers

- ✅ **OpenAI** (official)
- ✅ **Azure OpenAI**
- ✅ **Other OpenAI-compatible APIs** (such as DeepSeek, Zhipu, etc.)
- ✅ **Anthropic**

### Why Is This Important?

1. **Cost Control**: OpenAI API is usually cheaper than Anthropic
2. **Model Selection**: Can use various models like GPT-4, GPT-3.5, etc.
3. **Flexibility**: Not limited to a single provider, can switch anytime
4. **Local Deployment**: Supports locally deployed OpenAI-compatible services

### Notes

- When using OpenAI API, ensure your API key has sufficient quota
- Model capabilities may vary between different providers
- It's recommended to verify configuration in a test environment first

## 🐾 Buddy Pet System

Buddy is your AI companion, deeply customized:

- **Status Panel**: `/buddy status` to view detailed status
- **Language Switch**: `/buddy language en|zh` to switch between Chinese and English
- **Appearance Customization**: `/buddy species robot` to change species
- **Stat Allocation**: `/buddy stat DEBUGGING 100` to boost skills
- **Shiny Effect**: `/buddy shiny on` to enable shiny mode

**Common Command Examples**:

```text
/buddy status              # View status
/buddy help                # View help
/buddy language zh         # Switch to Chinese
/buddy species robot       # Become a robot
/buddy shiny on            # Enable shiny
/buddy stat DEBUGGING 100  # Max out debugging skill
```

## 💻 Development Notes

This repository currently doesn't have a complete test matrix (don't expect CI/CD pipelines). More realistic verification methods:

1. First run `bun run version` to confirm the program can start (basic health check)
2. Then run `bun run dev` to manually verify the path you modified (functional test)
3. Do narrow-range checks on specific modules (precision strike)

## 🎯 Suitable Use Cases

- **Learning**: Study the restored Claude Code-like CLI/TUI structure
- **Development**: Use it as a secondary development base to build your own AI assistant
- **Modding**: Continue adding new features to make it more powerful

## ⚠️ Important Notes

- This is not an official repository (it's a modded version)
- Don't assume it's line-by-line or feature-by-feature consistent with the official version (it has its own ideas)
- **Important**: Supports OpenAI format API keys, which is one of the main differences from the original
- Please confirm the license before use (follow the rules)

## 📜 License

The project root contains a `LICENSE` file. Before using and distributing, please confirm the applicable scope of the current branch and upstream-related content yourself.

## 🔗 Repository

<https://github.com/BlcaCola/ADVA-Code>

---

**Made with ❤️ by ADVA Code Team**

*Making coding more fun* 🎉
