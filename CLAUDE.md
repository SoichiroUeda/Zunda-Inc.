# CLAUDE.md

Planning repository for ぷらぐら's sleep-protecting task management app project (Rism, working title).
Documents are mostly in Japanese; write new documents in Japanese unless asked otherwise.

## Rule 1: Never delete files — move them to `trash/`

No file in this repository is ever deleted. This includes files Claude created earlier in the same session.

- Do **not** use `rm`, `git rm`, `rmdir`, `unlink`, `git clean`, or any other command that removes files.
- When a file is no longer needed, or is being replaced by a new version:
  1. Move it with `git mv <path> trash/<YYYY-MM-DD>_<name>` (use the date of the move; if the file has a version, keep it in the name, e.g. `trash/2026-10-16_project_v1.md`).
  2. If that name already exists in `trash/`, append `_2`, `_3`, ….
  3. Add a row to the table in `trash/README.md` (date, trashed path, original path, reason, replaced by).
- **New version of a document:** move the old one to `trash/` first, then write the new version at the original path and bump its `版` line (v1 → v2 …).
- Small fixes (typos, a few lines) may be edited in place; git history keeps the old text.
- Never overwrite a file wholesale without first moving the old version to `trash/`.
- Never delete or edit files inside `trash/` (except appending to `trash/README.md`).
- If a task seems to require deletion (e.g. the user explicitly says "完全に削除して"), confirm with the user before doing anything.

## Rule 2: Confidentiality

- `owner_notes.md` is for ぷらぐら only. Its contents — the plan for ずんだ社 (Zunda Inc.), funding, ownership, and how profits are handled — must **not** appear in any member-facing material.
- Member-facing material: `project.md`, `dev_survey.md`, `recruit*`, and anything written for project members or for the app's codebase. Never write "ずんだ" / "Zunda", company plans, or profit/compensation plans in them.
- If unsure whether something is member-facing, ask.

## Rule 3: Source priority

- For roles and activity conditions, the recruiting materials (`recruit.md`, `recruitdocument.pdf`, `recruitslide.pdf`) take priority over brainstorm notes.
- Decisions ぷらぐら has made in conversation take priority over everything else; reflect them in the documents.

## Files

| Path | Purpose |
| --- | --- |
| `project.md` | Project overview (member-facing) |
| `owner_notes.md` | Owner-only notes (confidential) |
| `dev_survey.md` | Survey draft for developer applicants (member-facing) |
| `recruit.md`, `recruitdocument.pdf`, `recruitslide.pdf` | Recruiting materials |
| `trash/` | Retired files. See `trash/README.md` |
