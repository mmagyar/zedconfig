#!/usr/bin/env bun
// Symlinks ~/.claude/CLAUDE.md and ~/.claude/settings.json to iCloud Drive so
// Claude Code config stays in sync across machines. Safe to re-run: it seeds
// iCloud from whichever copy already exists and backs up (never deletes) any
// pre-existing file at the ~/.claude target before replacing it with a symlink.
// Companion script: push-to-icloud.ts (updates CLAUDE.md from this repo's AGENTS.md).

import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readlinkSync,
  renameSync,
  symlinkSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

type SyncEntry = {
  icloudName: string;
  claudeName: string;
  repoFallback?: string;
};

type PathState = {
  exists: boolean;
  isSymlink: boolean;
  linkTarget?: string;
};

const REPO_DIR = join(import.meta.dir, "..");
const HOME = homedir();
const ICLOUD_DIR = join(
  HOME,
  "Library/Mobile Documents/com~apple~CloudDocs/ClaudeCode",
);
const CLAUDE_DIR = join(HOME, ".claude");

const entries: SyncEntry[] = [
  {
    icloudName: "CLAUDE.md",
    claudeName: "CLAUDE.md",
    repoFallback: join(REPO_DIR, "AGENTS.md"),
  },
  { icloudName: "settings.json", claudeName: "settings.json" },
];

mkdirSync(ICLOUD_DIR, { recursive: true });
mkdirSync(CLAUDE_DIR, { recursive: true });

for (const entry of entries) {
  linkEntry(entry);
}

function pathState(path: string): PathState {
  let stat;
  try {
    stat = lstatSync(path);
  } catch {
    return { exists: false, isSymlink: false };
  }
  if (stat.isSymbolicLink()) {
    return { exists: true, isSymlink: true, linkTarget: readlinkSync(path) };
  }
  return { exists: true, isSymlink: false };
}

function seedIcloudFile(
  icloudPath: string,
  claudePath: string,
  repoFallback: string | undefined,
): void {
  const state = pathState(claudePath);
  if (state.exists && !state.isSymlink) {
    copyFileSync(claudePath, icloudPath);
    console.log(`Seeded ${icloudPath} from existing ${claudePath}`);
    return;
  }
  if (repoFallback && existsSync(repoFallback)) {
    copyFileSync(repoFallback, icloudPath);
    console.log(`Seeded ${icloudPath} from ${repoFallback}`);
  }
}

function linkEntry(entry: SyncEntry): void {
  const icloudPath = join(ICLOUD_DIR, entry.icloudName);
  const claudePath = join(CLAUDE_DIR, entry.claudeName);

  if (!existsSync(icloudPath)) {
    seedIcloudFile(icloudPath, claudePath, entry.repoFallback);
  }

  if (!existsSync(icloudPath)) {
    console.log(`Skipping ${entry.claudeName}: nothing to seed from`);
    return;
  }

  const state = pathState(claudePath);
  if (state.isSymlink && state.linkTarget === icloudPath) {
    console.log(`${entry.claudeName} already linked`);
    return;
  }

  if (state.exists) {
    const backupPath = `${claudePath}.bak-${Date.now()}`;
    renameSync(claudePath, backupPath);
    console.log(`Backed up existing ${entry.claudeName} -> ${backupPath}`);
  }

  symlinkSync(icloudPath, claudePath);
  console.log(`Linked ${claudePath} -> ${icloudPath}`);
}
