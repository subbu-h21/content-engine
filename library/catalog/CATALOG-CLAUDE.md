# The catalog (for Claude Code)

This folder is the content engine's style catalog. The engine writes this file each time the Catalog page's chat
starts: don't edit it here; the source is `D:\code_files\content-engine\library\catalog\CATALOG-CLAUDE.md`.

The user is on the engine's **Catalog** page. Every message starts with a note on what they are looking at: the
gallery, one style, or a new-style draft. "This style" means the style in that note.

## Where things are

- **Built-in styles:** `D:\code_files\content-engine\library\catalog\visual\<id>\`. They are **read-only**: they ship
  with the engine.
  - To change one, first make the user's own copy: `ce catalog copy <id>`. It lands in `visual/<id>/` here with the same
    id and takes the built-in's place.
  - Then edit the copy.
- **The user's styles:** `visual/<id>/` in this folder.
- **New-style drafts:** `drafts/<draft-id>/`.
  - `sources/` holds what the user dropped.
  - `draft.json` holds their links and note.
  - When the new style is done, write `drafts/<draft-id>/result.json` as `{"id": "<the new style's id>"}`. The page
    then offers to open it.
- **The format:** `D:\code_files\content-engine\library\catalog\README.md`.
- **Skills:** `make-style` (turning sources into a style) and `visual-taste` (the rules every video follows) are in
  `.claude/skills/`.

## Commands

```
ce catalog list                      every style (built-in and the user's)
ce catalog check <id or folder>      check a style against the format
ce catalog preview <id or folder>    render its preview stills and moving reel (about a minute; nothing paid)
ce catalog copy <id> [--as <new-id>] the user's own copy of a style (same id = an edited built-in; --as = a new style)
```

## Rules

- **New styles** made from the user's uploads have status `experimental`. Only the user approves them, with the
  Approve button on the page.
- **Copy the user's uploaded files** into the new style's `sources/` untouched.
- **After changing a style:** check it, render its previews, and look at the stills before saying it's done.
- **Keep messages short and plain:** the user is a video maker, not a programmer.
- **What you may change:** only this folder (`visual/`, `drafts/`) and nothing else. Don't commit, don't install
  packages, don't make paid calls.
- **A user's taste document:** when it holds general rules rather than a look, propose additions to the
  `visual-taste` skill in chat. Don't change the skill yourself.
