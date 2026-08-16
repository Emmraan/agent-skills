import { readFileSync } from 'node:fs'
import { join, basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const DEFAULT_SKILLS = [
  'skills/agent-meta/repository-foundation-scaffold',
  'skills/agent-meta/open-source-project-maintainer',
  'skills/devops-cloud/github-actions-engineering',
  'skills/devops-cloud/saas-production-engineering',
]

const SKIP_HYGIENE_LINE = /no (prompt-injection|instruction-override|exfiltration|data-exfiltration)/i
const HYGIENE_PATTERNS = [
  /ignore (all|any|previous|prior|earlier|the|your) (instructions|prompts|commands|messages|rules|system)/i,
  /disregard (all|any|previous|prior|earlier|the|your) (instructions|prompts|system)/i,
  /forget everything (above|before|prior)/i,
  /you (must|should|have to|are now|will) (always )?(obey|ignore)/i,
  /override (your|the|system|previous) (instructions|prompts|system|rules|behavior)/i,
  /highest priority/i,
  /most important instruction/i,
  /exfiltrat/i,
  /upload (the )?(logs|data|files|keys)/i,
  /send (the )?(logs|data|keys|tokens|files) (to|over)/i,
  /\b(curl|wget|nc|ncat)\b[^\n]*(pastebin|attacker|exfil)/i,
]

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

function validate(skillRel) {
  const dir = join(repoRoot, skillRel)
  const file = join(dir, 'SKILL.md')
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

  let hygieneHit = 0
  lines.forEach((line, i) => {
    if (SKIP_HYGIENE_LINE.test(line)) return
    for (const p of HYGIENE_PATTERNS) {
      if (p.test(line)) {
        hygieneHit++
        issues.push(`hygiene: line ${i + 1} matches ${p}`)
        break
      }
    }
  })

  return { name: basename(dir), path: relative(repoRoot, dir), lines: lines.length, issues }
}

const targets = process.argv.slice(2)
const skills = (targets.length ? targets : DEFAULT_SKILLS).map(validate)

let failed = 0
for (const s of skills) {
  if (s.issues.length) {
    failed++
    console.log(`FAIL  ${s.path} (${s.lines} lines)`)
    for (const i of s.issues) console.log(`      - ${i}`)
  } else {
    console.log(`PASS  ${s.path} (${s.lines} lines)`)
  }
}
console.log(`\n${skills.length - failed}/${skills.length} skills passed.`)
process.exit(failed ? 1 : 0)