import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { basename, dirname, join, relative, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../..')
const skillsRoot = join(repoRoot, 'skills')

const OWNER = 'emmraan'
const REPO = 'agent-skills'
const BRANCH = 'main'

const CATEGORY_TITLES = {
  'agent-meta': 'Agent & Meta',
  'ai-ml': 'AI & Machine Learning',
  'animation-webgl': 'Animation & WebGL',
  'backend-apis': 'Backend & APIs',
  'databases-data': 'Databases & Data',
  'design-ux': 'Design & UX',
  'devops-cloud': 'DevOps & Cloud',
  'frontend-ui': 'Frontend & UI',
  'languages': 'Languages',
  'marketing-growth': 'Marketing & Growth',
  'testing-quality': 'Testing & Quality',
}

function findSkillFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (!statSync(full).isDirectory()) continue
    const skillMd = join(full, 'SKILL.md')
    if (existsSync(skillMd)) {
      results.push(skillMd)
    }
    results.push(...findSkillFiles(full))
  }
  return results
}

function stripYamlQuotes(value) {
  let v = value.trim()
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
    v = v.slice(1, -1)
  }
  return v.replace(/''/g, "'").replace(/""/g, '"')
}

function listFiles(dir, prefix = '') {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...listFiles(full, `${prefix}${entry}/`))
    } else if (entry !== 'SKILL.md') {
      results.push(`${prefix}${entry}`)
    }
  }
  return results.sort()
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const frontmatter = {}
  const lines = match[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const kv = line.match(/^(\s*)([a-zA-Z0-9_-]+):\s*(.*)$/)
    if (!kv) continue
    const key = kv[2]
    const value = kv[3].trim()
    if (key === 'name' || key === 'license') {
      frontmatter[key] = stripYamlQuotes(value)
    }
    if (key === 'author') {
      frontmatter.author = stripYamlQuotes(value)
    }
    if (key === 'description') {
      if (value === '|' || value === '|-' || value === '>' || value === '>-') {
        const block = []
        i++
        while (i < lines.length && !/^\s*[a-zA-Z0-9_-]+:/.test(lines[i])) {
          block.push(lines[i].trim())
          i++
        }
        i--
        frontmatter.description = block.join(' ').trim()
      } else {
        frontmatter.description = stripYamlQuotes(value)
      }
    }
  }
  return frontmatter
}

const files = findSkillFiles(skillsRoot).sort()
const skills = files.map((file) => {
  const content = readFileSync(file, 'utf8')
  const fm = parseFrontmatter(content)
  const folder = dirname(file)
  const relFolder = relative(repoRoot, folder).replace(/\\/g, '/')
  const relSkills = relative(skillsRoot, folder).replace(/\\/g, '/')
  const category = relSkills.split('/')[0]
  const folderName = basename(folder)
  const skillName = fm.name || folderName
  return {
    name: skillName,
    description: fm.description || '',
    category,
    categoryTitle: CATEGORY_TITLES[category] || category,
    path: relFolder,
    githubUrl: `https://github.com/${OWNER}/${REPO}/tree/${BRANCH}/${relFolder}`,
    installCommand: `npx skills add https://github.com/${OWNER}/${REPO} --skill ${folderName}`,
    rawUrl: `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${relFolder}/SKILL.md`,
    files: listFiles(folder).map((f) => ({
      path: f,
      url: `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${relFolder}/${f}`,
    })),
    author: fm.author || null,
    license: fm.license || null,
  }
})

const outDir = resolve(__dirname, '../src/data')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'skills-index.json'), JSON.stringify(skills, null, 2) + '\n')

const groupings = Object.entries(CATEGORY_TITLES).map(([slug, title]) => ({
  title,
  skills: skills.filter((s) => s.category === slug).map((s) => s.name),
}))
writeFileSync(
  join(repoRoot, 'skills.sh.json'),
  JSON.stringify(
    {
      $schema: 'https://skills.sh/schemas/skills.sh.schema.json',
      groupings,
    },
    null,
    2,
  ) + '\n',
)

console.log(`Indexed ${skills.length} skills across ${groupings.length} categories.`)
