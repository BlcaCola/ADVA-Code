# ADVA Code

[![Fork](https://img.shields.io/badge/fork-Claude%20Code-2563eb)](README.md)
[![Status](https://img.shields.io/badge/status-restored%20%2B%20customized-10b981)](README.md)
[![Runtime](https://img.shields.io/badge/runtime-Bun%201.3.5%2B-3b82f6)](README.md)
[![Config](https://img.shields.io/badge/config-~%2F.adva-8b5cf6)](README.md)
[![Package](https://img.shields.io/badge/package-%40adva--code%2Fcli-0f766e)](README.md)

ADVA Code 是一个基于恢复源码树继续维护和定制的 Claude Code 分支。适合本地开发、继续魔改和长期自维护。

这个仓库不是官方上游，也不是原始镜像。当前代码状态是“恢复工程 + 持续定制”的结合体，所以文档、行为和官方版本不完全一致。

## 你能得到什么

- 独立配置目录 `~/.adva`，避免和原版本地状态混用
- Bun + TypeScript + Ink 的 CLI/TUI 开发环境
- 内置定制的 Buddy 宠物系统，支持外观、属性、语言切换和状态面板
- 可继续扩展的命令、工具、桥接和 shim 结构

## 当前状态

- 包名：`@adva-code/cli`
- 默认命令名：`adva`
- 当前版本：`999.0.0-ADVA`
- 主入口：`src/bootstrap-entry.ts`
- 运行方式：源码直跑为主

## 环境要求

- Bun >= 1.3.5
- Node.js >= 24
- Windows、macOS、Linux 终端环境均可，当前仓库在 Windows 上也可直接通过批处理脚本启动

## 快速开始

```bash
git clone https://github.com/BlcaCola/ADVA-Code.git
cd ADVA-Code
bun install
bun run version
bun run dev
```

Windows 下如果你想直接双击启动，可以使用根目录里的 `start.bat`。

## 常用命令

```bash
bun run dev
```

启动当前源码树的 CLI/TUI。

```bash
bun run start
```

与 `dev` 指向同一入口。

```bash
bun run version
```

输出当前版本并做最窄启动校验。

```bash
bun run dev:restore-check
```

运行恢复相关的开发入口，适合排查恢复期逻辑或兼容层行为。

## 全局安装

如果你希望把当前源码注册成全局命令：

```bash
bun install
bun link
adva
```

如果之后更新了仓库，建议重新执行一次 `bun link`，确保全局命令仍指向最新源码。

## 配置与数据目录

ADVA Code 默认使用独立目录：

- `~/.adva`
- `~/.adva/settings.json`
- `~/.adva/agents`
- `~/.adva/agent-memory`

项目内也会使用：

- `.adva/settings.json`
- `.adva/settings.local.json`
- `.adva/skills`
- `.adva/agents`

这样做的目的很直接：把这个分支和原版 Claude Code 的本地配置、认证状态、缓存与扩展内容隔离开来。

如果你使用自定义 API key，当前分支也已经切换为使用 `ADVA_API_KEY` 相关路径和界面。

## Buddy 宠物系统

当前仓库已经对 Buddy 做了额外定制，至少包括：

- `/buddy` 和 `/buddy status` 的详细状态面板
- 中英双语切换：`/buddy language en|zh`
- 外观和属性修改命令
- 更完整的帮助页和实用子命令
- 闪光标识、彩色面板、属性条与预览立绘

常见命令示例：

```text
/buddy status
/buddy help
/buddy language zh
/buddy species robot
/buddy shiny on
/buddy stat DEBUGGING 100
```

## 项目结构

- `src/`：主源码，包含 CLI、TUI、命令、服务、桥接、状态和组件
- `src/commands/`：斜杠命令实现
- `src/components/`：Ink/React 终端组件
- `src/services/`：运行期服务与业务逻辑
- `src/tools/`：工具层实现
- `shims/`：本地 shim 包和兼容封装
- `vendor/`：恢复或兼容相关附带代码

## 开发说明

这个仓库目前没有一套完整、统一、对外公开的测试矩阵。更现实的验证方式是局部验证：

- 先跑 `bun run version`，确认程序还能起
- 再跑 `bun run dev`，手动验证你改到的路径
- 对具体模块做窄范围检查，不假设根目录一定存在完整 CI



## 适合什么用途

- 学习恢复后的 Claude Code 类 CLI/TUI 结构
- 把它当作二次开发底座

## 注意事项

- 这不是官方仓库
- 不应假设它和官方版本逐行、逐功能一致

## 许可证

项目根目录包含 `LICENSE` 文件。使用和分发前，请先自行确认当前分支与上游相关内容的适用范围。

## 仓库地址

<https://github.com/BlcaCola/ADVA-Code>
