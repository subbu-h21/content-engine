"""Procedural smartphone + table for the opening shot. Import from shot scripts (bpy)."""
import math
import os

import bmesh
import bpy



def _rounded_outline(bm, w, h, r, seg=14, z=0.0):
    verts = []
    cx = [(w / 2 - r, h / 2 - r), (-w / 2 + r, h / 2 - r), (-w / 2 + r, -h / 2 + r), (w / 2 - r, -h / 2 + r)]
    for k, (ccx, ccy) in enumerate(cx):
        a0 = k * math.pi / 2
        for i in range(seg + 1):
            a = a0 + (math.pi / 2) * i / seg
            verts.append(bm.verts.new((ccx + r * math.cos(a), ccy + r * math.sin(a), z)))
    return verts


def _slab(name, w, h, r, thick, seg=14):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    vs = _rounded_outline(bm, w, h, r, seg)
    f = bm.faces.new(vs)
    bmesh.ops.recalc_face_normals(bm, faces=[f])
    res = bmesh.ops.extrude_face_region(bm, geom=[f])
    top = [g for g in res["geom"] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, 0, thick), verts=top)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    return ob


def _mat(name, color, metallic=0.0, rough=0.5, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Metallic"].default_value = metallic
    p.inputs["Roughness"].default_value = rough
    p.inputs["Coat Weight"].default_value = coat
    return m


def build_phone(w=0.72, h=1.50, thick=0.078, corner=0.11, screen_image=None):
    """Phone lying face-up on z=0, screen at z=thick. screen_image: PNG shown when the screen lights up.
    Returns (root empty, parts dict)."""
    bpy.ops.object.empty_add(location=(0, 0, 0))
    root = bpy.context.object
    root.name = "phone"
    frame = _slab("phone_frame", w, h, corner, thick)
    bv = frame.modifiers.new("bevel", 'BEVEL')
    bv.width = 0.014
    bv.segments = 6
    bv.limit_method = 'ANGLE'
    frame.data.materials.append(_mat("titanium", (0.16, 0.16, 0.17), 1.0, 0.42))
    for p in frame.data.polygons:
        p.use_smooth = True
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, thick - 0.003))
    screen = bpy.context.object
    screen.name = "phone_screen"
    screen.location.z = thick + 0.001
    screen.scale = (w - 0.075, h - 0.075, 1)
    sm = bpy.data.materials.new("screen")
    sm.use_nodes = True
    n, l = sm.node_tree.nodes, sm.node_tree.links
    p = n["Principled BSDF"]
    p.inputs["Base Color"].default_value = (0, 0, 0, 1)
    p.inputs["Roughness"].default_value = 0.12
    p.inputs["Coat Weight"].default_value = 1.0
    p.inputs["Coat Roughness"].default_value = 0.03
    img = n.new("ShaderNodeTexImage")
    if screen_image:
        img.image = bpy.data.images.load(screen_image)
    tc = n.new("ShaderNodeTexCoord")
    l.new(tc.outputs["UV"], img.inputs["Vector"])
    l.new(img.outputs["Color"], p.inputs["Emission Color"])
    p.inputs["Emission Strength"].default_value = 0.0
    screen.data.materials.append(sm)
    isl = _slab("cam_island", 0.26, 0.26, 0.06, 0.02)
    isl.location = (-w / 2 + 0.17, h / 2 - 0.17, -0.02)
    isl.data.materials.append(_mat("titanium2", (0.14, 0.14, 0.15), 1.0, 0.4))
    for ob in (frame, screen, isl):
        ob.parent = root
    return root, {"frame": frame, "screen": screen, "screen_mat": sm, "island": isl}


def set_screen(parts, strength):
    parts["screen_mat"].node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = strength


def key_screen(parts, strength, frame):
    inp = parts["screen_mat"].node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
    inp.default_value = strength
    inp.keyframe_insert("default_value", frame=frame)


def build_table():
    bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, 0))
    tb = bpy.context.object
    tb.name = "table"
    m = bpy.data.materials.new("table")
    m.use_nodes = True
    n, l = m.node_tree.nodes, m.node_tree.links
    p = n["Principled BSDF"]
    tc = n.new("ShaderNodeTexCoord")
    nz = n.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 18.0
    nz.inputs["Detail"].default_value = 8.0
    nz.inputs["Roughness"].default_value = 0.7
    l.new(tc.outputs["Object"], nz.inputs["Vector"])
    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0.035, 0.030, 0.028, 1)
    ramp.color_ramp.elements[1].color = (0.075, 0.062, 0.055, 1)
    l.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    l.new(ramp.outputs["Color"], p.inputs["Base Color"])
    rr = n.new("ShaderNodeMapRange")
    rr.inputs["To Min"].default_value = 0.35
    rr.inputs["To Max"].default_value = 0.6
    l.new(nz.outputs["Fac"], rr.inputs["Value"])
    l.new(rr.outputs["Result"], p.inputs["Roughness"])
    bn = n.new("ShaderNodeTexNoise")
    bn.inputs["Scale"].default_value = 90.0
    bn.inputs["Detail"].default_value = 10.0
    l.new(tc.outputs["Object"], bn.inputs["Vector"])
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    l.new(bn.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], p.inputs["Normal"])
    tb.data.materials.append(m)
    return tb
