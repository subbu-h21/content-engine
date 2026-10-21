# Conventions for Claude Code in the content engine

- Read `HANDOFF.md` first (current state, the user's working rules, running engines, how to test, what's left), then `README.md`. Video projects live in the workspace (`ce settings`), not here; each has its own CLAUDE.md.
- `template/` changes only affect projects created afterwards. Existing projects keep their copy; port a fix to one
  only when the user asks.
- `runtime/package.json` versions are pinned and shared by every project: changing one can change existing videos.
  Ask the user first, then re-verify with the phone reel (below).
- Keep `cli/projects.mjs` free of console output and process exits: the website imports it.
- Website (`app/`): after changing `app/web/src`, run `npm run build` in `app/` (`ce app` only builds when `dist/` is
  missing). Keep the server's safety checks: listen on 127.0.0.1 only, reject foreign Host/Origin, chat socket
  only from the engine's own page. `app/` has its own packages; don't add website packages to `runtime/`.
- Testing the website while the user's engine runs: build into another folder (`node build.mjs D:\tmp\<dist>`) and
  start the scratch engine with `CE_APP_DIST` pointing there. `npm run build` replaces the `app/dist` the user's
  engine serves, so a new page would meet the old server until the user restarts it.
- The Claude chat (`app/server/claude.mjs` ↔ `app/web/src/Chat.tsx`) runs Claude Code with stream-json in and out.
  Its message shapes come from Claude Code itself (probed on 2.1.304): re-check them after a Claude Code update if the
  chat misbehaves (`tests/e2e/t13_real_claude_chat.mjs`, `t14_tui_resume.mjs`).
- The bridge contract (template `EngineBridge.tsx` ↔ `app/server/bridge.mjs`): POST `/api/bridge/<p>/state` and
  `/result` as text/plain JSON, commands over SSE `/api/bridge/<p>/events`. Changing it means updating both sides and
  the copy in every existing project that should keep working with the website.
- The new-video flow lives in `template/.claude/skills/make-video/SKILL.md` (what Claude does) and
  `app/server/brief.mjs` + `app/web/src/BriefBoard.tsx` (what the board reads). The file names and `brief/status.json`
  stages are the contract between them: change both together.
- Test against a scratch workspace: `CE_WORKSPACE=D:\tmp\<dir>` and `CE_APP_PORT=<port>` (not 4190 or other ports
  browsers block) override the settings, so the user's own `ce app` on 4100 keeps running.
- Never run tests that let a Claude panel receive a "post this video" message: it would act in the user's real Chrome
  and accounts. YouTube is tested against a fake Google (`CE_GOOGLE_AUTH_URL`, `CE_GOOGLE_TOKEN_URL`,
  `CE_YOUTUBE_API`) with `CE_SECRETS_DIR` and `CE_SETTINGS_FILE` pointing into the scratch folder.
- Test the website headlessly with Remotion's chrome-headless-shell (`runtime/node_modules/.remotion/...`) over the
  DevTools protocol (`ws` is in `app/node_modules`); an MCP client is in `@modelcontextprotocol/sdk`.
- Pipeline steps must stay deterministic and idempotent, and must never make a paid API call for a file that exists.
- Regression check after touching `template/src` or `pipeline/`: build the reel into a scratch workspace
  (`node migrations/phone-reel/migrate.mjs --workspace D:\tmp\<dir>`) and compare stills or a full render with
  `project-3-development` (framemd5 of video + audio must match), and pipeline outputs byte for byte.
- User rules: ask before adding dependencies; no commits or pushes unless asked; clear doubts before building;
  verify visually and say what was and wasn't checked.
