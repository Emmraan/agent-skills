import { useState } from 'react'

export default function SkillRow({ skill, number, onOpen }) {
  const [copied, setCopied] = useState(false)

  const copy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(skill.installCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <tr
      onClick={() => onOpen(skill)}
      className="group cursor-pointer border-b border-neutral-800 transition hover:bg-neutral-900/70"
    >
      <td className="w-10 px-3 py-3.5 text-right">
        <span className="font-mono text-xs text-neutral-600 group-hover:text-neutral-400">{number}</span>
      </td>
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-neutral-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-neutral-100 group-hover:to-neutral-400">
            {skill.name}
          </span>
          <span className="hidden rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400 sm:inline">
            {skill.categoryTitle}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{skill.description}</p>
      </td>
      <td className="hidden px-2 py-3.5 text-right lg:table-cell">
        <button
          onClick={copy}
          className={`rounded-md px-3 py-1.5 font-mono text-xs transition ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'silver-btn text-neutral-900'
          }`}
        >
          {copied ? 'Copied!' : 'Copy install'}
        </button>
      </td>
      <td className="px-4 py-3.5 text-right">
        <span className="text-xs text-neutral-500 transition group-hover:text-neutral-300">View →</span>
      </td>
    </tr>
  )
}
