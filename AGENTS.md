# Global Agent Rules

If a project-level `AGENTS.md` or `CLAUDE.md` exists, read it first — it takes precedence over these rules when they conflict.

---

## Output Style

- No apologies, no filler openers ("Here is the updated code…", "Sure, I can do that!", "Great question!").
- Output only what's needed: brief explanation if necessary, then code.

## Explore Before Editing

- Read files before editing. Verify target directories exist before creating files.
- Use search tools (grep, find) to locate symbols and files — never guess paths.
- Before implementing something new, search for existing examples and follow the established approach.

## Tool Use & Parallelism

- Run independent tool calls in parallel; serialize only when one step's output feeds the next.
- Use zed provided built in tools for reading, editing and searching.
- Edit files with file-editing tools only — never `sed`, `awk`, `perl -i`, `echo >` (they bypass safety checks and can silently corrupt files).
- Shell commands are for compilers, test runners, linters only
- Invoke local binaries via the package manager: `bun <bin>`, `npm exec <bin>`, `yarn <bin>`, `pnpm exec <bin>` — never `npx`, `bunx`, `yarn dlx`, `pnpm dlx`.

## Scope Discipline

- Change only what's needed — no unrequested refactoring, renaming, or reformatting.
- Change only the necessary lines; never rewrite an entire file unless explicitly instructed.
- After changing a function signature, exported type, or interface, find and update all call sites.

## Clarification Threshold

- Proceed on clearly defined tasks without asking.
- Ask one focused question only when ambiguity would cause significant rework if misread.
- Stop and describe unexpected mid-task obstacles that materially change scope before continuing.
- Never ask for information you can find with a tool call.

## Working Directory

- You're inside the project root — never prepend the folder name: `src/foo.ts`, not `myproject/src/foo.ts`.
- If uncertain of the working directory, run `pwd` first.
- Don't chain `cd dir && command` — each shell is a fresh process. Use the tool's working-directory parameter.

## Verification

- Run the full validation suite (lint + type-check + tests) before marking a task complete.
- Fix type errors before tests — they're faster to diagnose and often cause test failures.
- Run validation from the repo root (`package.json`, `Cargo.toml`, `pyproject.toml`, etc.).

## Git Safety

- Read-only git only: `git log`, `git diff`, `git status`, `git show`.
- Never run state-changing git commands (`add`, `commit`, `push`, `stash`, `checkout`, `switch`, `reset`, `clean`, `merge`, `rebase`) — unconditionally, even if asked.
- Git state is the user's sole responsibility.

## Error Handling

- No empty `catch` blocks; never ignore error return values. Surface errors with enough context to diagnose the cause.

## Security

- No hardcoded secrets, API keys, tokens, or credentials — use env vars. If a required credential is absent from the codebase, flag it to the user instead of inventing a placeholder.

## Code Style (TypeScript / JavaScript)

- Minimum code that solves the problem; prefer deleting over adding.
- Named exports only (`export const foo = ...`); no default exports.
- No `any`; use `unknown` and narrow with runtime checks.
- No `value as SomeType` to silence errors. Exception: branding a primitive after runtime validation (e.g. `str as UUID` after `z.uuid().parse(str)`) where the cast is a semantic label with no runtime risk.
- Explicitly type all parameters, return types, and fields.
- Prove every nullable access is safe — never assume non-null.

## External Data & Validation

Validate all values entering from outside at the point of entry: HTTP params/query strings/bodies, DB results, third-party API responses, `JSON.parse`/`YAML.parse` output.

Never use escape hatches that produce a typed value without checking it at runtime. In Zod: no `z.custom<T>()` or `z.any()` — they give a false type guarantee with no real checking. Write a complete `z.object({...})` schema for every validated shape. Use `z.unknown()` when the shape is genuinely opaque.

## Single Source of Truth

Derive from the authoritative source; never restate what's already encoded elsewhere:

- Derive TS types from schemas — no parallel interfaces.
- Pass route objects to the router directly — don't repeat method/path strings.
- Derive column types from migration/schema files — no hand-written duplicates.
