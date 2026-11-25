#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  PACKAGE_ROOT,
  SUPPORTED_AGENTS,
  installForAgent,
  uninstallForAgent,
} from './installer.mjs';

const pkg = JSON.parse(
  readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8'),
);

function printHelp() {
  console.log(`
dev-rules-ai v${pkg.version}
Standar engineering universal untuk repo tanpa AGENTS.md / CLAUDE.md.

Penggunaan:
  npx dev-rules-ai [opsi]

Opsi:
  -a, --agent <daftar>   Target agent: antigravity, claude, cursor, codex, atau all
                         (bisa dipisah koma, mis. --agent antigravity,claude)
  -s, --scope <scope>    Scope instalasi: global (default) atau project
  -u, --uninstall        Hapus instalasi dev-rules pada target yang dipilih
  -v, --version          Tampilkan versi
  -h, --help             Tampilkan bantuan ini

Contoh:
  npx dev-rules-ai
  npx dev-rules-ai --agent antigravity --scope global
  npx dev-rules-ai --agent all --scope project
  npx dev-rules-ai --uninstall --agent antigravity
`);
}

function parseArgs(argv) {
  const result = {
    agents: null,
    scope: null,
    uninstall: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      result.help = true;
    } else if (arg === '-v' || arg === '--version') {
      result.version = true;
    } else if (arg === '-u' || arg === '--uninstall') {
      result.uninstall = true;
    } else if (arg === '-a' || arg === '--agent') {
      const value = argv[++i];
      if (!value) throw new Error('Flag --agent membutuhkan nilai.');
      result.agents = value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
    } else if (arg === '-s' || arg === '--scope') {
      const value = argv[++i];
      if (!value) throw new Error('Flag --scope membutuhkan nilai.');
      result.scope = value.trim().toLowerCase();
    } else {
      throw new Error(`Argumen tidak dikenal: ${arg}`);
    }
  }

  return result;
}

function expandAgents(rawAgents) {
  if (rawAgents.includes('all')) {
    return [...SUPPORTED_AGENTS];
  }
  return [...new Set(rawAgents)];
}

async function promptInteractive(parsed) {
  const rl = createInterface({ input, output });
  try {
    let agents = parsed.agents;
    if (!agents) {
      console.log('\nPilih AI agent target:');
      console.log('  1. Antigravity');
      console.log('  2. Claude Code');
      console.log('  3. Cursor');
      console.log('  4. Codex');
      console.log('  5. Semua agent di atas');
      const answer = (
        await rl.question('Pilihan (pisahkan dengan koma, default 1): ')
      ).trim();

      const map = {
        1: 'antigravity',
        2: 'claude',
        3: 'cursor',
        4: 'codex',
        5: 'all',
      };
      const picks = (answer || '1')
        .split(',')
        .map((s) => map[s.trim()] ?? s.trim().toLowerCase())
        .filter(Boolean);
      agents = picks;
    }

    let scope = parsed.scope;
    if (!scope) {
      console.log('\nPilih scope instalasi:');
      console.log('  1. Global (berlaku untuk semua repo di mesin ini)');
      console.log('  2. Project (hanya di folder saat ini)');
      const scopeAnswer = (await rl.question('Pilihan (default 1): ')).trim();
      scope = scopeAnswer === '2' || scopeAnswer === 'project'
        ? 'project'
        : 'global';
    }

    return { agents: expandAgents(agents), scope };
  } finally {
    rl.close();
  }
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.help) {
    printHelp();
    return;
  }
  if (parsed.version) {
    console.log(pkg.version);
    return;
  }

  const isInteractive = !parsed.agents || !parsed.scope;
  const { agents, scope } = isInteractive
    ? await promptInteractive(parsed)
    : { agents: expandAgents(parsed.agents), scope: parsed.scope };

  console.log('');
  for (const agent of agents) {
    if (parsed.uninstall) {
      const res = uninstallForAgent(agent, scope);
      const status = res.removed ? 'Dihapus' : 'Tidak ditemukan';
      console.log(`- [${agent} | ${scope}] ${status}: ${res.targetDir}`);
    } else {
      const res = installForAgent(agent, scope);
      console.log(`✓ [${agent} | ${scope}] Terpasang di: ${res.targetDir}`);
    }
  }

  if (!parsed.uninstall) {
    console.log('\nSelesai! Gunakan /dev-rules di repo yang belum memiliki AGENTS.md.');
  }
}

main().catch((err) => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});
