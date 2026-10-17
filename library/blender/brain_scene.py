"""Reusable Blender scene builder for the reel: realistic brain (fsaverage7 pial cortex +
procedural cerebellum/brainstem), tissue material, dark cinematic lighting, vertical camera.

Run inside Blender 5.1 (bpy). Copy this folder (with assets/) into a project's blender/lib/; shot scripts do:
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "lib"))
    import brain_scene as B
Coordinates: FreeSurfer RAS scaled by 0.01 -> brain ~1.4 units wide, +Y = anterior, +Z = up.
"""
import math
import os

import bpy

ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
BRAIN_OBJ = os.path.join(ASSETS, "brain_fs7.obj")
W, H = 1080, 1920


# ------------------------------------------------------------------ helpers
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y = W, H
    sc.render.resolution_percentage = 100
    sc.render.fps = 24
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Medium High Contrast'
    return sc


def nodes(mat):
    return mat.node_tree.nodes, mat.node_tree.links


def new_material(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m


# ------------------------------------------------------------------ materials
def tissue_material(name="cortex", base=(0.56, 0.36, 0.34), crevice=(0.22, 0.07, 0.08), wet=0.4, sss=0.6):
    """Living tissue: SSS, wet coat, darker in the sulci (FreeSurfer sulcal depth + AO),
    faint organic vessel network, micro bump."""
    m = new_material(name)
    n, l = nodes(m)
    p = n["Principled BSDF"]
    # --- crevice factor: sulcal depth attribute (positive = deep) blended with AO
    att = n.new("ShaderNodeAttribute"); att.attribute_name = "sulc"
    smap = n.new("ShaderNodeMapRange"); smap.inputs["From Min"].default_value = -0.7; smap.inputs["From Max"].default_value = 1.3
    smap.inputs["To Min"].default_value = 1.0; smap.inputs["To Max"].default_value = 0.0; smap.clamp = True
    l.new(att.outputs["Fac"], smap.inputs["Value"])
    ao = n.new("ShaderNodeAmbientOcclusion"); ao.inputs["Distance"].default_value = 0.15; ao.samples = 8
    crev = n.new("ShaderNodeMath"); crev.operation = 'MULTIPLY'
    l.new(smap.outputs["Result"], crev.inputs[0]); l.new(ao.outputs["AO"], crev.inputs[1])
    crev_pow = n.new("ShaderNodeMath"); crev_pow.operation = 'POWER'; crev_pow.inputs[1].default_value = 0.7
    l.new(crev.outputs["Value"], crev_pow.inputs[0])
    cmix = n.new("ShaderNodeMix"); cmix.data_type = 'RGBA'
    cmix.inputs["A"].default_value = (*crevice, 1); cmix.inputs["B"].default_value = (*base, 1)
    l.new(crev_pow.outputs["Value"], cmix.inputs["Factor"])
    # --- vessels: noise-distorted voronoi edges, faint
    tc = n.new("ShaderNodeTexCoord")
    dn = n.new("ShaderNodeTexNoise"); dn.inputs["Scale"].default_value = 3.0; dn.inputs["Detail"].default_value = 3.0
    l.new(tc.outputs["Object"], dn.inputs["Vector"])
    vm = n.new("ShaderNodeVectorMath"); vm.operation = 'MULTIPLY_ADD'; vm.inputs[1].default_value = (0.35, 0.35, 0.35)
    l.new(dn.outputs["Color"], vm.inputs[0]); l.new(tc.outputs["Object"], vm.inputs[2])
    vor = n.new("ShaderNodeTexVoronoi"); vor.feature = 'DISTANCE_TO_EDGE'; vor.inputs["Scale"].default_value = 4.5
    l.new(vm.outputs["Vector"], vor.inputs["Vector"])
    vmap = n.new("ShaderNodeMapRange"); vmap.inputs["From Min"].default_value = 0.0; vmap.inputs["From Max"].default_value = 0.028
    vmap.inputs["To Min"].default_value = 1.0; vmap.inputs["To Max"].default_value = 0.0
    l.new(vor.outputs["Distance"], vmap.inputs["Value"])
    vn = n.new("ShaderNodeTexNoise"); vn.inputs["Scale"].default_value = 5.0
    vgate = n.new("ShaderNodeMath"); vgate.operation = 'GREATER_THAN'; vgate.inputs[1].default_value = 0.52
    l.new(vn.outputs["Fac"], vgate.inputs[0])
    vmask = n.new("ShaderNodeMath"); vmask.operation = 'MULTIPLY'
    l.new(vmap.outputs["Result"], vmask.inputs[0]); l.new(vgate.outputs["Value"], vmask.inputs[1])
    vscale = n.new("ShaderNodeMath"); vscale.operation = 'MULTIPLY'; vscale.inputs[1].default_value = 0.42
    l.new(vmask.outputs["Value"], vscale.inputs[0])
    vmix = n.new("ShaderNodeMix"); vmix.data_type = 'RGBA'; vmix.inputs["B"].default_value = (0.40, 0.05, 0.05, 1)
    l.new(cmix.outputs["Result"], vmix.inputs["A"]); l.new(vscale.outputs["Value"], vmix.inputs["Factor"])
    mot = n.new("ShaderNodeTexNoise"); mot.inputs["Scale"].default_value = 2.2; mot.inputs["Detail"].default_value = 2.0
    l.new(tc.outputs["Object"], mot.inputs["Vector"])
    mramp = n.new("ShaderNodeValToRGB"); mramp.color_ramp.elements[0].position = 0.35; mramp.color_ramp.elements[1].position = 0.65
    mramp.color_ramp.elements[0].color = (0.80, 0.70, 0.72, 1); mramp.color_ramp.elements[1].color = (1.15, 1.08, 0.95, 1)
    l.new(mot.outputs["Fac"], mramp.inputs["Fac"])
    mmul = n.new("ShaderNodeMix"); mmul.data_type = 'RGBA'; mmul.blend_type = 'MULTIPLY'; mmul.inputs["Factor"].default_value = 1.0
    l.new(vmix.outputs["Result"], mmul.inputs["A"]); l.new(mramp.outputs["Color"], mmul.inputs["B"])
    l.new(mmul.outputs["Result"], p.inputs["Base Color"])
    # --- subsurface
    p.inputs["Subsurface Weight"].default_value = sss
    p.inputs["Subsurface Radius"].default_value = (1.0, 0.3, 0.15)
    p.inputs["Subsurface Scale"].default_value = 0.05
    # --- specular: wet but broken up
    rn = n.new("ShaderNodeTexNoise"); rn.inputs["Scale"].default_value = 30.0; rn.inputs["Detail"].default_value = 5.0
    rr = n.new("ShaderNodeMapRange"); rr.inputs["To Min"].default_value = 0.30; rr.inputs["To Max"].default_value = 0.55
    l.new(rn.outputs["Fac"], rr.inputs["Value"]); l.new(rr.outputs["Result"], p.inputs["Roughness"])
    p.inputs["Coat Weight"].default_value = wet
    p.inputs["Coat Roughness"].default_value = 0.2
    p.inputs["Coat IOR"].default_value = 1.4
    # --- micro bump + vessel relief
    bn = n.new("ShaderNodeTexNoise"); bn.inputs["Scale"].default_value = 80.0; bn.inputs["Detail"].default_value = 6.0
    bsum = n.new("ShaderNodeMath"); bsum.operation = 'MULTIPLY_ADD'; bsum.inputs[1].default_value = 0.08
    l.new(bn.outputs["Fac"], bsum.inputs[0]); l.new(vscale.outputs["Value"], bsum.inputs[2])
    bump = n.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.4; bump.inputs["Distance"].default_value = 0.01
    l.new(bsum.outputs["Value"], bump.inputs["Height"]); l.new(bump.outputs["Normal"], p.inputs["Normal"])
    return m


def emissive_material(name, color, strength):
    m = new_material(name)
    n, l = nodes(m)
    p = n["Principled BSDF"]
    p.inputs["Emission Color"].default_value = (*color, 1)
    p.inputs["Emission Strength"].default_value = strength
    p.inputs["Base Color"].default_value = (0, 0, 0, 1)
    return m


# ------------------------------------------------------------------ geometry
def import_cortex(mat):
    bpy.ops.wm.obj_import(filepath=BRAIN_OBJ, forward_axis='Y', up_axis='Z')
    parts = [o for o in bpy.context.selected_objects if o.type == 'MESH']
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    cortex = bpy.context.object
    cortex.name = "cortex"
    bpy.ops.object.shade_smooth()
    # pial surface is slightly faceted at 1mm; a light smooth keeps gyri but removes noise
    sm = cortex.modifiers.new("smooth", 'SMOOTH'); sm.factor = 0.35; sm.iterations = 1
    cortex.data.materials.append(mat)
    # FreeSurfer sulcal depth as a point attribute (same vertex order as the OBJ)
    import struct
    raw = open(os.path.join(ASSETS, "brain_fs7_sulc.f32"), "rb").read()
    vals = struct.unpack(f"<{len(raw)//4}f", raw)
    me = cortex.data
    assert len(me.vertices) == len(vals), (len(me.vertices), len(vals))
    a = me.attributes.new("sulc", 'FLOAT', 'POINT'); a.data.foreach_set("value", vals)
    print("CORTEX_DIMS", [round(v, 3) for v in cortex.dimensions])
    return cortex


def cerebellum(mat):
    """Ellipsoid under the occipital lobes with horizontal folia ridges and a midline groove."""
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=96, ring_count=64, location=(0, -0.50, -0.42))
    cb = bpy.context.object; cb.name = "cerebellum"
    cb.scale = (0.52, 0.30, 0.24)
    cb.rotation_euler = (math.radians(-18), 0, 0)
    bpy.ops.object.shade_smooth()
    # folia: wave texture bands around Z, small displacement
    tex = bpy.data.textures.new("folia", 'WOOD'); tex.wood_type = 'BANDS'; tex.noise_basis_2 = 'TRI'
    tex.noise_scale = 0.045; tex.turbulence = 2.0
    d = cb.modifiers.new("folia", 'DISPLACE'); d.texture = tex; d.strength = 0.035; d.direction = 'NORMAL'; d.texture_coords = 'LOCAL'
    # midline groove via a second, very low frequency displacement
    tex2 = bpy.data.textures.new("vermis", 'CLOUDS'); tex2.noise_scale = 0.6
    d2 = cb.modifiers.new("lobules", 'DISPLACE'); d2.texture = tex2; d2.strength = 0.05
    sd = cb.modifiers.new("subd", 'SUBSURF'); sd.levels = 1; sd.render_levels = 2
    cb.data.materials.append(mat)
    return cb


def brainstem(mat):
    bpy.ops.curve.primitive_bezier_curve_add()
    cv = bpy.context.object; cv.name = "brainstem"
    cv.data.bevel_depth = 0.11; cv.data.bevel_resolution = 10; cv.data.fill_mode = 'FULL'; cv.data.use_fill_caps = True
    sp = cv.data.splines[0]
    p0, p1 = sp.bezier_points[0], sp.bezier_points[1]
    p0.co = (0, -0.10, -0.15); p0.handle_left = (0, 0.05, 0.05); p0.handle_right = (0, -0.25, -0.35); p0.radius = 1.25
    p1.co = (0, -0.42, -0.95); p1.handle_left = (0, -0.32, -0.65); p1.handle_right = (0, -0.50, -1.15); p1.radius = 0.75
    cv.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return cv


def build_brain(mat=None):
    mat = mat or tissue_material()
    cortex = import_cortex(mat)
    cb = cerebellum(mat)
    bs = brainstem(mat)
    bpy.ops.object.empty_add(location=(0, 0, 0)); rig = bpy.context.object; rig.name = "brain_rig"
    for o in (cortex, cb, bs):
        o.parent = rig
    return rig, {"cortex": cortex, "cerebellum": cb, "brainstem": bs}


# ------------------------------------------------------------------ lighting / world / camera
def lights(key=230, rim=420, fill=12, key_color=(1.0, 0.92, 0.84), rim_color=(0.55, 0.75, 1.0)):
    out = {}
    bpy.ops.object.light_add(type='AREA', location=(1.6, 1.9, 2.4)); k = bpy.context.object; k.name = "key"
    k.data.energy = key; k.data.size = 1.6; k.data.color = key_color; k.data.shape = 'DISK'; k.data.volume_factor = 0.3
    bpy.ops.object.light_add(type='AREA', location=(-2.2, -2.2, 1.0)); r = bpy.context.object; r.name = "rim"
    r.data.energy = rim; r.data.size = 0.8; r.data.color = rim_color; r.data.volume_factor = 0.6
    bpy.ops.object.light_add(type='AREA', location=(-1.5, 2.5, -0.5)); f = bpy.context.object; f.name = "fill"
    f.data.energy = fill; f.data.size = 3.0; f.data.color = (0.8, 0.85, 1.0)
    for ob in (k, r, f):
        c = ob.constraints.new('TRACK_TO'); c.target = bpy.data.objects["brain_rig"]; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
        out[ob.name] = ob
    return out


def world(haze=0.006, color=(0.0, 0.0, 0.0)):
    sc = bpy.context.scene
    w = bpy.data.worlds.new("W"); sc.world = w; w.use_nodes = True
    n, l = w.node_tree.nodes, w.node_tree.links
    n["Background"].inputs["Color"].default_value = (*color, 1)
    if haze > 0:
        v = n.new("ShaderNodeVolumeScatter"); v.inputs["Density"].default_value = haze; v.inputs["Anisotropy"].default_value = 0.5
        l.new(v.outputs["Volume"], n["World Output"].inputs["Volume"])
    return w


def camera(location, target=(0, 0, 0), lens=60, fstop=2.8, focus=None):
    sc = bpy.context.scene
    bpy.ops.object.camera_add(location=location); cam = bpy.context.object; cam.name = "cam"
    cam.data.lens = lens; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = 24
    cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = fstop
    bpy.ops.object.empty_add(location=target); tgt = bpy.context.object; tgt.name = "cam_target"
    c = cam.constraints.new('TRACK_TO'); c.target = tgt; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    cam.data.dof.focus_object = focus or tgt
    sc.camera = cam
    return cam, tgt


# ------------------------------------------------------------------ render settings
def use_eevee(samples=64):
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.eevee.taa_render_samples = samples
    sc.eevee.use_volumetric_shadows = True
    sc.eevee.use_raytracing = True
    sc.eevee.use_shadows = True
    sc.render.use_motion_blur = False


def use_cycles(samples=128, denoise=True):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    p = bpy.context.preferences.addons['cycles'].preferences
    p.compute_device_type = 'OPTIX'; p.get_devices()
    for d in p.devices:
        d.use = (d.type != 'CPU')
    sc.cycles.device = 'GPU'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = denoise
    sc.cycles.denoiser = 'OPTIX'
    sc.cycles.volume_bounces = 1
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.02


def png_out(path, alpha=False):
    sc = bpy.context.scene
    sc.render.image_settings.media_type = 'IMAGE'
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA' if alpha else 'RGB'
    sc.render.image_settings.compression = 50
    sc.render.film_transparent = alpha
    sc.render.filepath = path
