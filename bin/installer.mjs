import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const PACKAGE_ROOT = resolve(__dirname, '..');
export const SKILL_SOURCE_DIR = join(PACKAGE_ROOT, 'skills', 'dev-rules');
export const PLUGIN_MANIFEST = join(PACKAGE_ROOT, 'plugin.json');

export const SUPPORTED_AGENTS = ['antigravity', 'claude', 'cursor', 'codex'];
export const SUPPORTED_SCOPES = ['global', 'project'];

/**
 * Resolve target directory and installation mode for a given agent + scope.
 * @param {string} agent
 * @param {'global' | 'project'} scope
 * @param {{ homeDir?: string, cwd?: string }} [options]
 * @returns {{ targetDir: string, mode: 'plugin' | 'skill' }}
 */
export function resolveTarget(agent, scope, options = {}) {
  if (!SUPPORTED_AGENTS.includes(agent)) {
    throw new Error(
      `Agent tidak dikenal: "${agent}". Pilihan: ${SUPPORTED_AGENTS.join(', ')}.`,
    );
  }
  if (!SUPPORTED_SCOPES.includes(scope)) {
    throw new Error(
      `Scope tidak dikenal: "${scope}". Pilihan: ${SUPPORTED_SCOPES.join(', ')}.`,
    );
  }

  const home = options.homeDir ?? homedir();
  const cwd = options.cwd ?? process.cwd();

  if (scope === 'global') {
    switch (agent) {
      case 'antigravity':
        return {
          targetDir: join(home, '.gemini', 'config', 'plugins', 'dev-rules'),
          mode: 'plugin',
        };
      case 'claude':
        return {
          targetDir: join(home, '.claude', 'skills', 'dev-rules'),
          mode: 'skill',
        };
      case 'cursor':
        return {
          targetDir: join(home, '.cursor', 'skills', 'dev-rules'),
          mode: 'skill',
        };
      case 'codex':
        return {
          targetDir: join(home, '.codex', 'skills', 'dev-rules'),
          mode: 'skill',
        };
    }
  }

  switch (agent) {
    case 'antigravity':
    case 'codex':
      return {
        targetDir: join(cwd, '.agents', 'skills', 'dev-rules'),
        mode: 'skill',
      };
    case 'claude':
      return {
        targetDir: join(cwd, '.claude', 'skills', 'dev-rules'),
        mode: 'skill',
      };
    case 'cursor':
      return {
        targetDir: join(cwd, '.cursor', 'skills', 'dev-rules'),
        mode: 'skill',
      };
  }
}

/**
 * Install dev-rules for a single agent and scope.
 * @param {string} agent
 * @param {'global' | 'project'} scope
 * @param {{ homeDir?: string, cwd?: string }} [options]
 * @returns {{ agent: string, scope: string, targetDir: string, mode: string }}
 */
export function installForAgent(agent, scope, options = {}) {
  const { targetDir, mode } = resolveTarget(agent, scope, options);

  if (mode === 'plugin') {
    const skillDest = join(targetDir, 'skills', 'dev-rules');
    mkdirSync(skillDest, { recursive: true });
    cpSync(PLUGIN_MANIFEST, join(targetDir, 'plugin.json'));
    cpSync(SKILL_SOURCE_DIR, skillDest, { recursive: true });
  } else {
    mkdirSync(targetDir, { recursive: true });
    cpSync(SKILL_SOURCE_DIR, targetDir, { recursive: true });
  }

  return { agent, scope, targetDir, mode };
}

/**
 * Uninstall dev-rules for a single agent and scope.
 * @param {string} agent
 * @param {'global' | 'project'} scope
 * @param {{ homeDir?: string, cwd?: string }} [options]
 * @returns {{ agent: string, scope: string, targetDir: string, removed: boolean }}
 */
export function uninstallForAgent(agent, scope, options = {}) {
  const { targetDir } = resolveTarget(agent, scope, options);

  if (!existsSync(targetDir)) {
    return { agent, scope, targetDir, removed: false };
  }

  rmSync(targetDir, { recursive: true, force: true });
  return { agent, scope, targetDir, removed: true };
}
