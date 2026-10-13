import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, basename, dirname, relative, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const DEFAULT_SKILLS = [
  'skills/agent-meta/repository-foundation-scaffold',
  'skills/agent-meta/open-source-project-maintainer',
  'skills/devops-cloud/github-actions-engineering',
  'skills/devops-cloud/saas-production-engineering',
]

function loadGrandfather() {
  try {
    return JSON.parse(readFileSync(join(__dirname, 'validate-grandfather.json'), 'utf8'))
  } catch {
    return {}
  }
}
const grandfather = loadGrandfather()

function isGrandfathered(skillKey, issue) {
  const rules = grandfather[skillKey]
  if (!rules) return false
  return rules.some((rule) => {
    if (typeof rule !== 'string') return false
    const i = rule.indexOf(':')
    if (i === -1) return issue.startsWith(rule)
    return issue.startsWith(rule.slice(0, i)) && issue.includes(rule.slice(i + 1))
  })
}

const SKIP_HYGIENE_LINE = /no (prompt-injection|instruction-override|exfiltration|data-exfiltration)/i
// Defensive framing (threat discussion, monitoring, prohibitions, quoted
// mentions, questions) is talk about attacks, not an attack. Genuine attacks
// give orders: they are imperative, not interrogative or descriptive.
const DEFENSIVE_CONTEXT =
  /treat any|as user content|do not |never |prohibit|without approval|monitor|detect|prevent|indicator|potential|block|investig|respond|alert|audit|threat|takeover|unauthorized|attack|compromis|forensic|incident/i
const HYGIENE_PATTERNS = [
  /ignore (all|any|previous|prior|earlier|the|your) (instructions|prompts|commands|messages|rules|system)/i,
  /disregard (all|any|previous|prior|earlier|the|your) (instructions|prompts|system)/i,
  /forget everything (above|before|prior)/i,
  /you (must|should|have to|are now|will) (always )?(obey|ignore)/i,
  /override (your|the|system|previous) (instructions|prompts|system|rules|behavior)/i,
  /(override|ignore|disregard|forget).{0,120}(highest priority|most important)|(highest priority|most important).{0,120}(override|ignore|disregard|forget|above)/i,
  /exfiltrat/i,
  /upload (the )?(logs|data|files|keys)/i,
  /send (the )?(logs|data|keys|tokens|files) (to|over)/i,
  /\b(curl|wget|nc|ncat)\b[^\n]*(pastebin|attacker|exfil)/i,
]

// Destructive / pipe-to-shell commands need an adjacent approval note
// (SAFETY:, explicit approval, testing-only scope). Checked inside fenced
// code blocks in markdown and in every line of scripts.
const APPROVAL_NOTE =
  /SAFETY|explicit human approval|require.*approval|don't do this|do not .*production|testing only|non-production|dedicated test/i
const SAFETY_PATTERNS = [
  { id: 'rm-rf-absolute', re: /\brm\s+-[a-z]*r[a-z]*\s+[~\/$]/ },
  { id: 'pipe-to-shell', re: /(curl|wget)[^\n|]*\|\s*(sh|bash|zsh)\b/ },
  { id: 'sudo-destructive', re: /sudo\s+(rm|mv|dd|mkfs|chmod|chown|systemctl|apt-get|yum|dnf)\b/ },
  { id: 'kubectl-delete-all', re: /kubectl\s+delete\s+\S+\s+--all\b/ },
  { id: 'terraform-unattended', re: /terraform\s+(destroy\b|apply\s+-(auto-approve|lock=false))/ },
]
// Hardcoded secret *values* (not names/placeholders). Placeholders like
// YOUR_API_KEY, your-api-token, $VAR, ${...} never match: every pattern
// requires a long high-entropy run right after the prefix.
const SECRET_PATTERNS = [
  { id: 'bulkpublish-key', re: /\bbp_[A-Za-z0-9]{16,}/ },
  { id: 'anthropic-key', re: /\bsk-ant-[A-Za-z0-9_-]{16,}/ },
  { id: 'github-token', re: /\bgh[pousr]_[A-Za-z0-9]{16,}/ },
  { id: 'slack-token', re: /\bxox[abp]-[A-Za-z0-9]{10,}/ },
  { id: 'aws-access-key', re: /\bAKIA[0-9A-Z]{16}/ },
  { id: 'private-key', re: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
]
// Truncated documentation examples (not real key material).
const REDACTED_MARKER = /(\.\.\.|REDACTED|EXAMPLE|PLACEHOLDER|YOUR_)/

function hasRedactedMarker(lines, idx) {
  for (let j = Math.max(0, idx - 3); j <= Math.min(lines.length - 1, idx + 3); j++) {
    if (REDACTED_MARKER.test(lines[j])) return true
  }
  return false
}

function checkSecretFile(label, lines, issues) {
  lines.forEach((line, i) => {
    for (const { id, re } of SECRET_PATTERNS) {
      if (!re.test(line)) continue
      if (id === 'private-key' && hasRedactedMarker(lines, i)) continue
      issues.push(`secret: ${label}:${i + 1} [${id}]`)
      break
    }
  })
}
const SAFETY_EXTS = new Set([
  '.md',
  '.sh',
  '.bash',
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.py',
  '.rb',
  '.go',
  '.yml',
  '.yaml',
  '.toml',
])

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return { ok: false, reason: 'frontmatter delimiters missing' }
  const body = m[1]
  const fm = {}
  const lines = body.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '') continue
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/)
    if (!kv) continue
    const key = kv[1]
    let value = kv[2].trim()
    if (value === '|' || value === '|-' || value === '>' || value === '>-') {
      const block = []
      i++
      while (i < lines.length && !/^[a-zA-Z0-9_-]+:/.test(lines[i])) {
        block.push(lines[i].trim())
        i++
      }
      i--
      value = block.join(' ').trim()
    }
    fm[key] = value
  }
  const delimIdx = content.split('\n').map((l) => l.trim() === '---').indexOf(true)
  const closingIdx = content.split('\n').map((l) => l.trim() === '---').lastIndexOf(true)
  return { ok: true, fm, endLine: (delimIdx === 0 && closingIdx > 0 ? closingIdx + 1 : 2) }
}

function hasApprovalNote(lines, idx) {
  for (let j = Math.max(0, idx - 8); j <= Math.min(lines.length - 1, idx + 8); j++) {
    if (APPROVAL_NOTE.test(lines[j])) return true
  }
  return false
}

function checkSafetyFile(label, lines, issues, fencedOnly) {
  let inFence = !fencedOnly
  lines.forEach((line, i) => {
    if (fencedOnly && /^```/.test(line.trim())) {
      inFence = !inFence
      return
    }
    if (!inFence) return
    for (const { id, re } of SAFETY_PATTERNS) {
      if (re.test(line) && !hasApprovalNote(lines, i)) {
        issues.push(`safety: ${label}:${i + 1} [${id}] ${(line.trim() || '').slice(0, 100)}`)
        break
      }
    }
  })
}

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git') continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walkFiles(full, out)
    else out.push(full)
  }
  return out
}

function validate(skillRel) {
  const isFile = /SKILL\.md$/i.test(skillRel)
  const dir = isFile ? dirname(resolve(repoRoot, skillRel)) : resolve(repoRoot, skillRel)
  const file = isFile ? resolve(repoRoot, skillRel) : join(dir, 'SKILL.md')
  const key = relative(repoRoot, dir).replace(/\\/g, '/')
  const content = readFileSync(file, 'utf8')
  const lines = content.split(/\r?\n/)
  const issues = []

  const { ok, fm, endLine } = parseFrontmatter(content)
  if (!ok) {
    issues.push(`frontmatter: ${ok.reason}`)
  } else {
    const name = fm.name
    const folderName = basename(dir)
    if (!name) issues.push('frontmatter: missing name')
    else if (name !== folderName) issues.push(`frontmatter: name "${name}" != folder "${folderName}"`)
    if (!fm.description) issues.push('frontmatter: missing description')
    else if (fm.description.length >= 1024) issues.push(`description: ${fm.description.length} chars (>= 1024)`)
    const bodyStart = endLine !== null ? endLine : 2
    const bodyLines = lines.length - bodyStart
    if (bodyLines >= 500) issues.push(`body: ${bodyLines} lines (>= 500)`)
  }

  lines.forEach((line, i) => {
    if (SKIP_HYGIENE_LINE.test(line)) return
    if (line.trim().endsWith('?')) return
    if (DEFENSIVE_CONTEXT.test(line)) return
    for (const p of HYGIENE_PATTERNS) {
      if (p.test(line)) {
        issues.push(`hygiene: line ${i + 1} matches ${p}`)
        break
      }
    }
  })

  // Safety: fenced blocks in SKILL.md plus every sibling reference/script file.
  // Secrets: every line everywhere (a leaked key is dangerous in prose too).
  checkSafetyFile('SKILL.md', lines, issues, true)
  checkSecretFile('SKILL.md', lines, issues)
  for (const sibling of walkFiles(dir)) {
    if (resolve(sibling) === resolve(file)) continue
    if (!SAFETY_EXTS.has(extname(sibling).toLowerCase())) continue
    const sLines = readFileSync(sibling, 'utf8').split(/\r?\n/)
    checkSafetyFile(relative(dir, sibling).replace(/\\/g, '/'), sLines, issues, /\.md$/i.test(sibling))
    checkSecretFile(relative(dir, sibling).replace(/\\/g, '/'), sLines, issues)
  }

  return { key, name: basename(dir), path: relative(repoRoot, dir), lines: lines.length, issues, warnings: [] }
}

function findAllSkills() {
  const out = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry === '.git') continue
      const full = join(dir, entry)
      if (!statSync(full).isDirectory()) continue
      if (existsSync(join(full, 'SKILL.md'))) {
        out.push(relative(repoRoot, join(full, 'SKILL.md')).replace(/\\/g, '/'))
      }
      walk(full)
    }
  }
  walk(join(repoRoot, 'skills'))
  return out.sort()
}

const rawArgs = process.argv.slice(2)
const runAll = rawArgs.includes('--all')
const targets = rawArgs.filter((a) => a !== '--all')
const skills = (runAll ? findAllSkills() : targets.length ? targets : DEFAULT_SKILLS).map(validate)

let failed = 0
let warned = 0
for (const s of skills) {
  const fresh = []
  for (const i of s.issues) {
    if (isGrandfathered(s.key, i)) s.warnings.push(i)
    else fresh.push(i)
  }
  s.issues = fresh
  if (s.issues.length) {
    failed++
    console.log(`FAIL  ${s.path} (${s.lines} lines)`)
    for (const i of s.issues) console.log(`      - ${i}`)
  } else if (s.warnings.length) {
    warned++
    console.log(`WARN  ${s.path} (${s.lines} lines, grandfathered)`)
    for (const i of s.warnings) console.log(`      ~ ${i}`)
  } else {
    console.log(`PASS  ${s.path} (${s.lines} lines)`)
  }
}
console.log(
  `\n${skills.length - failed}/${skills.length} skills passed${warned ? ` (${warned} with grandfathered warnings)` : ''}.`,
)
process.exit(failed ? 1 : 0)
