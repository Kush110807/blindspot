"""Reproduce the October 2026 van cutout repair without regenerating scene art.

The input is the van/shadow layer committed at the frozen parent SHA.
Pillow is required. Run: python scripts/rebuild-van-layer.py [--write].
Default mode verifies that the committed files exactly match a deterministic rebuild.
"""
from io import BytesIO
from pathlib import Path
import subprocess
import sys
from hashlib import sha256
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE_COMMIT = '28f1e7c94d224acc2feffba2c3e5eefdf54ec3b4'
REL = 'public/scenes/unfamiliar-blocked-01/van-shadow-layer.png'
PNG = subprocess.run(['git', 'show', f'{SOURCE_COMMIT}:{REL}'], cwd=ROOT, check=True, capture_output=True).stdout
old = Image.open(BytesIO(PNG)).convert('RGBA')
w, h = old.size
assert (w, h) == (1672, 941)

# Trace the existing van's visible outer boundary, excluding the tan wall and curb
# accidentally present at the source cutout's front and undercarriage.
poly = [
    (1108,350),(1114,334),(1125,319),(1144,298),(1156,280),(1166,261),
    (1371,189),(1395,185),(1489,186),(1514,192),(1521,207),(1522,450),
    (1517,454),(1469,455),(1456,447),(1374,447),(1364,448),(1362,457),
    (1355,470),(1348,475),(1320,478),(1305,474),(1299,464),(1293,435),
    (1177,429),(1165,430),(1157,446),(1149,448),(1125,448),(1114,441),
    (1107,432),(1102,421),(1101,404),(1103,381),(1104,365)
]
mask = Image.new('L', old.size)
ImageDraw.Draw(mask).polygon(poly, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(1.2))
# A light-weight per-pixel alpha product, retaining the original van's visible pixels.
from PIL import ImageChops
alpha = ImageChops.multiply(old.getchannel('A'), mask)
vehicle = old.copy()
vehicle.putalpha(alpha)

# Contact shadows are newly authored, translucent and feathered; they include no pavement pixels.
shadow = Image.new('L', old.size)
draw = ImageDraw.Draw(shadow)
draw.ellipse((1087,424,1175,467), fill=95)
draw.ellipse((1289,448,1374,488), fill=104)
draw.polygon([(1125,435),(1505,437),(1541,472),(1373,480),(1250,456),(1148,452)], fill=50)
shadow = shadow.filter(ImageFilter.GaussianBlur(9))
shadow_layer = Image.new('RGBA', old.size, (31,34,34,0))
shadow_layer.putalpha(shadow)
layer = Image.alpha_composite(shadow_layer, vehicle)
clear = Image.open(ROOT/'public/scenes/matched-clear-01/base.png').convert('RGBA')
blocked = Image.alpha_composite(clear, layer).convert('RGB')

out_layer = ROOT/REL
out_blocked = ROOT/'public/scenes/unfamiliar-blocked-01/base.png'
if '--write' in sys.argv:
    layer.save(out_layer)
    blocked.save(out_blocked)
    print('Wrote updated layer and blocked composite')
else:
    current = Image.open(out_layer).convert('RGBA')
    actual = Image.open(out_blocked).convert('RGB')
    assert current.tobytes() == layer.tobytes(), 'layer differs from deterministic rebuild'
    assert actual.tobytes() == blocked.tobytes(), 'blocked scene differs from clear + rebuilt layer'
    print('PASS: committed van cutout and blocked composite match deterministic rebuild')
print('van decoded RGBA SHA256:', sha256(layer.tobytes()).hexdigest())
