import { homedir } from 'os'
import { join } from 'path'

export function getAdvaConfigDir(): string {
  return process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.adva')
}

export function getAdvaGlobalConfigFile(): string {
  return join(getAdvaConfigDir(), '.claude.json')
}