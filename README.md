# ADVA Code 🚀

[English](README.en.md) | 简体中文

[![Fork](https://img.shields.io/badge/fork-Claude%20Code-2563eb)](README.md)
[![Status](https://img.shields.io/badge/status-restored%20%2B%20customized-10b981)](README.md)
[![Runtime](https://img.shields.io/badge/runtime-Bun%201.3.5%2B-3b82f6)](README.md)
[![Config](https://img.shields.io/badge/config-~%2F.adva-8b5cf6)](README.md)
[![Package](https://img.shields.io/badge/package-%40adva--code%2Fcli-0f766e)](README.md)
[![API](https://img.shields.io/badge/API-OpenAI%20%2B%20Anthropic-10b981)](README.md)

> 一个会写代码的 AI 助手，现在有了自己的个性 🤖✨

ADVA Code 是一个基于恢复源码树继续维护和定制的 Claude Code 分支。它不是官方仓库，也不是简单的镜像，而是一个充满个性的"魔改版"——就像给你的 AI 助手换了一套新衣服，还教了它几招新技能。

## 🎯 你能得到什么

- **独立空间**：`~/.adva` 配置目录，和原版 Claude Code 井水不犯河水
- **开发利器**：Bun + TypeScript + Ink 的现代化 CLI/TUI 开发环境
- **萌宠伴侣**：内置完整的 Buddy 宠物系统，增加中英双语支持、外观定制、属性加点
- **无限可能**：可继续扩展的命令、工具、桥接和 shim 结构
- **🔑 API 自由**：支持 OpenAI 格式 API key，不再局限于 Anthropic（重要！）

## 🏗️ 项目结构

```
ADVA-Code/
├── src/                          # 主源码目录（大脑所在）
│   ├── bootstrap-entry.ts        # 启动入口（大门）
│   ├── main.tsx                  # 主程序入口（客厅）
│   ├── dev-entry.ts              # 开发模式入口（后门）
│   ├── commands/                 # 斜杠命令实现（工具箱）
│   │   ├── install-slack-app/    # Slack 应用安装
│   │   ├── install-github-app/   # GitHub 应用安装
│   │   └── ...                   # 更多命令
│   ├── components/               # Ink/React 终端组件（家具）
│   │   ├── App.tsx               # 顶层应用组件
│   │   ├── REPL.tsx              # 交互式命令行界面
│   │   ├── design-system/        # 设计系统组件
│   │   ├── tasks/                # 任务相关组件
│   │   └── ...                   # 更多组件
│   ├── services/                 # 运行期服务（管家）
│   │   ├── mcp/                  # MCP 客户端服务
│   │   ├── tools/                # 工具执行服务
│   │   ├── analytics/            # 分析服务
│   │   ├── plugins/              # 插件服务
│   │   └── ...                   # 更多服务
│   ├── tools/                    # 工具层实现（工具库）
│   │   ├── BashTool/             # Bash 命令工具
│   │   ├── FileEditTool/         # 文件编辑工具
│   │   ├── FileReadTool/         # 文件读取工具
│   │   ├── AgentTool/            # 代理工具
│   │   └── ...                   # 更多工具
│   ├── cli/                      # CLI 相关功能（控制台）
│   │   ├── handlers/             # CLI 处理器
│   │   ├── transports/           # 传输层
│   │   ├── print.ts              # 打印功能
│   │   └── ...                   # 更多 CLI 功能
│   ├── transports/               # 传输层（通信管道）
│   │   ├── Transport.ts          # 传输接口
│   │   ├── WebSocketTransport.ts # WebSocket 传输
│   │   ├── SSETransport.ts       # SSE 传输
│   │   └── ...                   # 更多传输方式
│   ├── state/                    # 状态管理（记忆）
│   │   ├── AppState.ts           # 应用状态
│   │   └── ...                   # 更多状态管理
│   ├── screens/                  # 界面（房间）
│   │   ├── REPL.tsx              # REPL 界面
│   │   ├── Doctor.tsx            # 诊断界面
│   │   └── ...                   # 更多界面
│   └── utils/                    # 工具函数（瑞士军刀）
│       ├── config.ts             # 配置管理
│       ├── messages.ts           # 消息处理
│       ├── sessionStorage.ts     # 会话存储
│       ├── ide.ts                # IDE 集成
│       └── ...                   # 更多工具函数
├── shims/                        # 本地 shim 包（适配器）
├── vendor/                       # 恢复或兼容相关代码（备用零件）
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
└── README.md                     # 你正在看的文件
```

## 📊 当前状态

- **包名**：`@adva-code/cli`
- **默认命令名**：`adva`
- **当前版本**：`999.0.0-ADVA`（版本号不重要，重要的是态度）
- **主入口**：`src/bootstrap-entry.ts`
- **运行方式**：源码直跑为主（就像喝手磨咖啡）

## 🛠️ 环境要求

- Bun >= 1.3.5
- Node.js >= 24
- Windows、macOS、Linux 终端环境

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/BlcaCola/ADVA-Code.git
cd ADVA-Code

# 2. 安装依赖
bun install

# 3. 验证安装
bun run version

# 4. 启动应用
bun run dev
```
Windows使用`install.bat`可以快速配置环境。
就这么简单，三步走完，你就能拥有一个会写代码的 AI 助手！

## 🎮 常用命令

```bash
# 启动 CLI/TUI（主菜）
bun run dev

# 同上（别名，方便懒人）
bun run start

# 查看版本（确认身份）
bun run version

# 恢复检查（体检）
bun run dev:restore-check
```

## 🌍 全局安装

想让 `adva` 命令随叫随到？

```bash
bun install
bun link
adva
```

更新代码后记得重新 `bun link`，不然你用的还是旧版本（就像穿了昨天的衣服）。

## 📁 配置与数据目录

ADVA Code 有自己的小天地：

**全局配置**：
- `~/.adva`（大本营）
- `~/.adva/.claude.json`（全局配置文件，包含 API 设置）
- `~/.adva/settings.json`（用户设置文件）
- `~/.adva/agents`（代理们住的地方）
- `~/.adva/agent-memory`（代理们的记忆）

**项目配置**：
- `.claude/settings.json`（项目设置）
- `.claude/settings.local.json`（本地设置，不提交）
- `.adva/skills`（技能目录）
- `.adva/agents`（项目代理）

这样设计的目的很直接：**井水不犯河水**。这个分支和原版 Claude Code 的配置、认证、缓存完全隔离，就像两个独立的房间。

**重要提示**：
- API 配置（`customApiEndpoint`）应该在 `~/.adva/.claude.json` 中设置
- 用户级别的其他设置在 `~/.adva/settings.json` 中
- 项目级别的设置在 `.claude/settings.json` 中

## 🔑 API 配置（重要！）

### ⚡ OpenAI API 支持

这是 ADVA Code 与原版 Claude Code 的一个**重要区别**：

- **原版 Claude Code**：只支持 Anthropic API
- **ADVA Code**：支持 OpenAI 格式 API key，让你有更多选择！

目标行为是：

- 内部程序仍按 Anthropic Messages 模式组织请求
- 当选择 OpenAI API 格式时，由中间层把 Messages 请求改写成 Chat Completions 请求
- 远端返回 Chat Completions 流后，再由中间层回转成内部可消费的 Messages 风格流事件

这意味着它不是简单改一个 Base URL，而是协议级别的输入输出流转接。

当前状态：

- API 格式选择界面与配置持久化已加入
- OpenAI 兼容转接模块正在迭代中
- 目前仍属于开发中功能，可能出现流式事件不完整、消息映射异常、部分工具调用兼容不足等情况
- 如果你只是想稳定使用，建议优先走 Anthropic 兼容接口模式；如果你在测试 OpenAI 格式，请把它视为实验功能。

### 配置方式

**配置文件**

编辑 `~/.adva/.claude.json`：

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

**交互式配置**

启动 ADVA Code 后使用 `/config` 命令进行交互式配置。

### 支持的 API 提供商

- ✅ **OpenAI**（官方）
- ✅ **Azure OpenAI**
- ✅ **其他 OpenAI 兼容 API**（如 DeepSeek、智谱等）
- ✅ **Anthropic**

### 为什么这很重要？

1. **成本控制**：OpenAI API 通常比 Anthropic 更便宜
2. **模型选择**：可以使用 GPT-4、GPT-3.5 等多种模型
3. **灵活性**：不局限于单一提供商，可以随时切换
4. **本地部署**：支持本地部署的 OpenAI 兼容服务

### 注意事项

- 使用 OpenAI API 时，请确保你的 API key 有足够的额度
- 不同提供商的模型能力可能有所差异
- 建议在测试环境先验证配置是否正确

## 🐾 Buddy 宠物系统

Buddy 是你的 AI 伴侣，已经做了深度定制：

- **状态面板**：`/buddy status` 查看详细状态
- **语言切换**：`/buddy language en|zh` 中英双语随意切换
- **外观定制**：`/buddy species robot` 换个物种
- **属性加点**：`/buddy stat DEBUGGING 100` 提升技能
- **闪光特效**：`/buddy shiny on` 开启闪光模式

**常用命令示例**：

```text
/buddy status              # 查看状态
/buddy help                # 查看帮助
/buddy language zh         # 切换中文
/buddy species robot       # 变成机器人
/buddy shiny on            # 开启闪光
/buddy stat DEBUGGING 100  # 调试技能拉满
```

## 💻 开发说明

这个仓库目前没有完整的测试矩阵（别指望有 CI/CD 流水线）。更现实的验证方式：

1. 先跑 `bun run version`，确认程序还能起（基本体检）
2. 再跑 `bun run dev`，手动验证你改到的路径（功能测试）
3. 对具体模块做窄范围检查（精准打击）

## 🎯 适合什么用途

- **学习**：研究恢复后的 Claude Code 类 CLI/TUI 结构
- **开发**：把它当作二次开发底座，打造你自己的 AI 助手
- **魔改**：继续添加新功能，让它变得更强大

## ⚠️ 注意事项

- 这不是官方仓库（是魔改版）
- 不应假设它和官方版本逐行、逐功能一致（有自己的想法）
- **重要**：支持 OpenAI 格式 API key，这是与原版的主要区别之一
- 使用前请确认许可证（遵守规则）

## 📜 许可证

项目根目录包含 `LICENSE` 文件。使用和分发前，请先自行确认当前分支与上游相关内容的适用范围。

## 🔗 仓库地址

<https://github.com/BlcaCola/ADVA-Code>

---

**Made with ❤️ by ADVA Code Team**

*让编程变得更有趣* 🎉
