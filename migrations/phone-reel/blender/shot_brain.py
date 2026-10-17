"""One continuous brain sequence covering scenes s02..s07 (t = 9.71 s .. end), 24 fps.

    ce blender <project> shot_brain.py draft            (25 %, 16 samples, all frames)
    ce blender <project> shot_brain.py final [f0 f1]    (100 %, 64 samples, optional frame range)
    ce blender <project> shot_brain.py stills           (50 % stills at scene midpoints)
    ce blender <project> shot_brain.py markers          (no render: only the marker export)
    ce blender <project> shot_brain.py frame <n> [draft|final]   (one frame -> renders/brain/check/)

Always writes src/data/markers.json: per-frame screen positions (px, 1080x1920) of the
points the 2D layer labels (cue, response, want, like, search target, centre).
"""
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "lib"))
import bpy
import mathutils
from bpy_extras.object_utils import world_to_camera_view

import brain_scene as B

ROOT = os.path.dirname(HERE)  # the project folder
OUT = os.path.join(ROOT, "renders", "brain")
FPS = 24
timing = json.load(open(os.path.join(ROOT, "src", "data", "timing.json")))
SC = timing["scenes"]
T0 = SC["s02_boredom"]["start"]
T_END = timing["total"]


def cue(scene, c):
    return SC[scene]["start"] + SC[scene]["cues"][c]["start"]


def F(t):
    """global time (s) -> brain-sequence frame (1-based)."""
    return int(round((t - T0) * FPS)) + 1


def sph(d, az, el):
    az, el = math.radians(az), math.radians(el)
    return (d * math.cos(el) * math.sin(az), d * math.cos(el) * math.cos(az), d * math.sin(el))


def key(ob, path, value, t, index=-1):
    if index >= 0:
        getattr(ob, path)[index] = value
    else:
        setattr(ob, path, value)
    ob.keyframe_insert(path, frame=F(t), index=index)


def key_input(inp, value, t):
    inp.default_value = value
    inp.keyframe_insert("default_value", frame=F(t))


# ------------------------------------------------------------------ build
args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else ["draft"]
mode = args[0]
sc = B.reset()
sc.frame_start, sc.frame_end = 1, F(T_END)
rig, parts = B.build_brain()
cortex = parts["cortex"]
L = B.lights()
B.world(haze=0.006)
cam, tgt = B.camera(sph(9.5, 35, 18), (0, 0.05, 0.32), lens=60, fstop=2.8)

# -- camera path (continuous slow orbit, varying distance)
CAM_KEYS = [
    (T0, 9.5, 35, 18, 60),
    (SC["s03_cue"]["start"], 7.6, 78, 12, 58),
    (SC["s04_relief"]["start"], 7.0, 95, 10, 58),
    (SC["s05_loop"]["start"], 6.8, 103, 14, 58),
    (SC["s06_wanting"]["start"], 6.2, 112, 18, 60),
    (SC["s07_insight"]["start"], 6.8, 124, 22, 58),
    (T_END, 11.5, 160, 28, 58),
]
for t, d, az, el, lens in CAM_KEYS:
    key(cam, "location", sph(d, az, el), t)
    cam.data.lens = lens
    cam.data.keyframe_insert("lens", frame=F(t))

# -- light fade up at the start, fade down at the end
for name, e in (("key", 230), ("rim", 420), ("fill", 12)):
    ob = L[name]
    key_input_like = ob.data
    key_input_like.energy = 0.0; key_input_like.keyframe_insert("energy", frame=F(T0))
    key_input_like.energy = e; key_input_like.keyframe_insert("energy", frame=F(T0 + 2.2))
    key_input_like.energy = e; key_input_like.keyframe_insert("energy", frame=F(cue("s07_insight", "end") - 0.3))
    key_input_like.energy = e * (0.30 if name == "rim" else 0.05); key_input_like.keyframe_insert("energy", frame=F(cue("s07_insight", "end") + 1.8))
    key_input_like.energy = e * (0.20 if name == "rim" else 0.03); key_input_like.keyframe_insert("energy", frame=F(T_END))
# cool, dim wash for "relief" (key light colour shifts cold for ~3 s)
kd = L["key"].data
for t, col in ((cue("s04_relief", "relief") - 0.2, (1.0, 0.92, 0.84)), (cue("s04_relief", "relief") + 0.8, (0.78, 0.86, 1.0)),
               (SC["s05_loop"]["start"] - 0.6, (0.78, 0.86, 1.0)), (SC["s05_loop"]["start"] + 0.4, (1.0, 0.92, 0.84))):
    kd.color = col; kd.keyframe_insert("color", frame=F(t))


# ------------------------------------------------------------------ surface helpers
dg = bpy.context.evaluated_depsgraph_get()
cortex_eval = cortex.evaluated_get(dg)


def surface_point(az, el, lift=0.015):
    """Ray from outside toward the brain centre along direction (az, el); returns (hit + n*lift, normal)."""
    d = mathutils.Vector(sph(1, az, el))
    origin = d * 4.0
    ok, loc, nrm, _ = cortex_eval.ray_cast(origin, -d)
    if not ok:
        return origin.normalized() * 0.8, origin.normalized()
    return loc + nrm * lift, nrm


def surface_path(a0, e0, a1, e1, n=28, bulge=10.0, lift=0.014):
    pts = []
    for i in range(n + 1):
        u = i / n
        az = a0 + (a1 - a0) * u
        el = e0 + (e1 - e0) * u + bulge * math.sin(math.pi * u)
        p, _ = surface_point(az, el, lift)
        pts.append(p)
    return pts


# marker directions (right hemisphere faces the camera for az 75..135)
CUE_DIR = (128, 34)        # parietal, camera-facing side
RESP_DIR = (56, 26)        # prefrontal, camera-facing side
WANT_DIR = (95, 8)         # lateral temporal/insular area, as "wanting" stand-in
LIKE_DIR = (60, -14)       # orbitofrontal-ish, lower front
P_CUE, N_CUE = surface_point(*CUE_DIR)
P_RESP, N_RESP = surface_point(*RESP_DIR)
P_WANT, _ = surface_point(*WANT_DIR)
P_LIKE, _ = surface_point(*LIKE_DIR)

# ------------------------------------------------------------------ the pathway (cue -> response)
pts = surface_path(CUE_DIR[0], CUE_DIR[1], RESP_DIR[0], RESP_DIR[1], lift=0.002)
cd = bpy.data.curves.new("pathway", 'CURVE'); cd.dimensions = '3D'
spl = cd.splines.new('NURBS'); spl.points.add(len(pts) - 1)
for p, q in zip(spl.points, pts):
    p.co = (q.x, q.y, q.z, 1.0)
spl.order_u = 4; spl.use_endpoint_u = True
cd.bevel_depth = 0.0055; cd.bevel_resolution = 6; cd.use_fill_caps = True
cd.bevel_factor_start, cd.bevel_factor_end = 0.0, 0.0
path = bpy.data.objects.new("pathway", cd); bpy.context.collection.objects.link(path); path.parent = rig
EMBER, ICE = (1.0, 0.36, 0.10), (0.45, 0.75, 1.0)
pm = B.emissive_material("pathway", EMBER, 0.0); path.data.materials.append(pm)
p_em = pm.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
p_col = pm.node_tree.nodes["Principled BSDF"].inputs["Emission Color"]

# nodes at both ends: small emissive spheres + point lights (light the tissue)
def node(name, pos, color):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.014, segments=32, ring_count=16, location=pos)
    s = bpy.context.object; s.name = name; bpy.ops.object.shade_smooth(); s.parent = rig
    m = B.emissive_material(name + "_m", color, 0.0); s.data.materials.append(m)
    bpy.ops.object.light_add(type='POINT', location=pos + N_CUE * 0.08); lt = bpy.context.object; lt.name = name + "_light"
    lt.data.energy = 0.0; lt.data.volume_factor = 0.0; lt.data.color = color; lt.data.shadow_soft_size = 0.08; lt.parent = rig
    return s, m.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"], m.node_tree.nodes["Principled BSDF"].inputs["Emission Color"], lt

cue_s, cue_em, cue_col, cue_l = node("cue_node", P_CUE, EMBER)
resp_s, resp_em, resp_col, resp_l = node("resp_node", P_RESP, EMBER)

# travelling signal: sphere + light following the curve
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.016, segments=32, ring_count=16); sig = bpy.context.object; sig.name = "signal"
bpy.ops.object.shade_smooth(); sig_m = B.emissive_material("signal_m", EMBER, 0.0); sig.data.materials.append(sig_m)
sig_em = sig_m.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
fp = sig.constraints.new('FOLLOW_PATH'); fp.target = path; fp.use_fixed_location = True; fp.offset_factor = 0.0
bpy.ops.object.light_add(type='POINT', location=(0, 0, 0)); sig_l = bpy.context.object; sig_l.name = "signal_light"
sig_l.data.color = EMBER; sig_l.data.volume_factor = 0.0; sig_l.data.energy = 0.0; sig_l.data.shadow_soft_size = 0.12; sig_l.parent = sig
sig_l.location = N_CUE * 0.06  # a touch off the surface


def signal_run(t0, t1, energy=60, size=1.0):
    """Signal travels cue -> response between t0 and t1."""
    fp.offset_factor = 0.0; fp.keyframe_insert("offset_factor", frame=F(t0))
    fp.offset_factor = 1.0; fp.keyframe_insert("offset_factor", frame=F(t1))
    for t, e in ((t0 - 0.05, 0.0), (t0 + 0.08, energy), (t1 - 0.08, energy), (t1 + 0.05, 0.0)):
        sig_l.data.energy = e; sig_l.data.keyframe_insert("energy", frame=F(t))
        key_input(sig_em, 30.0 * size if e > 0 else 0.0, t)


# ------------------------------------------------------------------ "searching" attention spot (s02)
bpy.ops.object.empty_add(location=(0, 0, 1)); s_tgt = bpy.context.object; s_tgt.name = "search_tgt"
bpy.ops.object.light_add(type='SPOT', location=(3.0, 4.5, 4.5)); spot = bpy.context.object; spot.name = "search"
spot.data.energy = 0.0; spot.data.volume_factor = 0.0; spot.data.color = ICE; spot.data.spot_size = math.radians(14); spot.data.spot_blend = 0.7; spot.data.shadow_soft_size = 0.3
c = spot.constraints.new('TRACK_TO'); c.target = s_tgt; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
t_s0, t_s1 = cue("s02_boredom", "lock") - 0.3, cue("s03_cue", "cue")
for f in range(F(t_s0), F(t_s1) + 1):
    t = T0 + (f - 1) / FPS
    u = t - t_s0
    az = 70 + 38 * math.sin(0.9 * u) + 12 * math.sin(2.3 * u + 1.0)
    el = 22 + 22 * math.sin(1.4 * u + 0.6) + 6 * math.sin(3.1 * u)
    p, _ = surface_point(az, el, 0.0)
    s_tgt.location = p; s_tgt.keyframe_insert("location", frame=f)
for t, e in ((t_s0, 0.0), (t_s0 + 0.8, 450.0), (cue("s03_cue", "shortcut") + 0.6, 450.0), (cue("s03_cue", "cue"), 0.0)):
    spot.data.energy = e; spot.data.keyframe_insert("energy", frame=F(t))

# ------------------------------------------------------------------ regions for wanting / liking (s06)
def region_spot(name, pos, color, size_deg):
    bpy.ops.object.light_add(type='SPOT', location=pos * 3.2); sp = bpy.context.object; sp.name = name
    sp.data.energy = 0.0; sp.data.volume_factor = 0.0; sp.data.color = color; sp.data.spot_size = math.radians(size_deg); sp.data.spot_blend = 0.9
    bpy.ops.object.empty_add(location=pos); e = bpy.context.object; e.name = name + "_tgt"
    c = sp.constraints.new('TRACK_TO'); c.target = e; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    return sp

want = region_spot("want", P_WANT, EMBER, 20)
like = region_spot("like", P_LIKE, ICE, 24)

# ------------------------------------------------------------------ timeline of the pathway story
tc = cue("s03_cue", "cue"); tr = cue("s03_cue", "response")
# cue node lights
for t, e in ((tc - 0.05, 0.0), (tc + 0.25, 1.0)):
    key_input(cue_em, 25.0 * e, t); cue_l.data.energy = 18.0 * e; cue_l.data.keyframe_insert("energy", frame=F(t))
# pathway draws cue -> response, response node lights at the end
cd.bevel_factor_end = 0.0; cd.keyframe_insert("bevel_factor_end", frame=F(tr - 0.1))
cd.bevel_factor_end = 1.0; cd.keyframe_insert("bevel_factor_end", frame=F(tr + 1.1))
key_input(p_em, 0.0, tr - 0.1); key_input(p_em, 6.0, tr + 0.2)
for t, e in ((tr + 0.9, 0.0), (tr + 1.2, 1.0)):
    key_input(resp_em, 25.0 * e, t); resp_l.data.energy = 18.0 * e; resp_l.data.keyframe_insert("energy", frame=F(t))
signal_run(tr - 0.1, tr + 1.1, energy=10)

# relief: everything cools to ice, then returns warm as the loop starts
trel = cue("s04_relief", "relief")
for inp in (p_col, cue_col, resp_col):
    key_input(inp, (*EMBER, 1), trel - 0.1); key_input(inp, (*ICE, 1), trel + 0.9)
    key_input(inp, (*ICE, 1), SC["s05_loop"]["start"] - 0.5); key_input(inp, (*EMBER, 1), SC["s05_loop"]["start"] + 0.6)
for lt in (cue_l, resp_l):
    for t, col in ((trel - 0.1, EMBER), (trel + 0.9, ICE), (SC["s05_loop"]["start"] - 0.5, ICE), (SC["s05_loop"]["start"] + 0.6, EMBER)):
        lt.data.color = col; lt.data.keyframe_insert("color", frame=F(t))
key_input(p_em, 6.0, trel - 0.1); key_input(p_em, 2.0, trel + 1.2)   # glow settles

# loop: three runs, the pathway gets stronger and thicker each time
tl = cue("s05_loop", "loop")
runs = [(tl + 0.1, tl + 1.0), (tl + 1.4, tl + 2.2), (tl + 2.6, tl + 3.3)]
for i, (a, b) in enumerate(runs):
    signal_run(a, b, energy=10 + 6 * i, size=1 + 0.3 * i)
    key_input(p_em, 2.0 + 0.8 * i, a); key_input(p_em, 2.0 + 0.8 * (i + 1), b)
    cd.bevel_depth = 0.0055 + 0.002 * i; cd.keyframe_insert("bevel_depth", frame=F(a))
    cd.bevel_depth = 0.0055 + 0.002 * (i + 1); cd.keyframe_insert("bevel_depth", frame=F(b))

# wanting grows, liking fades (s06)
tw = cue("s06_wanting", "scroll"); tcirc = cue("s06_wanting", "circuits")
for t, ew, el_ in ((tw - 0.1, 0.0, 0.0), (tw + 0.8, 110.0, 100.0), (tcirc + 0.5, 110.0, 100.0), (tcirc + 4.3, 170.0, 8.0),
                   (cue("s07_insight", "sign") + 0.3, 170.0, 8.0), (cue("s07_insight", "notice"), 140.0, 0.0), (cue("s07_insight", "end"), 0.0, 0.0)):
    want.data.energy = ew; want.data.keyframe_insert("energy", frame=F(t))
    like.data.energy = el_; like.data.keyframe_insert("energy", frame=F(t))
# the pathway keeps glowing through s06, dims during "notice", dies at "end"
key_input(p_em, 4.4, cue("s07_insight", "notice") - 0.2); key_input(p_em, 2.5, cue("s07_insight", "notice") + 1.5)
key_input(p_em, 2.5, cue("s07_insight", "end") - 0.2); key_input(p_em, 0.0, cue("s07_insight", "end") + 1.2)
for inp, lt in ((cue_em, cue_l), (resp_em, resp_l)):
    key_input(inp, 25.0, cue("s07_insight", "end") - 0.2); key_input(inp, 0.0, cue("s07_insight", "end") + 1.2)
    lt.data.energy = 18.0; lt.data.keyframe_insert("energy", frame=F(cue("s07_insight", "end") - 0.2))
    lt.data.energy = 0.0; lt.data.keyframe_insert("energy", frame=F(cue("s07_insight", "end") + 1.2))

# linear interpolation for the follow-path offsets (constant speed) and spot search target
for ob in (sig, s_tgt):
    ad = ob.animation_data
    if ad and ad.action:
        for layer in ad.action.layers:
            for strip in layer.strips:
                for cb in strip.channelbags:
                    for fc in cb.fcurves:
                        if "offset_factor" in fc.data_path or ob is s_tgt:
                            for kp in fc.keyframe_points:
                                kp.interpolation = 'LINEAR'

# ------------------------------------------------------------------ markers export
markers = {}
names = {"cue": P_CUE, "resp": P_RESP, "want": P_WANT, "like": P_LIKE, "centre": mathutils.Vector((0, 0.05, 0))}
for f in range(sc.frame_start, sc.frame_end + 1):
    sc.frame_set(f)
    row = {}
    for nme, p in list(names.items()) + [("search", s_tgt.matrix_world.translation)]:
        v = world_to_camera_view(sc, cam, mathutils.Vector(p))
        # visibility: point faces the camera (normal-free test: compare distance to centre)
        cam_pos = cam.matrix_world.translation
        vis = (mathutils.Vector(p) - mathutils.Vector((0, 0.05, 0))).dot(cam_pos - mathutils.Vector(p)) > 0
        row[nme] = [round(v.x * B.W, 1), round((1 - v.y) * B.H, 1), int(vis)]
    markers[f] = row
os.makedirs(OUT, exist_ok=True)
json.dump({"T0": T0, "fps": FPS, "frames": markers}, open(os.path.join(ROOT, "src", "data", "markers.json"), "w"))
print("MARKERS", len(markers))
sc.frame_set(1)

# ------------------------------------------------------------------ render
if mode == "markers":
    print("MARKERS_ONLY")
elif mode == "frame":
    q = args[2] if len(args) > 2 else "draft"
    sc.render.resolution_percentage = 25 if q == "draft" else 100; B.use_eevee(16 if q == "draft" else 64)
    sc.frame_start = sc.frame_end = int(args[1])
    B.png_out(os.path.join(OUT, "check", "f_")); bpy.ops.render.render(animation=True); print("FRAME_DONE")
elif mode == "stills":
    sc.render.resolution_percentage = 50; B.use_eevee(32)
    for name, s in SC.items():
        if name == "s01_hook":
            continue
        t = s["start"] + s["duration"] * 0.55
        sc.frame_set(F(t)); B.png_out(os.path.join(OUT, "stills", f"{name}.png"))
        bpy.ops.render.render(write_still=True); print("STILL", name, F(t))
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "shot_brain.blend"))
elif mode == "draft":
    sc.render.resolution_percentage = 25; B.use_eevee(16)
    B.png_out(os.path.join(OUT, "draft", "f_")); bpy.ops.render.render(animation=True); print("DRAFT_DONE")
elif mode == "final":
    sc.render.resolution_percentage = 100; B.use_eevee(64)
    if len(args) >= 3:
        sc.frame_start, sc.frame_end = int(args[1]), int(args[2])
    B.png_out(os.path.join(OUT, "final", "f_")); bpy.ops.render.render(animation=True); print("FINAL_DONE")
