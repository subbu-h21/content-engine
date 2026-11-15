# Content engine

A website that runs on your own Windows PC for making explainer videos with Claude. You describe a video; Claude
talks it through with you and writes the script and the look. After you approve, the engine:

- records the voice and makes music (through OpenRouter)
- builds the 3D shots in Blender and the 2D animation in Remotion
- renders the final video
- publishes it to YouTube, Facebook and Instagram

Each video is a folder `project-N-<name>` in a **workspace** folder you choose. Everything a video needs lives in that
folder.

This guide sets the engine up on a new PC. How the engine works inside, and what was tested, is in
[docs/ENGINE.md](docs/ENGINE.md).

## Contents

1. [What you need](#1-what-you-need)
2. [Install the prerequisites](#2-install-the-prerequisites)
3. [Get the engine onto the PC](#3-get-the-engine-onto-the-pc)
4. [Run setup.bat](#4-run-setupbat)
5. [Workspace and OpenRouter key](#5-workspace-and-openrouter-key)
6. [Start the engine](#6-start-the-engine)
7. [Connect YouTube, Facebook and Instagram](#7-connect-youtube-facebook-and-instagram)
8. [Moving from another PC](#8-moving-from-another-pc)
9. [Everyday use and updates](#9-everyday-use-and-updates)
10. [Troubleshooting](#10-troubleshooting)
11. [Commands](#11-commands)

## 1. What you need

**The computer**

- **Windows 11** (64-bit). Windows 10 should work, but the website's fonts (Sitka, Segoe UI Variable) look best on 11.
  The engine is Windows-only: it uses Windows folder links, `cmd` scripts and the Recycle Bin.
- **At least 20 GB free** on the drive that holds the workspace (`ce doctor` checks this). Final renders and
  Blender frames take many GB per video. Use a drive other than C: if C: is small.
- **An NVIDIA RTX graphics card** for videos with 3D shots: they render in Blender with Cycles and NVIDIA OptiX. Videos
  without 3D don't use Blender.
- **An internet connection**: voice, music, Claude and publishing all go online.

**Accounts**

| Account | What for | Cost |
|---|---|---|
| Claude (claude.ai) with a Pro or Max plan, or an Anthropic Console account | The Claude chat inside the engine (Claude Code) | Subscription or pay per use |
| [OpenRouter](https://openrouter.ai/) with credit and an API key | Voice recording and music | Pay per use |
| GitHub access to `subbu-h21/content-engine` (private) | Downloading the engine (or copy the folder instead) | Free |
| A Google account with a YouTube channel | Uploading to YouTube (needs a Google Cloud project, set up in step 7) | Free |
| A Facebook Page you manage, plus an Instagram **professional** account (Business or Creator) linked to that Page | Posting Reels and videos (needs a Meta developer app, set up in step 7) | Free |

YouTube, Facebook and Instagram are optional: the engine makes videos without them.

## 2. Install the prerequisites

`setup.bat` checks for these tools but doesn't install them. Install them first, in this order. Keep the default install
locations unless noted.

| # | Tool | Version | Where | Notes |
|---|---|---|---|---|
| 1 | **Git for Windows** | latest | <https://git-scm.com/download/win> | Downloads the engine (step 3). Claude Code on Windows uses its Git Bash. |
| 2 | **Node.js** | 24 LTS (20 at least) | <https://nodejs.org/> (LTS installer) | Runs the engine and its website. |
| 3 | **Python** | 3.12 | <https://www.python.org/downloads/> (a 3.12.x installer) | On the installer's first screen tick **"Add python.exe to PATH"**. Use 3.12: the pinned packages were tested on it. |
| 4 | **ffmpeg** (with ffprobe) | 8.x full build | In a terminal: `winget install Gyan.FFmpeg` | Audio, video copies and checks. |
| 5 | **Blender** | 5.1 | <https://www.blender.org/download/> | The 3D shots. Expected at `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe`. Another location can be set in Settings. |
| 6 | **Claude Code** | current | <https://claude.com/claude-code> (follow the Windows install) | After installing, open a terminal, run `claude` once and sign in with your Claude account. |
| 7 | **Google Chrome** + the **Claude in Chrome** extension | optional | <https://www.google.com/chrome/> | Only for the backup way of posting to Facebook/Instagram ("Other way" on the Publish page) and for Settings → Check Chrome. |

**Then close every terminal and open a new one**, so the new PATH entries are seen. Check that each tool answers:

```
git --version
node --version
python --version
ffmpeg -version
ffprobe -version
claude --version
```

If `python` opens the Microsoft Store or says "Python was not found", see [Troubleshooting](#10-troubleshooting).

## 3. Get the engine onto the PC

Pick a folder on a drive with space, ideally a path without spaces, for example `D:\content-engine`.

**With git** (recommended, since updates are then one command):

```
git clone https://github.com/subbu-h21/content-engine.git D:\content-engine
```

The repository is private. Git asks you to sign in to GitHub the first time: a browser window opens, so sign in with
an account that has access.

**Without git:** copy the engine folder from the other PC. Leave out `runtime\node_modules`, `app\node_modules`,
`app\dist` and `models`: setup makes them again. Copying `secrets\` and `settings.json` is covered in
[step 8](#8-moving-from-another-pc).

## 4. Run setup.bat

Double-click `setup.bat` in the engine folder, or run it in a terminal. It takes a few minutes the first time. It:

1. **checks the tools**: Node, Python, ffmpeg, ffprobe and Claude Code. Anything missing is listed as `MISSING`, with
   where to get it.
2. **installs the engine's packages**: the video packages (`runtime\`) and the website's (`app\`), at the exact
   versions in their `package-lock.json`.
3. **builds the website** (`app\dist`).
4. **installs the Python packages**: numpy, scipy and pillow at fixed versions, so audio comes out identical on every
   PC; Whisper, which transcribes reference videos locally (it brings PyTorch, a large download); and yt-dlp, which
   downloads reference links.
5. **runs `ce doctor`**, a checklist of the whole machine.

Each check prints `ok`, `MISSING` or `FAIL`. Fix whatever is `MISSING` or `FAIL` and run `setup.bat` again: it skips
what's already installed. On a brand-new PC, `FAIL workspace (not set)` is expected; step 5 sets it.

npm may print warnings about "install scripts not yet covered by allowScripts" for esbuild and node-pty. They are
harmless: esbuild works without its script, and node-pty isn't used.

## 5. Workspace and OpenRouter key

1. Make a folder for the videos, for example `D:\videos`. It holds every video, so put it on the drive with space.
2. In that folder create a text file named exactly `.env` (no `.txt` at the end) containing one line:

   ```
   OPENROUTER_API_KEY=sk-or-v1-...
   ```

   Your key is at <https://openrouter.ai/keys>. The engine finds the `.env` in a video's folder or any folder above it,
   so one file in the workspace covers every video. Treat this file like a password: don't send it or put it in git.

## 6. Start the engine

Double-click **`start.bat`**. A terminal window opens with the engine's log, and the browser opens
<http://127.0.0.1:4100>. **Keep that window open**: closing it, or pressing Ctrl+C in it, stops the engine and
everything it started.

If the engine is already running, `start.bat` just opens the page.

First time only:

1. **Settings → General**: choose the workspace folder from step 5. Blender's and Python's paths are filled in;
   change them only if you installed them somewhere else. Each one is checked when you save.
2. **Videos** (home page): type what you want to make under "What do you want to create today?" and press Create.
   The video's Brief opens and Claude starts talking it through in the chat on the right.

Downloaded on first use, automatically:
- Remotion's own headless browser, the first time a video is rendered
- the Whisper speech model (about 460 MB), the first time a reference video is studied

The website only listens on this PC (`127.0.0.1`), so other computers can't reach it. If the PC is a remote or cloud
machine, use the engine through Remote Desktop on that machine. Don't open the port to the network or a tunnel: the
website has no login, and it can run Claude, delete videos and post to your accounts. A tunnel to it shows
"forbidden host" on purpose. To watch your videos on your phone, use the viewer below instead.

### Watch your videos on your phone

Double-click **`viewer.bat`**. It starts a small read-only page with every rendered video (it can only list and play
them) and a cloudflared tunnel to it, then prints a link like `https://….trycloudflare.com/?k=…`. Open that link on
your phone. Keep the window open while you watch; closing it stops both.

- It needs cloudflared installed (`winget install Cloudflare.cloudflared`). The engine website doesn't need to run.
- The `?k=…` part is a secret key, the only lock: share the link only with people who may see your videos. To shut
  out old links, run `ce viewer --tunnel --new-key` (or `viewer.bat --new-key`).
- The tunnel's address changes every time you start it; the key stays the same.

## 7. Connect YouTube, Facebook and Instagram

Both are one-time setups done from the website, with step-by-step instructions and links on each settings page.
Each takes about 10 minutes.

**YouTube** (Settings → YouTube):
- Google Cloud project, *YouTube Data API v3* enabled, Google Auth Platform app, a **Desktop app** client.
- Paste its Client ID and secret, press **Connect** and allow access for your channel.
- Publish the Google Auth Platform app to **In production**. In *Testing* the sign-in expires every 7 days.
- After that the engine renews its access by itself. Uploads are **private** by default; you publish them in YouTube
  Studio, or pick unlisted, public or scheduled on the Publish page.
- If a Google Cloud project already exists from another PC, reuse it: copy its Client ID and secret (Google Cloud →
  Google Auth Platform → Clients) instead of making a new one.

**Facebook & Instagram** (Settings → Facebook Page & Instagram):
- A Meta app at <https://developers.facebook.com/apps/>, with the "manage your Page" and "Instagram content
  publishing" use cases.
- Its Valid OAuth Redirect URI set to `http://localhost:4100/`. The page shows the exact value; it changes only if the
  port changes.
- It stays in Development mode. Paste its App ID and secret and press **Connect**.
- On Facebook's screen, choose your Page and its Instagram account.
- If Facebook refuses the redirect, the same page has a "paste a token instead" route through the Graph API Explorer.
- The sign-in lasts about 60 days; the engine shows when it ends, and connecting again renews it. To reuse the app
  from another PC, enter the same App ID and secret here.

## 8. Moving from another PC

- **Videos**: copy the workspace folder, but not the `node_modules` links inside each video. `robocopy` with `/XJ` skips
  them:

  ```
  robocopy D:\old\videos D:\videos /E /XJ
  ```

  Then recreate the links: `D:\content-engine\ce.cmd link`. `ce doctor` shows "project package links ok" when that's
  done.
- **The OpenRouter key**: copy the `.env` from the old workspace, or make a new one (step 5).
- **Settings**: `settings.json` (workspace and paths, posting defaults) is per PC and not in git. Set them again in
  Settings, or copy the file and correct the paths.
- **YouTube / Facebook / Instagram sign-ins**: connecting again in Settings is the clean way. Alternatively, copy the
  engine's `secrets\` folder from the old PC. It holds the sign-ins, so treat it like passwords: copy it directly, never
  by email or chat. A Facebook sign-in copied this way still ends on its original date.
- **Earlier Claude conversations** of a video show in its chat only if the video's folder has the same path as before:
  Claude Code files them under the folder's full path, in `%USERPROFILE%\.claude\projects\`.

## 9. Everyday use and updates

- Start with `start.bat`; stop by closing its window. A render or upload that was running shows as *interrupted* on
  the next start; press Resume.
- Check the machine any time with `ce.cmd doctor`.
- **Update the engine**, with the engine stopped:

  ```
  cd D:\content-engine
  git pull
  ```

  Then:
  - if `runtime\package-lock.json` or `app\package-lock.json` changed, delete that folder's `node_modules` and run
    `setup.bat`.
  - if anything under `app\web` changed, rebuild the website: delete `app\dist` and run `setup.bat`, or run
    `npm run build` in `app\`.

  Existing videos keep their own copy of the template's code, so an update doesn't change how they look.

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| `python` opens the Microsoft Store, or "Python was not found" | Windows' placeholder is answering. Install Python 3.12 with "Add python.exe to PATH" ticked, and turn off the `python.exe` / `python3.exe` entries in Settings → Apps → Advanced app settings → App execution aliases. Open a new terminal. |
| A tool is `MISSING` right after installing it | Open a new terminal (or sign out and in) so the new PATH is seen, then run `setup.bat` again. |
| `MISSING yt-dlp on PATH` / `whisper on PATH` | Python's Scripts folder isn't on PATH. Add `%LOCALAPPDATA%\Programs\Python\Python312\Scripts` (the usual location) to your user PATH. |
| `FAIL blender` | Blender isn't at the default path: set its `blender.exe` in Settings → General. |
| `FAIL project package links` | Run `ce.cmd link` (after copying videos from another PC, or after reinstalling packages). |
| Port 4100 is taken by another program | Pick another port: `ce.cmd settings appPort 4200`, then start again. For Facebook, also change the app's redirect URI to `http://localhost:4200/`. |
| The Claude chat doesn't start | In a new terminal, run `claude --version`, then `claude` to check you're signed in. The engine finds Claude Code through PATH. |
| Claude's **Terminal** window asks whether to trust the folder | Choose *Yes, I trust this folder*. The highlighted default is *No, exit*. |
| YouTube asks to connect again every week | The Google Auth Platform app is still in *Testing*: publish it to *In production*. |
| Voice or music fails with "OPENROUTER_API_KEY not found" | The `.env` from step 5 is missing, misnamed (`.env.txt`), or not in the workspace or above the video. |

## 11. Commands

`ce.cmd` in the engine folder runs the engine's commands from a terminal. Add the folder to PATH to type just `ce`.

```
ce app [--no-open]                  # start the website (what start.bat does)
ce viewer [--tunnel] [--new-key]    # the read-only video viewer for your phone (viewer.bat = ce viewer --tunnel)
ce doctor                           # check node, Python packages, ffmpeg, Blender, disk, video links
ce settings [key value]             # show or change settings (workspace, python, blender, appPort)
ce new <name> --title "..."         # a new video folder from the template (the website's Create does this)
ce list                             # the videos in the workspace
ce link [video]                     # repair the videos' package links
ce pipeline <video> <step>          # run one pipeline step: vo | music | stems | sfx | plates | captions | audio | refs
ce blender <video> <shot>.py <args> # run a video's Blender shot script without Blender's window
```

`<video>` is a folder path, a folder name in the workspace, or a video's number.

| Folder | What |
|---|---|
| `app/` | The website: server (`server/`) and page (`web/`, built into `dist/`) |
| `runtime/` | The video packages (Remotion, React), shared by every video through a folder link |
| `template/` | What a new video starts as |
| `pipeline/` | Python steps: voice, music, stems, sound effects, 3D plates, captions, references |
| `library/blender/` | Reusable Blender scene builders and assets |
| `cli/` | The `ce` commands |
| `docs/ENGINE.md` | How it all works, and what was tested |
| `secrets/`, `settings.json`, `models/` | Per PC, not in git: sign-ins, the viewer's key, settings, the Whisper model |
