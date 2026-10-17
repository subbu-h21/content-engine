"""A video project as the pipeline sees it: project.json, script.json, sfx.json and the standard folders."""
import json
from pathlib import Path


class Project:
    def __init__(self, root):
        self.root = Path(root).resolve()
        if not (self.root / "project.json").exists():
            raise SystemExit(f"not an engine project (no project.json): {self.root}")
        self.manifest = json.loads((self.root / "project.json").read_text(encoding="utf-8"))
        self.script = json.loads((self.root / "script.json").read_text(encoding="utf-8"))
        sfx = self.root / "sfx.json"
        self.sfx = json.loads(sfx.read_text(encoding="utf-8")) if sfx.exists() else {"events": [], "sceneTransitions": None}

    # folders -----------------------------------------------------------------------------------------------
    @property
    def audio(self):        # sources: per-cue voice lines (audio/vo), music, derived full voice track
        return self.root / "audio"

    @property
    def public(self):       # what Remotion serves: plates, stems, sfx
        return self.root / "public"

    @property
    def data(self):         # generated data Remotion imports
        return self.root / "src" / "data"

    @property
    def fps(self):
        return self.manifest["format"]["fps"]

    def timing(self):
        return json.loads((self.data / "timing.json").read_text())

    def path(self, p):
        """A path from project.json: absolute, or relative to the project root."""
        p = Path(p)
        return p if p.is_absolute() else self.root / p

    def save_manifest(self):
        (self.root / "project.json").write_text(json.dumps(self.manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # script ------------------------------------------------------------------------------------------------
    def scenes(self):
        """[(scene_id, [(cue_id, text, pause), ...]), ...] in script order."""
        return [(s["id"], [(c["id"], c["text"], c.get("pause", 0.0)) for c in s["cues"]]) for s in self.script["scenes"]]
