# Claude Code sync scripts

Keeps Claude Code's global config in sync across machines via iCloud Drive:

- `~/.claude/CLAUDE.md` — sourced from this repo's `AGENTS.md`.
- `~/.claude/settings.json` — synced as-is (not tracked in this repo).

Both are symlinked to `~/Library/Mobile Documents/com~apple~CloudDocs/ClaudeCode/`,
so once iCloud syncs that folder to a machine, the symlink there points at the
same up-to-date file.

Requires [bun](https://bun.sh).

## Scripts

- **`push-to-icloud.ts`** — copies `AGENTS.md` → iCloud as `CLAUDE.md`. Run this
  after editing `AGENTS.md` to publish the change.
- **`link-claude.ts`** — creates/repairs the `~/.claude` symlinks. Safe to
  re-run (no-ops if already linked correctly). If it finds a real file where a
  symlink should go, it backs it up as `<name>.bak-<timestamp>` before linking
  — nothing is ever deleted automatically.

## Usage

```sh
bun run scripts/push-to-icloud.ts   # publish AGENTS.md -> iCloud
bun run scripts/link-claude.ts      # link ~/.claude/* -> iCloud
```

### New machine

1. Make sure iCloud Drive has synced down
   `.../CloudDocs/ClaudeCode/` (open it in Finder if it hasn't).
2. Clone/pull this repo.
3. Run `bun run scripts/link-claude.ts`.

### After editing AGENTS.md

Run `bun run scripts/push-to-icloud.ts` to push the update to iCloud (existing
symlinked machines pick it up once iCloud syncs it down — no re-link needed).
