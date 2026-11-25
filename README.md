# dev-rules

Standar engineering universal lintas-agent (**Antigravity**, **Claude Code**, **Cursor**, **Codex**) untuk repositori **tanpa** file aturan proyek (`AGENTS.md` / `CLAUDE.md` / `.cursorrules`).

> **Otomatis dilewati bila repo sudah punya aturan:** `dev-rules` memiliki *guard clause* bawaan agar tidak bentrok dengan aturan proyek dan tidak memboroskan konteks token.

## Ringkasan 10 Pilar Aturan

1. **Modularitas & Batas File** — batas < 250–300 baris per file, dekomposisi sejak perancangan.
2. **Feature Locality & Anti-Circular Dependency** — co-location per fitur, hindari root barrel file.
3. **DRY & Feedback Standar** — pakai utilitas bersama, ekstrak duplikasi ≥ 3×, tanpa `alert()`.
4. **Type Safety Multi-Stack** — TypeScript/JS, PHP, Python, Go, serta null & error safety.
5. **Negative Cases & Error Handling** — empty state, error state, validasi klien + server, anti double-submit, 401/403, dan safeguard upload file.
6. **Konfirmasi Aksi Destruktif** — wajib modal/dialog konfirmasi untuk aksi permanen/berisiko.
7. **Database, API & Security** — parameterized query, anti secret leak & anti false-positive scanner, database transaction, larangan mock di core code.
8. **Testing (Zero Test Debt)** — unit test co-located (happy path + negative cases), target ≥ 30% baris modul baru.
9. **Quality Gate** — 0 lint error/warning, nesting ≤ 4 level, zero debug noise, dan pencegahan pola bug statis.
10. **Workflow & Git** — Conventional Commits, anti-rework framing, tuntas lokal sebelum push, dan commit atomik.

---

## Cara Instalasi

### 1. Interactive CLI *(Direkomendasikan — tanpa prefix username)*

```bash
npx dev-rules-ai
```

Atau langsung non-interaktif dengan flag:

```bash
# Install global untuk Antigravity
npx dev-rules-ai --agent antigravity --scope global

# Install di project saat ini untuk semua agent
npx dev-rules-ai --agent all --scope project

# Hapus instalasi
npx dev-rules-ai --uninstall --agent antigravity --scope global
```

### 2. Via `skills.sh`

```bash
npx skills add dhianharyono/dev-rules
```

### 3. Manual (Antigravity Plugin via Git)

```bash
git clone https://github.com/dhianharyono/dev-rules.git ~/.gemini/config/plugins/dev-rules
```

---

## Cara Pemakaian

- **Otomatis:** Agent membaca deskripsi skill dan mengaktifkannya saat bekerja di repo yang belum memiliki `AGENTS.md` / `CLAUDE.md`.
- **Eksplisit:** Panggil langsung dengan `/dev-rules` pada prompt.

---

## Struktur Repositori

```text
dev-rules/
├── package.json                   # Konfigurasi paket npm (npx dev-rules-ai)
├── bin/
│   ├── cli.mjs                    # Entry point CLI interaktif & flags
│   └── installer.mjs              # Logika instalasi lintas-agent
├── tests/
│   └── installer.test.mjs         # Unit tests (node --test)
├── plugin.json                    # Manifest Antigravity
├── .claude-plugin/
│   └── plugin.json                # Manifest Claude Code
├── skills/
│   └── dev-rules/
│       └── SKILL.md               # Single source of truth (dipakai semua agent)
├── README.md
└── LICENSE
```

## Lisensi

[MIT](./LICENSE) — © 2026 Dhian Haryono.
