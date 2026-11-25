# dev-rules

**Standar engineering universal untuk AI coding agents pada repositori tanpa `AGENTS.md`.**

Menjaga hasil kode dari **Antigravity**, **Claude Code**, **Cursor**, dan **Codex** tetap modular, *type-safe*, aman, teruji, dan siap masuk *code review* — tanpa perlu mengulang instruksi yang sama di setiap proyek baru.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/Node.js-%E2%89%A518-339933.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-black.svg)](#struktur-repositori)

---

## Quick Start

```bash
npx dev-rules-ai
```

Installer interaktif akan membantu memilih target agent (**Antigravity**, **Claude Code**, **Cursor**, **Codex**, atau semua sekaligus) dan scope (**Global** atau **Project**).

---

## Cara Kerja

`dev-rules` dirancang sebagai **standar dasar (*baseline guardrails*)**, bukan pengganti aturan spesifik proyek:

- **Repo belum punya aturan proyek** → `dev-rules` aktif untuk menjaga kualitas arsitektur, keamanan, pengujian, dan alur Git.
- **Repo sudah punya `AGENTS.md` / `CLAUDE.md` / `.cursorrules`** → `dev-rules` **otomatis dilewati** lewat *guard clause* bawaan agar tidak bentrok dengan konvensi proyek dan tidak memboroskan token konteks.

---

## Cakupan Aturan

| # | Pilar | Standar Utama |
| :-: | :--- | :--- |
| 1 | **Modularitas & Batas File** | Maksimal ~250–300 baris per file; dekomposisi sejak perancangan, bukan refactor susulan. |
| 2 | **Feature Locality** | Kode spesifik fitur co-located di direktori fitur; hindari root barrel file & circular dependency. |
| 3 | **DRY & Feedback Standar** | Gunakan utilitas & komponen bersama; ekstrak pola berulang ≥ 3×; dilarang `alert()`. |
| 4 | **Type Safety Multi-Stack** | Ketat untuk TypeScript/JS, PHP, Python, dan Go; null & error safety tanpa *silent failure*. |
| 5 | **Negative Cases** | Empty state, error state ramah, validasi klien + server, anti double-submit, 401/403, dan safeguard upload. |
| 6 | **Konfirmasi Aksi Destruktif** | Wajib modal/dialog konfirmasi sebelum aksi permanen atau berisiko tinggi. |
| 7 | **Database, API & Security** | Parameterized query, anti secret leak & false-positive scanner, DB transaction, tanpa mock di core code. |
| 8 | **Zero Test Debt** | Unit test co-located (happy path + negative cases) untuk modul baru, target ≥ 30% baris. |
| 9 | **Quality Gate** | 0 lint error/warning, nesting ≤ 4 level, zero debug noise, dan pencegahan pola bug statis. |
| 10 | **Workflow & Git** | Conventional Commits, anti-rework framing, tuntas lokal sebelum push, dan commit atomik. |

---

## Metode Instalasi

### 1. Interactive CLI *(Direkomendasikan)*

```bash
npx dev-rules-ai
```

Atau jalankan non-interaktif menggunakan flag:

```bash
# Install global untuk Antigravity
npx dev-rules-ai --agent antigravity --scope global

# Install di project saat ini untuk semua agent
npx dev-rules-ai --agent all --scope project

# Install untuk beberapa agent sekaligus
npx dev-rules-ai --agent antigravity,claude,cursor --scope global

# Hapus instalasi
npx dev-rules-ai --uninstall --agent antigravity --scope global
```

### 2. Via `skills.sh`

```bash
npx skills add dhianharyono/dev-rules
```

### 3. Antigravity Plugin

```bash
agy plugin install https://github.com/dhianharyono/dev-rules
```

Atau clone langsung ke direktori plugin global:

```bash
git clone https://github.com/dhianharyono/dev-rules.git ~/.gemini/config/plugins/dev-rules
```

### 4. Claude Code

```bash
/plugin install dhianharyono/dev-rules
```

---

## Agent & Lokasi Instalasi

| Agent | Global Scope | Project Scope |
| :--- | :--- | :--- |
| **Antigravity** | `~/.gemini/config/plugins/dev-rules/` *(native plugin)* | `.agents/skills/dev-rules/` |
| **Claude Code** | `~/.claude/skills/dev-rules/` | `.claude/skills/dev-rules/` |
| **Cursor** | `~/.cursor/skills/dev-rules/` | `.cursor/skills/dev-rules/` |
| **Codex** | `~/.codex/skills/dev-rules/` | `.agents/skills/dev-rules/` |

---

## Cara Pemakaian

- **Otomatis:** Agent membaca deskripsi skill dan mengaktifkannya saat bekerja di repositori yang belum memiliki `AGENTS.md` / `CLAUDE.md` / `.cursorrules`.
- **Eksplisit:** Panggil langsung `/dev-rules` di awal prompt, misalnya:
  ```text
  /dev-rules buatkan modul manajemen produk beserta unit test-nya
  ```

---

## Struktur Repositori

```text
dev-rules/
├── package.json                   # Konfigurasi paket npm (dev-rules-ai)
├── bin/
│   ├── cli.mjs                    # Entry point CLI interaktif & flags
│   └── installer.mjs              # Logika instalasi lintas-agent (zero dependency)
├── tests/
│   └── installer.test.mjs         # Unit tests (node --test)
├── plugin.json                    # Manifest Antigravity
├── .claude-plugin/
│   └── plugin.json                # Manifest Claude Code
├── skills/
│   └── dev-rules/
│       └── SKILL.md               # Single source of truth untuk semua agent
├── README.md
└── LICENSE
```

## Lisensi

[MIT](./LICENSE) © 2026 Dhian Haryono.
