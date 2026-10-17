# Blender builders

Reusable scene builders for Blender 5.1 (bpy), from the phone reel. A project that needs one copies this whole folder
(with `assets/`) into its own `blender/lib/`, so later changes here never alter a finished video.

- `brain_scene.py`: realistic brain (FreeSurfer fsaverage7 pial cortex from `assets/brain_fs7.obj`, sulcal depth from
  `assets/brain_fs7_sulc.f32`, procedural cerebellum and brainstem), wet tissue material with SSS, dark cinematic
  lights, world haze, camera with depth of field, Eevee/Cycles setup, PNG output. Vertical 1080x1920 by default (`W`, `H`).
- `phone_scene.py`: procedural smartphone (rounded slab, bevelled titanium frame, glossy screen whose emission can be
  keyed, optional lock-screen texture via `build_phone(screen_image=...)`) and a dark textured table.

Shot scripts live in the project's `blender/` folder and start with:

```python
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "lib"))
import brain_scene as B
ROOT = os.path.dirname(HERE)  # the project; timing is in src/data/timing.json
```

Run them with `ce blender <project> <shot>.py <args>`.

## Blender 5.1 notes

- `action.fcurves` is gone: iterate `action.layers[].strips[].channelbags[].fcurves`, or set
  `preferences.edit.keyframe_new_interpolation_type` before inserting keys.
- Video output: set `image_settings.media_type = 'VIDEO'` before `file_format = 'FFMPEG'`.
- `scene.node_tree` (compositor) no longer exists; bloom is baked by `ce pipeline plates` instead.
- Re-fetch `preferences.addons['cycles'].preferences` after `read_factory_settings()` or Blender crashes.
- On the RTX 3050 (4 GB), Cycles with SSS + volume at 1080x1920 was ~4 min/frame; Eevee ~12 s/frame at 64 spp and
  looks close. Finals are Eevee.
- Accent lights use `volume_factor = 0` so they don't light the haze.
