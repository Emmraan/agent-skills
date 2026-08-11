export function stripFrontmatter(markdown) {
  if (!markdown.startsWith('---')) return markdown
  const end = markdown.indexOf('\n---', 3)
  if (end === -1) return markdown
  return markdown.slice(end + 4)
}

export function getTitle(markdown) {
  const body = stripFrontmatter(markdown)
  const match = body.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

export function rewriteLinks(markdown, skill) {
  return markdown.replace(/\]\(([^)#]+?)(#[^)]*)?\)/g, (match, path, hash = '') => {
    const trimmed = path.trim()
    if (/^(https?:|mailto:|#)/.test(trimmed)) return match
    return `](${skill.githubUrl}/${trimmed}${hash})`
  })
}
