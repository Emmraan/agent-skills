---
name: bulkpublish-social-publishing
description: Use when an agent must adapt, review, schedule, or publish approved social content across multiple platforms through BulkPublish.
---

# BulkPublish Social Publishing

Use this skill for the operational handoff from approved social content to scheduled or published posts. BulkPublish provides the API and hosted MCP used to perform the handoff.

## References

- API repository: https://github.com/azeemkafridi/bulkpublish-api
- API and MCP documentation: https://app.bulkpublish.com/docs
- Hosted MCP endpoint: https://mcp.bulkpublish.com/mcp

## Procedure

1. Collect the approved copy, media, destination platforms/accounts, timezone, and requested schedule.
2. Adapt the copy per platform without changing approved claims, links, disclosures, or consent boundaries.
3. Show the exact per-platform payload, media, account targets, and schedule for human approval.
4. Wait for explicit approval of that exact payload and target set before creating or scheduling anything.
5. Use BulkPublish's API or hosted MCP to create the approved posts or schedules.
6. Retrieve each returned status and report platform, account, schedule, identifier, URL, and errors.

## Guardrails

- Publishing and scheduling are external side effects; never infer approval from a prior draft approval.
- Never invent account identifiers, media URLs, permissions, delivery results, or analytics.
- If a request times out after an external call, retrieve its status before retrying to avoid duplicate posts.
- Preserve platform disclosures, consent, opt-outs, copyright notes, and human review requirements.
- Report partial success per platform and leave failed targets unsent unless the user explicitly approves a retry.

## Output

Return a compact status table plus any unresolved actions needed from the user.
