"""Reconstruct final van/shadow layer from preserved source and foreground mask.

Requires Pillow. Run `python scripts/rebuild-van-layer.py` to verify,
`python scripts/rebuild-van-layer.py --write` to rebuild the committed assets.
No scene or background is regenerated. No complete donor image is presented to learners.
"""
from pathlib import Path
from hashlib import sha256
from PIL import Image, ImageDraw, ImageFilter
import sys
root=Path(__file__).resolve().parent.parent
source=Image.open(root/'assets/source-artwork/latest-van-correction-donor.png').convert('RGBA')
mask=Image.open(root/'assets/source-artwork/final-van-foreground-mask.png').convert('L')
clear=Image.open(root/'public/scenes/matched-clear-01/base.png').convert('RGBA')
assert source.size == mask.size == clear.size == (1672,941)
alpha=mask.filter(ImageFilter.GaussianBlur(.8))
vehicle=source.copy();vehicle.putalpha(alpha)
shadow=Image.new('L',source.size)
d=ImageDraw.Draw(shadow)
d.ellipse((1086,422,1161,465),fill=75)
d.ellipse((1275,431,1400,505),fill=107)
d.polygon([(1113,432),(1445,447),(1480,467),(1356,473),(1219,450)],fill=38)
shadow=shadow.filter(ImageFilter.GaussianBlur(10))
shadow_layer=Image.new('RGBA',source.size,(19,23,24,0));shadow_layer.putalpha(shadow)
layer=Image.alpha_composite(shadow_layer,vehicle)
blocked=Image.alpha_composite(clear,layer).convert('RGB')
layer_path=root/'public/scenes/unfamiliar-blocked-01/van-shadow-layer.png'
blocked_path=root/'public/scenes/unfamiliar-blocked-01/base.png'
if '--write' in sys.argv:
    layer.save(layer_path);blocked.save(blocked_path)
else:
    assert Image.open(layer_path).convert('RGBA').tobytes()==layer.tobytes(), 'van layer does not match preserved inputs'
    assert Image.open(blocked_path).convert('RGB').tobytes()==blocked.tobytes(), 'blocked image does not match clear + layer'
print('PASS: final van layer reconstructs from preserved donor and mask')
print('PASS: blocked assessment is fixed clear view + reconstructed van/shadow only')
print('van SHA256 RGBA:',sha256(layer.tobytes()).hexdigest())
