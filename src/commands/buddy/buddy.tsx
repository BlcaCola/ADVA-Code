import * as React from 'react'
import { Box, Text } from '../../ink.js'
import type { LocalJSXCommandCall } from '../../types/command.js'
import { renderToAnsiString, renderToString } from '../../utils/staticRender.js'
import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js'
import ThemedBox from '../../components/design-system/ThemedBox.js'
import ThemedText from '../../components/design-system/ThemedText.js'
import { companionUserId, getCompanion, roll } from '../../buddy/companion.js'
import { renderSprite } from '../../buddy/sprites.js'
import {
  EYES,
  HATS,
  RARITY_COLORS,
  RARITIES,
  RARITY_STARS,
  SPECIES,
  STAT_NAMES,
  type CompanionOverrides,
  type StatName,
  type StoredCompanion,
} from '../../buddy/types.js'

type BuddyAction =
  | 'show'
  | 'status'
  | 'pet'
  | 'mute'
  | 'unmute'
  | 'language'
  | 'help'
  | 'rename'
  | 'personality'
  | 'reroll'
  | 'species'
  | 'hat'
  | 'eye'
  | 'rarity'
  | 'shiny'
  | 'stat'
  | 'reset'

type ParsedBuddyCommand = {
  action: BuddyAction
  rest: string
}

type BuddySummaryProps = {
  lines: string[]
}

type BuddyStatusPanelProps = {
  companion: NonNullable<ReturnType<typeof getCompanion>>
  hatched: boolean
}

type BuddyLanguage = 'en' | 'zh'

const BUDDY_LANGUAGES = ['en', 'zh'] as const satisfies readonly BuddyLanguage[]

function tr(language: BuddyLanguage, en: string, zh: string): string {
  return language === 'zh' ? zh : en
}

function getBuddyLanguage(): BuddyLanguage {
  return getGlobalConfig().companionLanguage === 'zh' ? 'zh' : 'en'
}

function SimpleLines({ lines }: BuddySummaryProps): React.ReactNode {
  return (
    <Box flexDirection="column">
      {lines.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>
  )
}

function formatHatchedAt(timestamp: number, language: BuddyLanguage): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return tr(language, 'unknown', '未知')
  }
  return date.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')
}

function formatAge(timestamp: number, language: BuddyLanguage): string {
  const elapsedMs = Math.max(0, Date.now() - timestamp)
  const totalMinutes = Math.floor(elapsedMs / 60_000)
  if (totalMinutes < 1) return tr(language, 'just now', '刚刚')
  if (totalMinutes < 60) return language === 'zh' ? `${totalMinutes} 分钟前` : `${totalMinutes}m ago`

  const totalHours = Math.floor(totalMinutes / 60)
  if (totalHours < 48) return language === 'zh' ? `${totalHours} 小时前` : `${totalHours}h ago`

  return language === 'zh' ? `${Math.floor(totalHours / 24)} 天前` : `${Math.floor(totalHours / 24)}d ago`
}

function statColor(value: number): 'error' | 'warning' | 'success' {
  if (value >= 75) return 'success'
  if (value >= 40) return 'warning'
  return 'error'
}

function dominantStat(companion: NonNullable<ReturnType<typeof getCompanion>>): StatName {
  return STAT_NAMES.reduce((best, current) =>
    companion.stats[current] > companion.stats[best] ? current : best,
  )
}

function buildTemperament(companion: NonNullable<ReturnType<typeof getCompanion>>, language: BuddyLanguage): string {
  const { DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK } = companion.stats

  if (CHAOS >= 80 && DEBUGGING >= 60) return tr(language, 'Volatile genius with strong fix instincts.', '高混乱高调试，属于破坏力很强但修得也快的天才型。')
  if (PATIENCE >= 75 && WISDOM >= 65) return tr(language, 'Calm reviewer who prefers stable, careful progress.', '偏冷静审阅型，喜欢稳定推进和细致修补。')
  if (SNARK >= 70 && DEBUGGING >= 60) return tr(language, 'Sharp-tongued debugger with excellent taste in edge cases.', '嘴很毒，但抓边界条件的嗅觉非常准。')
  if (WISDOM >= 75) return tr(language, 'Quiet strategist who sees the shape of the problem early.', '安静的策略派，通常能比别人更早看出问题轮廓。')
  if (CHAOS >= 75) return tr(language, 'Gremlin energy. Effective, but only under supervision.', '小恶魔型能量，效率不低，但最好盯着点用。')
  return tr(language, 'Balanced companion with a steady terminal bedside manner.', '整体比较均衡，是那种陪你稳定打完一整局终端战的伙伴。')
}

function buildBattleRole(companion: NonNullable<ReturnType<typeof getCompanion>>, language: BuddyLanguage): string {
  const lead = dominantStat(companion)

  switch (lead) {
    case 'DEBUGGING':
      return tr(language, 'Primary role: Bug hunter', '主定位：Bug 猎手')
    case 'PATIENCE':
      return tr(language, 'Primary role: Long-session support', '主定位：长线陪跑')
    case 'CHAOS':
      return tr(language, 'Primary role: Experimental wildcard', '主定位：实验型变量')
    case 'WISDOM':
      return tr(language, 'Primary role: Strategy brain', '主定位：策略脑')
    case 'SNARK':
      return tr(language, 'Primary role: Sass-powered critic', '主定位：嘴硬型审稿人')
  }
}

function buildRecommendations(companion: NonNullable<ReturnType<typeof getCompanion>>, language: BuddyLanguage): [string, string] {
  const lead = dominantStat(companion)

  switch (lead) {
    case 'DEBUGGING':
      return [tr(language, 'Best used for: tracing broken flows', '适合场景：追链路、排坏流程'), tr(language, 'Try next: /buddy stat WISDOM 70', '下一步可试：/buddy stat WISDOM 70')]
    case 'PATIENCE':
      return [tr(language, 'Best used for: refactors and cleanup', '适合场景：重构、清理和慢工修补'), tr(language, 'Try next: /buddy pet', '下一步可试：/buddy pet')]
    case 'CHAOS':
      return [tr(language, 'Best used for: spikes and weird experiments', '适合场景：试验性探索和奇怪点子'), tr(language, 'Try next: /buddy shiny on', '下一步可试：/buddy shiny on')]
    case 'WISDOM':
      return [tr(language, 'Best used for: planning and review passes', '适合场景：先规划后落地、做审查回合'), tr(language, 'Try next: /buddy personality TEXT', '下一步可试：/buddy personality TEXT')]
    case 'SNARK':
      return [tr(language, 'Best used for: catching suspicious code smells', '适合场景：抓代码异味和可疑实现'), tr(language, 'Try next: /buddy rename NAME', '下一步可试：/buddy rename NAME')]
  }
}

function labelStat(name: StatName, language: BuddyLanguage): string {
  if (language === 'en') {
    return name
  }

  switch (name) {
    case 'DEBUGGING':
      return '调试'
    case 'PATIENCE':
      return '耐心'
    case 'CHAOS':
      return '混乱'
    case 'WISDOM':
      return '智慧'
    case 'SNARK':
      return '嘴臭'
  }
}

function labelRarity(value: (typeof RARITIES)[number], language: BuddyLanguage): string {
  if (language === 'en') {
    return titleCase(value)
  }

  switch (value) {
    case 'common':
      return '普通'
    case 'uncommon':
      return '少见'
    case 'rare':
      return '稀有'
    case 'epic':
      return '史诗'
    case 'legendary':
      return '传说'
  }
}

function labelSpecies(value: (typeof SPECIES)[number], language: BuddyLanguage): string {
  if (language === 'en') {
    return titleCase(value)
  }

  switch (value) {
    case 'duck':
      return '鸭子'
    case 'goose':
      return '鹅'
    case 'blob':
      return '团子'
    case 'cat':
      return '猫'
    case 'dragon':
      return '龙'
    case 'octopus':
      return '章鱼'
    case 'owl':
      return '猫头鹰'
    case 'penguin':
      return '企鹅'
    case 'turtle':
      return '乌龟'
    case 'snail':
      return '蜗牛'
    case 'ghost':
      return '幽灵'
    case 'axolotl':
      return '六角恐龙'
    case 'capybara':
      return '水豚'
    case 'cactus':
      return '仙人掌'
    case 'robot':
      return '机器人'
    case 'rabbit':
      return '兔子'
    case 'mushroom':
      return '蘑菇'
    case 'chonk':
      return '胖团'
  }
}

function labelHat(value: (typeof HATS)[number], language: BuddyLanguage): string {
  if (language === 'en') {
    return value
  }

  switch (value) {
    case 'none':
      return '无'
    case 'crown':
      return '皇冠'
    case 'tophat':
      return '高礼帽'
    case 'propeller':
      return '螺旋桨帽'
    case 'halo':
      return '光环'
    case 'wizard':
      return '法师帽'
    case 'beanie':
      return '毛线帽'
    case 'tinyduck':
      return '小鸭帽'
  }
}

function labelTweak(value: string, language: BuddyLanguage): string {
  if (language === 'en') {
    return value
  }

  switch (value) {
    case 'species':
      return '物种'
    case 'rarity':
      return '稀有度'
    case 'eye':
      return '眼型'
    case 'hat':
      return '帽子'
    case 'shiny':
      return '闪光'
    case 'stats':
      return '属性'
    case 'reroll':
      return '重抽'
    case 'name':
      return '名字'
    case 'personality':
      return '个性'
    default:
      return value
  }
}

function normalizePersonalityText(text: string): string {
  return text
    .replaceAll('chirpss', 'chirps')
    .replaceAll('bouncess', 'bounces')
    .replaceAll('glowss', 'glows')
    .replaceAll('wiggless', 'wiggles')
    .replaceAll('humss', 'hums')
}

function StatRow({ name, value, language }: { name: StatName; value: number; language: BuddyLanguage }): React.ReactNode {
  const filled = Math.max(1, Math.round(value / 10))
  const empty = Math.max(0, 10 - filled)
  return (
    <Box>
      <Box width={13}>
        <ThemedText color="inactive">{labelStat(name, language)}</ThemedText>
      </Box>
      <Box width={14}>
        <ThemedText color={statColor(value)}>{'█'.repeat(filled)}{'░'.repeat(empty)}</ThemedText>
      </Box>
      <ThemedText bold color={statColor(value)}>{String(value).padStart(3, ' ')}</ThemedText>
    </Box>
  )
}

function SectionLabel({ children }: { children: string }): React.ReactNode {
  return (
    <ThemedText bold color="claude">
      {children}
    </ThemedText>
  )
}

function SectionDivider({ color = 'subtle' }: { color?: 'claude' | 'subtle' | 'permission' | 'success' | 'warning' }): React.ReactNode {
  return <ThemedText color={color}>{'─'.repeat(64)}</ThemedText>
}

function infoColor(kind: 'identity' | 'status' | 'profile' | 'recommendation' | 'commands'): 'text' | 'permission' | 'warning' | 'success' | 'inactive' {
  switch (kind) {
    case 'identity':
      return 'text'
    case 'status':
      return 'permission'
    case 'profile':
      return 'warning'
    case 'recommendation':
      return 'success'
    case 'commands':
      return 'inactive'
  }
}

function titleAccentColor(rarity: (typeof RARITIES)[number]): 'text' | 'success' | 'permission' | 'warning' | 'autoAccept' {
  switch (rarity) {
    case 'common':
      return 'text'
    case 'uncommon':
      return 'success'
    case 'rare':
      return 'permission'
    case 'epic':
      return 'warning'
    case 'legendary':
      return 'autoAccept'
  }
}

function BuddyStatusPanel({ companion, hatched }: BuddyStatusPanelProps): React.ReactNode {
  const config = getGlobalConfig()
  const language = getBuddyLanguage()
  const stored = config.companion
  const panelWidth = 68
  const overrides = stored?.overrides
  const sprite = renderSprite(companion, 0)
  const leadStat = dominantStat(companion)
  const temperament = buildTemperament(companion, language)
  const battleRole = buildBattleRole(companion, language)
  const [bestUseLine, nextStepLine] = buildRecommendations(companion, language)
  const personalityText = normalizePersonalityText(companion.personality)
  const accentColor = 'claude'
  const titleColor = titleAccentColor(companion.rarity)
  const shinySuffix = companion.shiny ? tr(language, ' · shiny ✨', ' · 闪光 ✨') : ''
  const sparkleLine = companion.shiny ? tr(language, '  ✦  ✨  ✦', '  ✦  ✨  ✦') : undefined
  const activeTweaks = [
    overrides?.species ? 'species' : undefined,
    overrides?.rarity ? 'rarity' : undefined,
    overrides?.eye ? 'eye' : undefined,
    overrides?.hat ? 'hat' : undefined,
    typeof overrides?.shiny === 'boolean' ? 'shiny' : undefined,
    overrides?.stats && Object.keys(overrides.stats).length > 0 ? 'stats' : undefined,
    stored?.morphSeed ? 'reroll' : undefined,
    stored && stored.name !== buildBuddyName(stored.morphSeed ?? companionUserId()) ? 'name' : undefined,
    stored && stored.personality !== buildPersonality(stored.morphSeed ?? companionUserId()) ? 'personality' : undefined,
  ].filter(Boolean) as string[]

  return (
    <ThemedBox
      flexDirection="column"
      width={panelWidth}
      borderStyle="round"
      borderColor={accentColor}
      paddingX={1}
    >
      <Box justifyContent="space-between">
        <ThemedText bold color={titleColor}>
          {companion.name} {RARITY_STARS[companion.rarity]}
        </ThemedText>
        <ThemedText color="inactive">
          {hatched ? tr(language, 'newly hatched', '刚刚孵化') : tr(language, `hatched ${formatAge(companion.hatchedAt, language)}`, `孵化于 ${formatAge(companion.hatchedAt, language)}`)}
        </ThemedText>
      </Box>

      <ThemedText color="permission">
        {labelRarity(companion.rarity, language)} {labelSpecies(companion.species, language)}
        {shinySuffix}
      </ThemedText>

      <Box marginTop={1}><SectionDivider color="claude" /></Box>

      <Box marginTop={1}>
        <Box width={22} flexDirection="column">
          <SectionLabel>{tr(language, 'Preview', '预览')}</SectionLabel>
          {sparkleLine ? <ThemedText color="warning">{sparkleLine}</ThemedText> : null}
          {sprite.map((line, index) => (
            <ThemedText key={index} color={companion.shiny ? titleColor : accentColor}>{line}</ThemedText>
          ))}
          <ThemedText color="inactive">{tr(language, 'Eye', '眼型')} {companion.eye} · {tr(language, 'Hat', '帽子')} {labelHat(companion.hat, language)}</ThemedText>
          <ThemedText color="permission">{tr(language, 'Lead stat', '主属性')}: {labelStat(leadStat, language)}</ThemedText>
        </Box>

        <Box flexGrow={1} flexDirection="column">
          <SectionLabel>{tr(language, 'Identity', '身份')}</SectionLabel>
          <ThemedText color={infoColor('identity')}>{tr(language, 'Species', '物种')}: {language === 'en' ? companion.species : labelSpecies(companion.species, language)}</ThemedText>
          <ThemedText color={infoColor('identity')}>{tr(language, 'Rarity', '稀有度')}: {language === 'en' ? companion.rarity : labelRarity(companion.rarity, language)}</ThemedText>
          <ThemedText color={infoColor('identity')}>{tr(language, 'Hatched at', '孵化时间')}: {formatHatchedAt(companion.hatchedAt, language)}</ThemedText>

          <Box marginTop={1} flexDirection="column">
            <SectionLabel>{tr(language, 'Status', '状态')}</SectionLabel>
            <ThemedText color={infoColor('status')}>{tr(language, 'Presence', '出场状态')}: {config.companionMuted ? tr(language, 'muted', '静音') : tr(language, 'active', '活跃')}</ThemedText>
            <ThemedText color={infoColor('status')}>{tr(language, 'Profile source', '面板来源')}: {stored?.morphSeed ? tr(language, 'rerolled variant', '重抽变体') : tr(language, 'account default', '账号默认体')}</ThemedText>
            <ThemedText color={infoColor('status')}>{tr(language, 'Tweaks', '已改动项')}: {activeTweaks.length > 0 ? activeTweaks.map(value => labelTweak(value, language)).join(language === 'zh' ? '、' : ', ') : tr(language, 'none', '无')}</ThemedText>
          </Box>

          <Box marginTop={1} flexDirection="column">
            <SectionLabel>{tr(language, 'Profile', '画像')}</SectionLabel>
            <ThemedText color={infoColor('profile')}>{battleRole}</ThemedText>
            <ThemedText color={infoColor('profile')}>{temperament}</ThemedText>
          </Box>
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <SectionDivider color="subtle" />
        <SectionLabel>{tr(language, 'Personality', '个性')}</SectionLabel>
        <ThemedText color="text">{personalityText}</ThemedText>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <SectionDivider color="subtle" />
        <SectionLabel>{tr(language, 'Stats', '属性')}</SectionLabel>
        {STAT_NAMES.map(name => (
          <StatRow key={name} name={name} value={companion.stats[name]} language={language} />
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <SectionDivider color="success" />
        <SectionLabel>{tr(language, 'Recommendations', '建议')}</SectionLabel>
        <ThemedText color={infoColor('recommendation')}>{bestUseLine}</ThemedText>
        <ThemedText color={infoColor('recommendation')}>{nextStepLine}</ThemedText>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <SectionDivider color="claude" />
        <SectionLabel>{tr(language, 'Quick Commands', '快捷指令')}</SectionLabel>
        <ThemedText color={infoColor('commands')}>/buddy pet · /buddy rename NAME · /buddy reroll</ThemedText>
        <ThemedText color={infoColor('commands')}>/buddy stat STAT VALUE · /buddy shiny on · /buddy reset all</ThemedText>
      </Box>
    </ThemedBox>
  )
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function buildBuddyName(seedSource: string): string {
  const prefixes = [
    'Byte',
    'Nibble',
    'Patch',
    'Pixel',
    'Mochi',
    'Biscuit',
    'Comet',
    'Pebble',
  ]
  const suffixes = [
    'Buddy',
    'Bean',
    'Puff',
    'Loop',
    'Sprite',
    'Scout',
    'Spark',
    'Dot',
  ]
  const seed = roll(seedSource).inspirationSeed
  return `${prefixes[seed % prefixes.length]} ${suffixes[Math.floor(seed / prefixes.length) % suffixes.length]}`
}

function buildPersonality(seedSource: string): string {
  const { bones, inspirationSeed } = roll(seedSource)
  const moods = [
    'cheers on clean fixes',
    'collects tiny debugging victories',
    'loves watching clever terminal work',
    'gets especially excited about elegant patches',
    'keeps an eye out for suspicious edge cases',
  ]
  const verbs = [
    'chirp',
    'bounce',
    'glow',
    'wiggle',
    'hum',
  ]
  const mood = moods[inspirationSeed % moods.length]
  const verb = verbs[Math.floor(inspirationSeed / moods.length) % verbs.length]
  return `A ${bones.rarity} ${bones.species} who ${verb}s softly and ${mood}.`
}

function createStoredCompanion(seedSource = companionUserId(), hatchedAt = Date.now()): StoredCompanion {
  return {
    name: buildBuddyName(seedSource),
    personality: buildPersonality(seedSource),
    hatchedAt,
    morphSeed: seedSource === companionUserId() ? undefined : seedSource,
  }
}

function companionToStored(companion: NonNullable<ReturnType<typeof getCompanion>>): StoredCompanion {
  const stored = getGlobalConfig().companion
  return stored ?? {
    name: companion.name,
    personality: companion.personality,
    hatchedAt: companion.hatchedAt,
  }
}

function ensureCompanion(): { companion: NonNullable<ReturnType<typeof getCompanion>>; hatched: boolean } {
  const existing = getCompanion()
  if (existing) {
    return { companion: existing, hatched: false }
  }

  const stored = createStoredCompanion()
  saveGlobalConfig(current => ({
    ...current,
    companion: stored,
    companionMuted: false,
  }))

  return {
    companion: getCompanion()!,
    hatched: true,
  }
}

function mutateStoredCompanion(
  update: (stored: StoredCompanion) => StoredCompanion,
): NonNullable<ReturnType<typeof getCompanion>> {
  const { companion } = ensureCompanion()
  saveGlobalConfig(current => ({
    ...current,
    companion: update(companionToStored(companion)),
  }))
  return getCompanion()!
}

function parseAction(args: string): ParsedBuddyCommand {
  const trimmed = args.trim()
  if (!trimmed) {
    return { action: 'show', rest: '' }
  }

  const firstSpace = trimmed.search(/\s/)
  const rawAction = (firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace)).toLowerCase()
  const rest = firstSpace === -1 ? '' : trimmed.slice(firstSpace + 1).trim()

  switch (rawAction) {
    case 'show':
    case 'status':
    case 'pet':
    case 'mute':
    case 'unmute':
    case 'language':
    case 'help':
    case 'rename':
    case 'personality':
    case 'reroll':
    case 'species':
    case 'hat':
    case 'eye':
    case 'rarity':
    case 'shiny':
    case 'stat':
    case 'reset':
      return { action: rawAction, rest }
    default:
      return { action: 'help', rest: '' }
  }
}

function buildSummaryLines(companion: NonNullable<ReturnType<typeof getCompanion>>): string[] {
  const stats = STAT_NAMES.map(name => `${name} ${companion.stats[name]}`).join(' · ')
  return [
    `${companion.name} ${RARITY_STARS[companion.rarity]}`,
    `${titleCase(companion.species)}${companion.shiny ? ' · shiny' : ''}${companion.hat !== 'none' ? ` · hat: ${companion.hat}` : ''}${companion.eye ? ` · eye: ${companion.eye}` : ''}`,
    companion.personality,
    stats,
  ]
}

function buildHelpLines(): string[] {
  const language = getBuddyLanguage()
  return [
    tr(language, 'Buddy commands:', 'Buddy 指令：'),
    tr(language, '/buddy or /buddy status - Show your current companion and stats.', '/buddy 或 /buddy status - 显示当前伙伴和属性面板。'),
    tr(language, '/buddy pet - Pet your companion and trigger the heart animation.', '/buddy pet - 抚摸伙伴并触发爱心动画。'),
    tr(language, '/buddy mute - Hide Buddy and silence reactions.', '/buddy mute - 隐藏 Buddy 并关闭反应。'),
    tr(language, '/buddy unmute - Bring Buddy back.', '/buddy unmute - 让 Buddy 回来。'),
    tr(language, '/buddy language en|zh - Switch Buddy panel/help language.', '/buddy language en|zh - 切换 Buddy 面板和帮助语言。'),
    tr(language, '/buddy rename NAME - Set a custom companion name.', '/buddy rename NAME - 设置伙伴名字。'),
    tr(language, '/buddy personality TEXT - Set a custom personality line.', '/buddy personality TEXT - 设置伙伴个性文案。'),
    tr(language, '/buddy reroll - Swap to a different generated companion body.', '/buddy reroll - 换一个新的生成体。'),
    tr(language, `species choices: ${SPECIES.join(', ')}`, `可用物种：${SPECIES.join(', ')}`),
    tr(language, `hat choices: ${HATS.join(', ')}`, `可用帽子：${HATS.join(', ')}`),
    tr(language, `eye choices: ${EYES.join(', ')}`, `可用眼型：${EYES.join(', ')}`),
    tr(language, `rarity choices: ${RARITIES.join(', ')}`, `可用稀有度：${RARITIES.join(', ')}`),
    tr(language, '/buddy species SPECIES - Force the pet species.', '/buddy species SPECIES - 强制指定物种。'),
    tr(language, '/buddy hat HAT - Force the hat.', '/buddy hat HAT - 强制指定帽子。'),
    tr(language, '/buddy eye EYE - Force the eye style.', '/buddy eye EYE - 强制指定眼型。'),
    tr(language, '/buddy rarity RARITY - Force the rarity.', '/buddy rarity RARITY - 强制指定稀有度。'),
    tr(language, '/buddy shiny on|off - Toggle shiny mode.', '/buddy shiny on|off - 切换闪光模式。'),
    tr(language, '/buddy stat STAT VALUE - Override one stat, e.g. /buddy stat DEBUGGING 100.', '/buddy stat STAT VALUE - 覆盖某一项属性，例如 /buddy stat DEBUGGING 100。'),
    tr(language, '/buddy reset stats|appearance|soul|all - Clear overrides and go back to defaults.', '/buddy reset stats|appearance|soul|all - 清除改动并恢复默认。'),
  ]
}

function normalizeStatName(value: string): StatName | undefined {
  return STAT_NAMES.find(name => name === value.toUpperCase())
}

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function setOverrides(
  nextOverrides: CompanionOverrides | undefined,
): NonNullable<ReturnType<typeof getCompanion>> {
  return mutateStoredCompanion(stored => ({
    ...stored,
    overrides: nextOverrides && Object.keys(nextOverrides).length > 0 ? nextOverrides : undefined,
  }))
}

async function showHelp(onDone: Parameters<LocalJSXCommandCall>[0]): Promise<void> {
  const output = await renderToString(<SimpleLines lines={buildHelpLines()} />)
  onDone(output)
}

async function showBuddy(onDone: Parameters<LocalJSXCommandCall>[0]): Promise<void> {
  const { companion, hatched } = ensureCompanion()
  const output = await renderToAnsiString(<BuddyStatusPanel companion={companion} hatched={hatched} />)
  onDone(output)
}

export const call: LocalJSXCommandCall = async (onDone, context, args) => {
  const { action, rest } = parseAction(args)

  if (action === 'help') {
    await showHelp(onDone)
    return null
  }

  if (action === 'show' || action === 'status') {
    await showBuddy(onDone)
    return null
  }

  if (action === 'mute') {
    const language = getBuddyLanguage()
    const { companion } = ensureCompanion()
    saveGlobalConfig(current => ({
      ...current,
      companion: current.companion ?? companion,
      companionMuted: true,
    }))
    onDone(tr(language, `${companion.name} is muted. Use /buddy unmute to bring them back.`, `${companion.name} 已静音。用 /buddy unmute 让它回来。`))
    return null
  }

  if (action === 'unmute') {
    const language = getBuddyLanguage()
    const { companion } = ensureCompanion()
    saveGlobalConfig(current => ({
      ...current,
      companion: current.companion ?? companion,
      companionMuted: false,
    }))
    onDone(tr(language, `${companion.name} is back.`, `${companion.name} 回来了。`))
    return null
  }

  if (action === 'pet') {
    const language = getBuddyLanguage()
    const { companion } = ensureCompanion()
    context.setAppState(prev => ({
      ...prev,
      companionPetAt: Date.now(),
    }))
    onDone(tr(language, `You pet ${companion.name}.`, `你摸了摸 ${companion.name}。`))
    return null
  }

  if (action === 'language') {
    const nextLanguage = rest.toLowerCase()
    if (!BUDDY_LANGUAGES.includes(nextLanguage as BuddyLanguage)) {
      onDone('Usage: /buddy language en|zh')
      return null
    }
    saveGlobalConfig(current => ({
      ...current,
      companionLanguage: nextLanguage as BuddyLanguage,
    }))
    onDone(nextLanguage === 'zh' ? 'Buddy 语言已切换为中文。' : 'Buddy language switched to English.')
    return null
  }

  if (action === 'rename') {
    const language = getBuddyLanguage()
    if (!rest) {
      onDone(tr(language, 'Usage: /buddy rename NAME', '用法：/buddy rename NAME'))
      return null
    }
    const companion = mutateStoredCompanion(stored => ({
      ...stored,
      name: rest,
    }))
    onDone(tr(language, `Buddy is now named ${companion.name}.`, `Buddy 现在叫 ${companion.name}。`))
    return null
  }

  if (action === 'personality') {
    const language = getBuddyLanguage()
    if (!rest) {
      onDone(tr(language, 'Usage: /buddy personality TEXT', '用法：/buddy personality TEXT'))
      return null
    }
    const companion = mutateStoredCompanion(stored => ({
      ...stored,
      personality: rest,
    }))
    onDone(tr(language, `Updated ${companion.name}'s personality.`, `已更新 ${companion.name} 的个性文案。`))
    return null
  }

  if (action === 'reroll') {
    const language = getBuddyLanguage()
    const seed = `${companionUserId()}:${Date.now()}`
    const current = getCompanion() ?? ensureCompanion().companion
    const next = createStoredCompanion(seed, current.hatchedAt)
    saveGlobalConfig(config => ({
      ...config,
      companion: next,
    }))
    onDone(tr(language, `Buddy rerolled. Say hi to ${getCompanion()!.name}.`, `Buddy 已重抽。和 ${getCompanion()!.name} 打个招呼吧。`))
    return null
  }

  if (action === 'species') {
    const language = getBuddyLanguage()
    if (!SPECIES.includes(rest as (typeof SPECIES)[number])) {
      onDone(tr(language, `Usage: /buddy species SPECIES\nChoices: ${SPECIES.join(', ')}`, `用法：/buddy species SPECIES\n可选：${SPECIES.join(', ')}`))
      return null
    }
    const current = getGlobalConfig().companion?.overrides ?? {}
    const companion = setOverrides({
      ...current,
      species: rest as (typeof SPECIES)[number],
    })
    onDone(tr(language, `${companion.name} is now a ${companion.species}.`, `${companion.name} 现在是 ${labelSpecies(companion.species, 'zh')}。`))
    return null
  }

  if (action === 'hat') {
    const language = getBuddyLanguage()
    if (!HATS.includes(rest as (typeof HATS)[number])) {
      onDone(tr(language, `Usage: /buddy hat HAT\nChoices: ${HATS.join(', ')}`, `用法：/buddy hat HAT\n可选：${HATS.join(', ')}`))
      return null
    }
    const current = getGlobalConfig().companion?.overrides ?? {}
    const companion = setOverrides({
      ...current,
      hat: rest as (typeof HATS)[number],
    })
    onDone(tr(language, `${companion.name} now wears ${companion.hat}.`, `${companion.name} 现在戴着${labelHat(companion.hat, 'zh')}。`))
    return null
  }

  if (action === 'eye') {
    const language = getBuddyLanguage()
    if (!EYES.includes(rest as (typeof EYES)[number])) {
      onDone(tr(language, `Usage: /buddy eye EYE\nChoices: ${EYES.join(', ')}`, `用法：/buddy eye EYE\n可选：${EYES.join(', ')}`))
      return null
    }
    const current = getGlobalConfig().companion?.overrides ?? {}
    const companion = setOverrides({
      ...current,
      eye: rest as (typeof EYES)[number],
    })
    onDone(tr(language, `${companion.name} now uses the ${companion.eye} eye style.`, `${companion.name} 现在使用 ${companion.eye} 眼型。`))
    return null
  }

  if (action === 'rarity') {
    const language = getBuddyLanguage()
    if (!RARITIES.includes(rest as (typeof RARITIES)[number])) {
      onDone(tr(language, `Usage: /buddy rarity RARITY\nChoices: ${RARITIES.join(', ')}`, `用法：/buddy rarity RARITY\n可选：${RARITIES.join(', ')}`))
      return null
    }
    const current = getGlobalConfig().companion?.overrides ?? {}
    const companion = setOverrides({
      ...current,
      rarity: rest as (typeof RARITIES)[number],
    })
    onDone(tr(language, `${companion.name} is now ${companion.rarity}.`, `${companion.name} 现在是${labelRarity(companion.rarity, 'zh')}。`))
    return null
  }

  if (action === 'shiny') {
    const language = getBuddyLanguage()
    const lower = rest.toLowerCase()
    if (lower !== 'on' && lower !== 'off') {
      onDone(tr(language, 'Usage: /buddy shiny on|off', '用法：/buddy shiny on|off'))
      return null
    }
    const current = getGlobalConfig().companion?.overrides ?? {}
    const companion = setOverrides({
      ...current,
      shiny: lower === 'on',
    })
    onDone(tr(language, `${companion.name} shiny mode ${lower}.`, `${companion.name} 的闪光模式已${lower === 'on' ? '开启' : '关闭'}。`))
    return null
  }

  if (action === 'stat') {
    const language = getBuddyLanguage()
    const [rawStat, rawValue] = rest.split(/\s+/, 2)
    const statName = normalizeStatName(rawStat ?? '')
    const parsedValue = Number(rawValue)
    if (!statName || Number.isNaN(parsedValue)) {
      onDone(tr(language, `Usage: /buddy stat STAT VALUE\nStats: ${STAT_NAMES.join(', ')}`, `用法：/buddy stat STAT VALUE\n属性：${STAT_NAMES.join(', ')}`))
      return null
    }
    const nextValue = clampStat(parsedValue)
    const current = getGlobalConfig().companion?.overrides ?? {}
    const companion = setOverrides({
      ...current,
      stats: {
        ...(current.stats ?? {}),
        [statName]: nextValue,
      },
    })
    onDone(tr(language, `${companion.name} now has ${statName} ${companion.stats[statName]}.`, `${companion.name} 的${labelStat(statName, 'zh')}现在是 ${companion.stats[statName]}。`))
    return null
  }

  if (action === 'reset') {
    const language = getBuddyLanguage()
    const mode = (rest || 'all').toLowerCase()
    const { companion } = ensureCompanion()
    if (!['all', 'stats', 'appearance', 'soul'].includes(mode)) {
      onDone(tr(language, 'Usage: /buddy reset stats|appearance|soul|all', '用法：/buddy reset stats|appearance|soul|all'))
      return null
    }

    if (mode === 'all') {
      saveGlobalConfig(current => ({
        ...current,
        companion: createStoredCompanion(companionUserId(), companion.hatchedAt),
      }))
      onDone(tr(language, 'Reset Buddy back to the default companion for this account.', 'Buddy 已重置为该账号的默认伙伴。'))
      return null
    }

    if (mode === 'stats') {
      const current = getGlobalConfig().companion?.overrides ?? {}
      setOverrides({
        ...current,
        stats: undefined,
      })
      onDone(tr(language, 'Reset Buddy stat overrides.', '已重置 Buddy 的属性覆盖。'))
      return null
    }

    if (mode === 'appearance') {
      mutateStoredCompanion(stored => {
        const currentOverrides = stored.overrides ?? {}
        const { stats } = currentOverrides
        return {
          ...stored,
          morphSeed: undefined,
          overrides: stats ? { stats } : undefined,
        }
      })
      onDone(tr(language, 'Reset Buddy appearance overrides.', '已重置 Buddy 的外观覆盖。'))
      return null
    }

    const resetSoul = createStoredCompanion(getGlobalConfig().companion?.morphSeed ?? companionUserId(), companion.hatchedAt)
    mutateStoredCompanion(stored => ({
      ...stored,
      name: resetSoul.name,
      personality: resetSoul.personality,
    }))
    onDone(tr(language, 'Reset Buddy name and personality.', '已重置 Buddy 的名字和个性文案。'))
    return null
  }

  await showHelp(onDone)
  return null
}
