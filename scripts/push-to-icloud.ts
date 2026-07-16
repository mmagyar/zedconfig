#!/usr/bin/env bun
// Copies this repo's AGENTS.md into iCloud Drive as CLAUDE.md.
// Run this after editing AGENTS.md so the change propagates to other machines.
// Companion script: link-claude.ts (creates the ~/.claude symlinks).

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const REPO_DIR = join(import.meta.dir, "..");
const ICLOUD_DIR = join(
  homedir(),
  "Library/Mobile Documents/com~apple~CloudDocs/ClaudeCode",
);

const repoSource = join(REPO_DIR, "AGENTS.md");
const icloudTarget = join(ICLOUD_DIR, "CLAUDE.md");

if (!existsSync(repoSource)) {
  console.error(`Missing ${repoSource}`);
  process.exit(1);
}

mkdirSync(ICLOUD_DIR, { recursive: true });
copyFileSync(repoSource, icloudTarget);
console.log(`Copied AGENTS.md -> ${icloudTarget}`);
