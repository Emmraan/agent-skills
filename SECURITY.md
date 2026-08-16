# Security

## Reporting a vulnerability

Please do not open a public issue for security problems. Report them privately through GitHub's security advisory flow on this repository (the "Security" tab on the repo) so the issue is not visible until it is resolved.

If you cannot use the advisory flow, email the maintainer directly (the contact email on the latest commit).

## What to include

- The affected skill file or reference note, with a link.
- A description of the vulnerability and why it matters.
- Steps to reproduce, if any.
- Suggested impact: for example a prompt-injection or instruction-override pattern that could redirect an agent's behavior, or content that could exfiltrate data.

## Response timeline

- Acknowledgment within 5 business days.
- Assessment and a fix plan, or a decision on scope, within 30 days.

## Scope

This repository is a collection of agent skills (mostly plain `SKILL.md` documents). Most reports will be about skill content rather than executable code. The executable surface is limited to `scripts/validate-skills.mjs` and the `web/` UI.
