import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  installForAgent,
  resolveTarget,
  uninstallForAgent,
} from '../bin/installer.mjs';

describe('dev-rules installer', () => {
  let tempRoot;
  let fakeHome;
  let fakeCwd;

  beforeEach(() => {
    tempRoot = mkdtempSync(join(tmpdir(), 'dev-rules-test-'));
    fakeHome = join(tempRoot, 'home');
    fakeCwd = join(tempRoot, 'project');
  });

  afterEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
  });

  it('installs native plugin bundle for antigravity global scope', () => {
    const res = installForAgent('antigravity', 'global', {
      homeDir: fakeHome,
      cwd: fakeCwd,
    });

    assert.equal(res.mode, 'plugin');
    assert.equal(
      existsSync(join(res.targetDir, 'plugin.json')),
      true,
    );
    assert.equal(
      existsSync(join(res.targetDir, 'skills', 'dev-rules', 'SKILL.md')),
      true,
    );
  });

  it('installs SKILL.md for claude, cursor, and codex in global scope', () => {
    for (const agent of ['claude', 'cursor', 'codex']) {
      const res = installForAgent(agent, 'global', {
        homeDir: fakeHome,
        cwd: fakeCwd,
      });
      assert.equal(res.mode, 'skill');
      assert.equal(existsSync(join(res.targetDir, 'SKILL.md')), true);
    }
  });

  it('installs SKILL.md in project scope for antigravity and claude', () => {
    const agy = installForAgent('antigravity', 'project', {
      homeDir: fakeHome,
      cwd: fakeCwd,
    });
    const claude = installForAgent('claude', 'project', {
      homeDir: fakeHome,
      cwd: fakeCwd,
    });

    assert.equal(
      agy.targetDir,
      join(fakeCwd, '.agents', 'skills', 'dev-rules'),
    );
    assert.equal(
      claude.targetDir,
      join(fakeCwd, '.claude', 'skills', 'dev-rules'),
    );
    assert.equal(existsSync(join(agy.targetDir, 'SKILL.md')), true);
    assert.equal(existsSync(join(claude.targetDir, 'SKILL.md')), true);
  });

  it('uninstalls existing installation and handles missing directory gracefully', () => {
    const installed = installForAgent('antigravity', 'global', {
      homeDir: fakeHome,
      cwd: fakeCwd,
    });
    assert.equal(existsSync(installed.targetDir), true);

    const first = uninstallForAgent('antigravity', 'global', {
      homeDir: fakeHome,
      cwd: fakeCwd,
    });
    assert.equal(first.removed, true);
    assert.equal(existsSync(installed.targetDir), false);

    const second = uninstallForAgent('antigravity', 'global', {
      homeDir: fakeHome,
      cwd: fakeCwd,
    });
    assert.equal(second.removed, false);
  });

  it('rejects unknown agent and invalid scope', () => {
    assert.throws(
      () => resolveTarget('unknown-agent', 'global'),
      /Agent tidak dikenal/,
    );
    assert.throws(
      () => resolveTarget('antigravity', 'invalid-scope'),
      /Scope tidak dikenal/,
    );
  });
});
