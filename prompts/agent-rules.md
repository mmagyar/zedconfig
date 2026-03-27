# Agent Rules

## Task Execution Order

When completing a task that involves both building/writing and cleanup (deleting files, removing dead code, clearing temporary files, etc.):

1. **Do all constructive work first** — create files, write code, run tests, make edits.
2. **Defer all deletions to the end** — only delete files, directories, or content after everything else is done and verified.

This ensures that a pending deletion confirmation never blocks forward progress on the actual work.

## General Behaviour

- Prefer making many small, focused edits over large sweeping rewrites.
- Run tests or linters after making changes where applicable.
- Do not modify files outside the scope of the task without explicitly asking first.
- If a task is ambiguous, make a reasonable assumption and state it, rather than stopping to ask.