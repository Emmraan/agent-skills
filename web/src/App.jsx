import { Suspense, lazy, useMemo, useState } from 'react'
import skills from './data/skills-index.json'
import SearchBar from './components/SearchBar.jsx'
import CategoryChips from './components/CategoryChips.jsx'
import SkillRow from './components/SkillRow.jsx'

const SkillModal = lazy(() => import('./components/SkillModal.jsx'))

function rankSkill(skill, tokens) {
  const name = skill.name.toLowerCase()
  const desc = (skill.description || '').toLowerCase()
  const category = (skill.categoryTitle || skill.category || '').toLowerCase()
  let score = 0
  for (const token of tokens) {
    let tokenScore = 0
    if (name === token) tokenScore += 5
    else if (name.startsWith(token)) tokenScore += 3
    else if (name.includes(token)) tokenScore += 2
    if (category.includes(token)) tokenScore += 1
    if (desc.includes(token)) tokenScore += 1
    if (tokenScore === 0) return -1
    score += tokenScore
  }
  return score
}

const NAV_LINKS = [
  { label: 'All skills', href: '#skills' },
  { label: 'Categories', href: '#categories' },
  { label: 'Install guide', href: 'https://github.com/emmraan/agent-skills/blob/main/SKILLS_INSTALLATION_GUIDE.md' },
  { label: 'GitHub', href: 'https://github.com/emmraan/agent-skills' },
  { label: 'skills.sh', href: 'https://skills.sh/emmraan/agent-skills' },
]

export default function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selected, setSelected] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroCopied, setHeroCopied] = useState(false)

  const categories = useMemo(() => {
    const map = new Map()
    for (const skill of skills) {
      map.set(skill.categoryTitle, (map.get(skill.categoryTitle) || 0) + 1)
    }
    return [...map.entries()].map(([title, count]) => ({ title, count }))
  }, [])

  const results = useMemo(() => {
    const tokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
    const scored = skills
      .map((skill) => ({ skill, score: tokens.length === 0 ? 0 : rankSkill(skill, tokens) }))
      .filter(({ score }) => score >= 0)
      .filter(({ skill }) => activeCategory === 'all' || skill.categoryTitle === activeCategory)
      .sort((a, b) => {
        if (tokens.length > 0 && b.score !== a.score) return b.score - a.score
        return a.skill.name.localeCompare(b.skill.name)
      })
    return scored.map(({ skill }) => skill)
  }, [query, activeCategory])

  const copy = (text, setState) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setState(true)
        setTimeout(() => setState(false), 1600)
      },
      () => setState(false),
    )
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <nav className="sticky top-0 z-40 border-b border-neutral-800 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <a href="#skills" className="flex items-center">
            <img src="/favicon.svg" alt="Agent Skills" className="h-8 w-8" />
          </a>
          <div className="hidden items-center gap-5 text-sm text-neutral-400 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="transition hover:text-neutral-100"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md border border-neutral-800 p-2 text-neutral-400 transition hover:text-neutral-200 md:hidden"
            aria-label="Menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-neutral-800 px-6 py-3 md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-neutral-800/60 py-2.5 text-sm text-neutral-300 transition hover:text-neutral-100 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <header className="relative overflow-hidden border-b border-neutral-800">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(220,224,232,0.10),transparent_65%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-neutral-100 via-neutral-300 to-neutral-500 sm:text-5xl">
            Agent Skills
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-400">
            Reusable capability modules for AI agents. Search {skills.length} skills and install any of them with a single command.
          </p>

          <div className="mt-6 flex max-w-2xl items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900/80 px-4 py-3">
            <code className="truncate font-mono text-sm text-neutral-300">
              npx skills add emmraan/agent-skills
            </code>
            <button
              onClick={() => copy('npx skills add emmraan/agent-skills', setHeroCopied)}
              className={`w-[72px] shrink-0 rounded-md border px-2 py-1.5 text-center font-mono text-xs transition ${
                heroCopied
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'silver-btn text-neutral-900'
              }`}
            >
              {heroCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="mt-6" id="categories">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div className="mt-4">
            <CategoryChips categories={categories} active={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>
      </header>

      <main id="skills" className="mx-auto max-w-7xl px-6 py-8">
        <p className="mb-4 text-sm text-neutral-500">
          {results.length} skill{results.length === 1 ? '' : 's'}
          {query ? ` for "${query}"` : ''}
          {activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
        </p>

        {results.length === 0 ? (
          <div className="mt-16 text-center text-neutral-500">
            <p className="text-lg font-medium">No skills match your search.</p>
            <p className="mt-1 text-sm">Try a different term, or clear the category filter.</p>
          </div>
        ) : (
          <div className="overflow-hidden border-y border-neutral-800 bg-neutral-950">
            <table className="w-full border-collapse">
              <tbody>
                {results.map((skill, index) => (
                  <SkillRow key={skill.path} skill={skill} number={index + 1} onOpen={setSelected} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <img src="/favicon.svg" alt="AS" className="h-6 w-6" />
                <span className="font-mono text-sm font-semibold">agent-skills</span>
              </div>
              <p className="mt-3 text-sm text-neutral-500">
                Reusable capability modules for AI agents. 167 skills, one-line installs.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">Browse</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="text-neutral-300 hover:text-neutral-100" href="#skills">All skills</a></li>
                <li><a className="text-neutral-300 hover:text-neutral-100" href="#categories">Categories</a></li>
                <li><a className="text-neutral-300 hover:text-neutral-100" href="#skills">Latest skills</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">Resources</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="text-neutral-300 hover:text-neutral-100" href="https://github.com/emmraan/agent-skills/blob/main/SKILLS_INSTALLATION_GUIDE.md" target="_blank" rel="noreferrer">Install guide ↗</a></li>
                <li><a className="text-neutral-300 hover:text-neutral-100" href="https://github.com/emmraan/agent-skills/blob/main/SKILLS_CATEGORIES.md" target="_blank" rel="noreferrer">Categories doc ↗</a></li>
                <li><a className="text-neutral-300 hover:text-neutral-100" href="https://github.com/emmraan/agent-skills" target="_blank" rel="noreferrer">GitHub ↗</a></li>
                <li><a className="text-neutral-300 hover:text-neutral-100" href="https://skills.sh/emmraan/agent-skills" target="_blank" rel="noreferrer">skills.sh ↗</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">Install everything</h3>
              <div className="mt-3 flex items-center justify-between gap-2 rounded bg-neutral-900 px-3 py-2">
                <code className="truncate font-mono text-xs text-neutral-400">
                  npx skills add emmraan/agent-skills
                </code>
                <button
                  onClick={() => copy('npx skills add emmraan/agent-skills', setHeroCopied)}
                  className={`w-[72px] shrink-0 rounded-md border px-2 py-1 text-center font-mono text-xs transition ${
                    heroCopied
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'silver-btn text-neutral-900'
                  }`}
                >
                  {heroCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-neutral-800 pt-6 text-xs text-neutral-600 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Emmraan · MIT License</p>
            <p>Built with Vite, React & Tailwind</p>
          </div>
        </div>
      </footer>

      {selected && (
        <Suspense fallback={null}>
          <SkillModal skill={selected} onClose={() => setSelected(null)} />
        </Suspense>
      )}
    </div>
  )
}
