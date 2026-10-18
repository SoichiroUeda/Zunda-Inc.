# CLAUDE.md

Planning repository for ぷらぐら's sleep-protecting task management app project, **Rism**.
Documents are mostly in Japanese; write new documents in Japanese unless asked otherwise.

## Rule 1: Never delete files — keep every old version in `trash/`

No file in this repository is ever deleted, and no old version is ever lost. This includes files Claude created earlier in the same session.

- Do **not** use `rm`, `git rm`, `rmdir`, `unlink`, `git clean`, or any other command that removes files.
- **Before any change to an existing file — even a one-character typo fix:**
  1. Move the current file with `git mv <path> trash/<YYYY-MM-DD>_<name>` (use the date of the move; if the file has a `版` line, keep the version in the name, e.g. `trash/2026-10-16_project_v2.md`).
  2. If that name already exists in `trash/`, append `_2`, `_3`, … before the extension.
  3. Write the new version at the original path. If the file has a `版` line, bump it (v2 → v3 …).
  4. Add a row to the table in `trash/README.md` (date, trashed path, original path, reason, replaced by).
- When a file is no longer needed at all, do step 1 and step 4 only.
- Files in `trash/` are never edited, renamed, or deleted. The only exception: `trash/README.md` may be appended to (new rows only) without trashing it first.
- If a task seems to require deletion (e.g. the user explicitly says "完全に削除して"), confirm with the user before doing anything.

## Rule 2: Confidentiality

`owner_notes.md` and `dev_survey_results.md` are for ぷらぐら only (the latter holds members' individual answers).

Refer to members by initials (e.g. KY, IH, FT, IT) in this repository, not by full names.

**Never in member-facing material:**
- ずんだ社 / "ずんだ" / "Zunda" and any plan to start a company
- Who owns the business, and that profits are kept by the owner and not shared
- The owner's overall budget or plans beyond December

**OK to tell members** (ぷらぐら decided to share these):
- Members may be paid if the project goes well (conditions to be presented later)
- The owner pays for paid AI tools (Claude Code etc.) used for the project
- The owner may lend MacBooks for development

Member-facing material: `project.md`, `dev_survey.md`, `kickoff.md`, `recruit*`, and anything written for project members or for the app's codebase. If unsure whether something is member-facing, ask.

## Rule 3: Source priority

- Decisions ぷらぐら has made in conversation take priority over everything else; reflect them in the documents.
- For roles and activity conditions, the recruiting materials (`recruit.md`, `recruitdocument.pdf`, `recruitslide.pdf`) take priority over brainstorm notes.

## Files

| Path | Purpose |
| --- | --- |
| `project.md` | Project overview (member-facing) |
| `kickoff.md` | Kickoff meeting agenda and proposed December goals (member-facing) |
| `dev_survey.md` | Survey for developer applicants, LINE-ready (member-facing) |
| `owner_notes.md` | Owner-only notes (confidential) |
| `dev_survey_results.md` | Developer survey answers and analysis (owner-only) |
| `recruit.md`, `recruitdocument.pdf`, `recruitslide.pdf` | Recruiting materials |
| `share/` | PDFs for members, generated from `project.md` and `kickoff.md` (kickoff's owner checklist is left out) |
| `scripts/build_share_pdfs.mjs` | Builds `share/`. Run: `NODE_PATH=/opt/node-tools/node_modules node scripts/build_share_pdfs.mjs` |
| `trash/` | Old versions and retired files. See `trash/README.md` |

## Regenerating `share/`

- After changing `project.md` or `kickoff.md`, offer to regenerate the PDFs.
- Rule 1 applies: before regenerating, move the existing PDFs to `trash/` with `git mv` and log them.
- Never put owner-only content in `share/`. After building, check the PDF text (`pdftotext`) for "ずんだ" / "Zunda" and for owner-only sections.
