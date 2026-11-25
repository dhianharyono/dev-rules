---
name: dev-rules
description: Standar engineering universal untuk repo TANPA aturan proyek (AGENTS.md / CLAUDE.md / .cursorrules): modularitas & batas baris file, type safety multi-stack TS/PHP/Python/Go, negative cases, keamanan SQL, zero test debt, dan conventional commits. Aktifkan HANYA jika repo TIDAK memiliki file aturan proyek. Bila repo sudah punya AGENTS.md/CLAUDE.md, JANGAN muat skill ini — aturan repo adalah satu-satunya sumber kebenaran.
---

# Universal Engineering Guidelines — hanya untuk repo TANPA aturan proyek

**Guard clause (baca lebih dulu, wajib):**

- Jika repositori saat ini **memiliki `AGENTS.md`** (atau file aturan proyek setara seperti `CLAUDE.md` / `.cursorrules`): berhenti di sini. Jangan terapkan isi skill ini — ikuti aturan repo sebagai sumber kebenaran dan cukup beri tahu pengguna bahwa `/dev-rules` dilewati karena repo sudah punya aturan. Jangan muat keduanya sekaligus (dobel biaya token, rawan aturan konflik).
- Skill ini hanya dipakai untuk repo tanpa file aturan proyek, repo baru/kosong, atau saat pengguna eksplisit meminta standar universal di repo yang memang tidak punya aturan.

---

## 1. Modularitas & Batas File

- DILARANG membuat atau membiarkan satu file apa pun melebihi **~250-300 baris kode** — berlaku untuk frontend (komponen, page/view, custom hooks, state stores, layout) dan backend (controller/route handlers, service layer, repository/model, middleware, query builders).
- Dekomposisi sejak perancangan (dilarang monolitik dengan dalih "nanti direfaktor"): form/filter kompleks atau > 4-5 state → ekstrak custom hook atau sub-komponen; controller/service mendekati 200 baris → delegasikan ke Service Layer/Helper/Library/sub-modul.

## 2. Feature Locality & Anti-Circular Dependency

- Kode yang hanya dipakai satu fitur WAJIB co-located di direktori fitur/modul terkait; direktori global/bersama hanya untuk elemen atomik yang benar-benar dipakai lintas fitur.
- Utamakan impor langsung dari modul spesifik; hindari root barrel file yang dapat memicu recursive bundling / dependency sirkular.

## 3. DRY & Feedback Standar

- Dilarang membuat formatter (mata uang, tanggal, angka, durasi) atau helper response ad-hoc — gunakan utilitas bersama yang tersedia di repo.
- Manfaatkan komponen dialog/modal, form input, dan standar response payload yang sudah ada.
- **Anti-duplikasi pragmatis**: bila pola UI, konfigurasi field, atau setup test berulang **≥ 3×** dengan struktur sama, ekstrak ke data-driven array (`.map()`), komponen/helper bersama, atau test factory; hindari *premature abstraction* untuk 2 kasus yang berbeda perilaku.
- Feedback aksi pengguna (sukses/gagal/info) wajib lewat mekanisme standar project (Toast/Alert/API error response); dilarang `alert()` bawaan browser.

## 4. Type Safety Multi-Stack

- **TypeScript/JavaScript**: dilarang `any` — gunakan tipe spesifik, `unknown` + type-guarding, atau generic. Hindari `as any`/`as Type` yang mematikan pemeriksaan compiler. Tipe `Props`, state, payload request, dan response (DTO) eksplisit.
- **PHP**: type hinting parameter & return eksplisit; `declare(strict_types=1);` bila didukung project; PHPDoc (`@param`, `@return`, `@var`) akurat untuk array asosiatif/koleksi kompleks.
- **Python/Go**: type annotations (`typing` module) di Python; strong static typing di Go. Hindari `interface{}`/`Any` tanpa type assertion/validation yang aman.
- **Null & error safety**: optional chaining `?.`, nullish coalescing `??`, atau null check eksplisit; tangani error via try-catch/error return/custom exception — dilarang silent failure.

## 5. Negative Cases & Error Handling

- **Empty states**: tampilan/response jelas dan informatif saat tidak ada data (tabel kosong, hasil nihil, list `[]`).
- **Error & failure**: kegagalan API/koneksi database/status 4xx-5xx ditangani dengan feedback ramah — tanpa white screen crash (frontend) atau fatal uncaught exception (backend).
- **Form & input validation**: validasi semua input di frontend (UX) dan WAJIB divalidasi ulang di backend (security); pesan error spesifik per field.
- **Loading & double submit**: tampilkan loading/skeleton saat memproses; disable tombol submit untuk mencegah double submission.
- **Akses & sesi**: tangani 401 (token kadaluarsa) dan 403 (forbidden) + redirect ke autentikasi dengan tepat.
- **Upload file**: nilai `accept` selaras dengan format yang didukung backend; validasi ekstensi/tipe, file kosong (`size === 0`), dan ukuran maksimal di klien sebelum request dikirim; backend WAJIB re-validasi MIME-type riil, ekstensi, dan ukuran; petakan pesan error teknis runtime ke pesan yang ramah pengguna.

## 6. Konfirmasi Aksi Destruktif

- Selalu sediakan modal/dialog konfirmasi sebelum aksi berisiko atau permanen (menghapus data, membatalkan transaksi, mengubah hak akses); tanpa aksi destruktif satu-klik tanpa proteksi.

## 7. Database, API & Security

- **SQL injection prevention**: selalu parameterized queries / prepared statements / query builder / ORM yang aman — dilarang keras menggabungkan raw string input ke query database.
- **Kerahasiaan kredensial & anti false-positive**: jangan pernah menulis secret key, password, connection string, atau token di kode — gunakan environment variables (`.env`). Hindari pula memberi nama variabel/key/prop/testId mengandung `secret`, `token`, `password`, `passwd`, `apiKey`, atau `credential` dengan nilai string literal `≥ 8` karakter (termasuk di file UI, constants, `testid`, atau Storybook) agar tidak memicu false-positive secret scanner; gunakan nama netral (mis. `authFieldId`, `passInputId`).
- **Integritas transaksi**: mutasi data berantai wajib dibungkus Database Transaction (`BEGIN`, `COMMIT`, `ROLLBACK`) untuk mencegah inkonsistensi saat kegagalan di tengah proses.
- **Larangan mock data di core code**: dataset tiruan/mock hanya boleh di file pengujian (`tests/`, `__tests__/`, `*.fixture.*`).

## 8. Testing (Zero Test Debt)

- Setiap komponen penting, business logic/service, atau utilitas baru WAJIB menyertakan unit test-nya.
- Konvensi lokasi & penamaan per stack — **JS/TS**: `__tests__/` atau `*.test.ts(x)`/`*.spec.ts(x)`; **PHP**: `tests/` dengan `*Test.php` (PHPUnit/Pest); **Python**: `test_*.py`; **Go**: `*_test.go`.
- Pengujian minimal mencakup happy path + negative cases (data kosong, input tidak valid, API/database error), dengan helper/factory bersama untuk menghindari duplikasi setup/mock antar blok test, serta menjaga porsi kode tes tetap sehat (target ≥ 30% baris pada modul baru).

## 9. Quality Gate

- Hindari code smells (fungsi duplikat, kompleksitas siklomatis/kognitif tinggi, unhandled promises, variabel tidak terpakai) — pipeline linting dan quality gate selalu lulus; linter 0 error/0 warning; 100% test suites lulus.
- **Nesting & keterbacaan**: jaga blok logika (`if`/`for`/`switch`/`try`) tetap dangkal (≤ 4 level indentasi) dengan *early return* / *guard clauses*; untuk JSX/TSX, hindari `.map()` atau ternary bertingkat yang dalam dan ekstrak sub-komponen bermakna secara semantik tanpa *over-fragmentation*. Usahakan panjang baris ≤ 120 karakter.
- **Zero noise sebelum push**: dilarang meninggalkan `console.log`/`debug`/`trace` (termasuk di `*.stories.*`), blok `catch {}` kosong (wajib log atau rethrow), kode mati yang di-comment, maupun `TODO`/`FIXME` tanpa tiket.
- Pola bug statis yang wajib dihindari: callback langsung ke `.map()`/`.filter()` (bungkus arrow function eksplisit), regex alternation tanpa grouping `(?:...)` di boundary anchor, emoji di character class tanpa flag `u`, rentang kontrol ASCII di regex literal, interpolasi string `${...}` di `client.query(...)`, `.sort()` tanpa komparator (wajib `localeCompare`), percabangan bernilai sama di kedua cabang, dan fungsi async diteruskan ke handler bertipe `() => void`.

## 10. Workflow & Git

- Sajikan dokumen rencana implementasi, analisis kerja, dan walkthrough secara terstruktur, jelas, dan profesional.
- **Conventional Commits**: `feat(<scope>):`, `refactor(<scope>):`, `chore(<scope>):`, `test(<scope>):`.
- **Anti-rework framing**: hindari penamaan commit pemicu penalti rework/bug tracking bila pembaruan merupakan iterasi bertahap atau tindak lanjut permintaan stakeholder; bingkai sebagai penambahan kapabilitas/pemenuhan spesifikasi, misal `feat(<scope>): accommodate stakeholder request for <fitur>` atau `feat(<scope>): extend capabilities for <kebutuhan>`.
- **Tuntas lokal sebelum push (anti self-rework & bolak-balik)**: pastikan modul sudah modular (< 300 baris), lolos lint, dan lulus uji unit sejak commit pertama — hindari pola push monolitik lalu refactor susulan, serta jangan melakukan eksperimen hapus–kembalikan kode lintas commit yang sudah di-push (gunakan `git stash` atau amend/squash di lokal).
- **Perbaikan tuntas & batching dependency**: saat memperbaiki bug, tulis regression test dan selesaikan akar masalah sekaligus agar tidak memicu perbaikan berulang pada file yang sama; gabungkan update `package.json`/audit keamanan dalam satu commit/MR daripada mencicil per paket.
- **Commit atomik**: bila perubahan > 300 baris atau menyentuh multi-layer, pecah rekomendasi menjadi commit terpisah (target rata-rata ≤ 150–250 baris diff, batas keras ≤ 300–400 baris — misal commit 1 types/contracts, commit 2 service/logic, commit 3 UI, commit 4 unit tests) lengkap dengan daftar file `git add` dan audit `git diff --cached --stat` sebelum commit.
