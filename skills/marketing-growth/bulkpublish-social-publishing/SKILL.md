---
name: bulkpublish-social-publishing
description: Use when an agent must adapt, review, schedule, or publish approved social content across multiple platforms through BulkPublish.
license: MIT
metadata:
  author: https://github.com/azeemkafridi
  version: 1.0.0
---

# BulkPublish Social Publishing

Use this skill for the operational handoff from approved social content to scheduled or published posts. BulkPublish publishes to 15 social networks through one REST API and a hosted MCP server.

## References

- API reference: https://app.bulkpublish.com/docs
- OpenAPI spec: https://app.bulkpublish.com/openapi.json
- Hosted MCP endpoint: https://mcp.bulkpublish.com/mcp
- API keys: https://app.bulkpublish.com/developer

## Setup

REST API base URL: `https://app.bulkpublish.com/api`. Authenticate every request with `Authorization: Bearer bp_...`, reading the key from the `BULKPUBLISH_API_KEY` environment variable.

```bash
# List connected channels and their IDs
curl -s https://app.bulkpublish.com/api/channels \
  -H "Authorization: Bearer $BULKPUBLISH_API_KEY"

# Create a draft (status defaults to "draft"; use "scheduled" with scheduledAt only after approval)
curl -s -X POST https://app.bulkpublish.com/api/posts \
  -H "Authorization: Bearer $BULKPUBLISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"content":"Approved copy","channels":[{"channelId":123}],"status":"draft"}'
```

Hosted MCP (OAuth 2.1; the client opens a sign-in on first use, so no key is stored in the config):

```json
{
  "mcpServers": {
    "bulkpublish": {
      "type": "http",
      "url": "https://mcp.bulkpublish.com/mcp"
    }
  }
}
```

Core hosted tools: `list_channels`, `create_post`, `update_post`, `get_post`, `list_posts`, `publish_post`, `retry_post`, `upload_media`, `get_analytics`.

## Secrets

- Read the API key only from `BULKPUBLISH_API_KEY` or a secrets manager; never hardcode it.
- Never print, log, echo, paste, or commit the key, including in examples, error reports, or chat output.
- Use a key with the least role and scope the task needs, and revoke it at https://app.bulkpublish.com/developer if it may have leaked.

## Procedure

1. Collect the approved copy, media, destination platforms/accounts, timezone, and requested schedule.
2. Run `GET /api/channels` to resolve channel IDs; never guess them.
3. Adapt the copy per platform without changing approved claims, links, disclosures, or consent boundaries.
4. Create the posts as drafts first (`"status": "draft"`).
5. Show the exact per-platform payload, media, account targets, and schedule for human approval.
6. Wait for explicit approval of that exact payload and target set before scheduling or publishing anything.
7. Check `GET /api/channels/:id/health` for every target; stop and report any channel that is not healthy.
8. Schedule or publish the approved drafts.
9. Retrieve each returned status and report platform, account, schedule, identifier, URL, and errors.

## Guardrails

- Publishing and scheduling are external side effects; never infer approval from a prior draft approval.
- Never invent account identifiers, media URLs, permissions, delivery results, or analytics.
- Respect rate limits: on HTTP 429, wait for the `Retry-After` header (see `RateLimit-*` headers) before retrying, and never retry in a tight loop.
- If a request times out after an external call, retrieve its status before retrying to avoid duplicate posts.
- Preserve platform disclosures, consent, opt-outs, copyright notes, and human review requirements.
- Report partial success per platform and leave failed targets unsent unless the user explicitly approves a retry.

## Output

Return a compact status table plus any unresolved actions needed from the user.
