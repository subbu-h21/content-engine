"""Opening shot (s01_hook): phone on a dark table, screen lights up at the "hand" cue. 24 fps.

    ce blender <project> shot_phone.py draft | final | frame <n> [draft|final]
"""
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "lib"))
import bpy

import brain_scene as B
import phone_scene as P

ROOT = os.path.dirname(HERE)  # the project folder
OUT = os.path.join(ROOT, "renders", "phone")
FPS = 24
timing = json.load(open(os.path.join(ROOT, "src", "data", "timing.json")))
S = timing["scenes"]["s01_hook"]
DUR = S["duration"]
T_HAND = S["cues"]["hand"]["start"]
T_WHO = S["cues"]["who"]["start"]


def F(t):
    return int(round(t * FPS)) + 1


args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else ["draft"]
mode = args[0]
sc = B.reset()
sc.frame_start, sc.frame_end = 1, F(DUR)

P.build_table()
root, parts = P.build_phone(screen_image=os.path.join(HERE, "assets", "lockscreen.png"))
root.rotation_euler = (0, 0, math.radians(-7))
P.key_screen(parts, 0.0, 0.0)
# notification: quick ramp up, slight overshoot, settle
P.key_screen(parts, 0.0, F(T_HAND) - 1)
P.key_screen(parts, 7.5, F(T_HAND + 0.12))
P.key_screen(parts, 5.5, F(T_HAND + 0.5))
P.key_screen(parts, 5.5, F(T_WHO + 0.4))
# second buzz on "who did": brief flicker brighter
P.key_screen(parts, 7.0, F(T_WHO + 0.55))
P.key_screen(parts, 5.5, F(T_WHO + 0.9))
P.key_screen(parts, 5.5, F(DUR))

# vibration: tiny z-rotation jitter for 0.35 s when the notification lands
for i in range(9):
    f = F(T_HAND) + i
    root.rotation_euler[2] = math.radians(-7 + (0.35 if i % 2 == 0 else -0.35) * (1 if i < 8 else 0))
    root.keyframe_insert("rotation_euler", frame=f, index=2)
root.rotation_euler[2] = math.radians(-7)
root.keyframe_insert("rotation_euler", frame=F(T_HAND) + 9, index=2)

# room: a faint cool top light; the screen is the key once it is on
bpy.ops.object.light_add(type='AREA', location=(1.6, -1.2, 2.8))
k = bpy.context.object
k.data.energy = 34
k.data.size = 2.5
k.data.color = (0.70, 0.78, 1.0)
B.world(haze=0.0)

# camera: slow push-in from high angle, drifting a little
cam, tgt = B.camera((1.15, -1.95, 3.55), (0.0, 0.50, 0.05), lens=50, fstop=2.2, focus=parts["screen"])
cam.keyframe_insert("location", frame=1)
cam.location = (0.92, -1.62, 3.05)
cam.keyframe_insert("location", frame=F(DUR))
tgt.keyframe_insert("location", frame=1)
tgt.location = (0.0, 0.56, 0.05)
tgt.keyframe_insert("location", frame=F(DUR))

if mode == "frame":  # one frame for checks: frame <n> [draft|final] -> renders/phone/check/
    q = args[2] if len(args) > 2 else "draft"
    sc.render.resolution_percentage = 25 if q == "draft" else 100
    B.use_eevee(16 if q == "draft" else 64)
    sc.frame_start = sc.frame_end = int(args[1])
    B.png_out(os.path.join(OUT, "check", "f_"))
elif mode == "draft":
    sc.render.resolution_percentage = 25
    B.use_eevee(16)
    B.png_out(os.path.join(OUT, "draft", "f_"))
else:
    sc.render.resolution_percentage = 100
    B.use_eevee(64)
    B.png_out(os.path.join(OUT, "final", "f_"))
sc.render.use_motion_blur = True
sc.render.motion_blur_shutter = 0.5
bpy.ops.render.render(animation=True)
print("PHONE_DONE", mode)
