export default function CategoryChips({ categories, active, onChange }) {
  const chipClass = (selected) =>
    `rounded-full px-3 py-1 text-sm font-medium transition ${
      selected
        ? 'bg-neutral-100 text-neutral-900'
        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
    }`

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onChange('all')} className={chipClass(active === 'all')}>
        All <span className="ml-1 text-xs opacity-60">{categories.reduce((sum, c) => sum + c.count, 0)}</span>
      </button>
      {categories.map(({ title, count }) => (
        <button key={title} onClick={() => onChange(title)} className={chipClass(active === title)}>
          {title} <span className="ml-1 text-xs opacity-60">{count}</span>
        </button>
      ))}
    </div>
  )
}
