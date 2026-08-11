import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { stripFrontmatter, getTitle, rewriteLinks } from '../markdown-utils.js'

function copy(text, setCopied) {
  navigator.clipboard.writeText(text).then(
    () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    },
    () => setCopied(false),
  )
}

export default function SkillModal({ skill, onClose }) {
  const [content, setContent] = useState(null)
  const [error, setError] = useState(null)
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedFull, setCopiedFull] = useState(false)

  useEffect(() => {
    let cancelled = false
    setContent(null)
    setError(null)
    fetch(skill.rawUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((text) => {
        if (!cancelled) setContent(text)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [skill])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rendered = content ? rewriteLinks(stripFrontmatter(content), skill) : ''
  const title = content ? getTitle(content) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="modal-silver relative my-8 w-full max-w-6xl rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-neutral-100 via-neutral-300 to-neutral-500">
              {title || skill.name}
            </h2>
            <p className="mt-1 font-mono text-xs text-neutral-500">{skill.path}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-neutral-800 px-2.5 py-1.5 text-neutral-400 transition hover:border-neutral-600 hover:text-neutral-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
          <div className="min-w-0 border-neutral-800 px-6 py-5 md:border-r">
            <div className="mb-5 rounded-lg border border-neutral-800 bg-neutral-900">
              <div className="flex items-center justify-between gap-2 border-b border-neutral-800 px-3 py-2">
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Installation</span>
                <button
                  onClick={() => copy(skill.installCommand, setCopiedInstall)}
                  className={`w-[76px] rounded-md border px-3 py-1 text-center font-mono text-xs transition ${
                    copiedInstall
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'silver-btn text-neutral-900'
                  }`}
                >
                  {copiedInstall ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto px-3 py-2.5 font-mono text-xs leading-relaxed text-neutral-300">
                {skill.installCommand}
              </pre>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                Could not load SKILL.md ({error}).{' '}
                <a className="underline" href={skill.rawUrl} target="_blank" rel="noreferrer">
                  View raw
                </a>
              </div>
            ) : content === null ? (
              <div className="flex items-center gap-2 py-10 text-sm text-neutral-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-300" />
                Loading SKILL.md…
              </div>
            ) : (
              <article className="skill-md">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{rendered}</ReactMarkdown>
              </article>
            )}
          </div>

          <aside className="px-6 py-5 text-sm">
            <div className="space-y-4">
              <div>
                <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500">Details</h3>
                <dl className="space-y-1.5 text-neutral-300">
                  <div>
                    <dt className="text-xs text-neutral-500">Category</dt>
                    <dd className="mt-0.5">{skill.categoryTitle}</dd>
                  </div>
                  {skill.author && (
                    <div>
                      <dt className="text-xs text-neutral-500">Author</dt>
                      <dd className="mt-0.5">{skill.author}</dd>
                    </div>
                  )}
                  {skill.license && (
                    <div>
                      <dt className="text-xs text-neutral-500">License</dt>
                      <dd className="mt-0.5">{skill.license}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500">Links</h3>
                <div className="space-y-1">
                  <a className="block text-neutral-300 hover:text-neutral-100 hover:underline" href={skill.githubUrl} target="_blank" rel="noreferrer">
                    Source folder ↗
                  </a>
                  <a className="block text-neutral-300 hover:text-neutral-100 hover:underline" href={skill.rawUrl} target="_blank" rel="noreferrer">
                    Raw SKILL.md ↗
                  </a>
                </div>
              </div>

              {skill.files.length > 0 && (
                <div>
                  <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Support files ({skill.files.length})
                  </h3>
                  <ul className="space-y-1 font-mono text-xs">
                    {skill.files.map((f) => (
                      <li key={f.path}>
                        <a className="text-neutral-400 hover:text-neutral-200 hover:underline" href={f.url} target="_blank" rel="noreferrer">
                          {f.path}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => copy(skill.installCommand, setCopiedFull)}
                className={`w-full rounded-md border px-3 py-2 text-sm font-medium transition ${
                  copiedFull
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'silver-btn text-neutral-900'
                }`}
              >
                {copiedFull ? 'Copied!' : 'Copy install command'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
