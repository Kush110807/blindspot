"""Verify frozen PDF-sourced BlindSpot imagery and pixel-perfect alpha overlays.

Requires Python Pillow + numpy. Run: python scripts/verify-artwork.py
Pixel hashes are SHA256 of decoded RGBA pixels, not PNG encoded bytes.
"""
from pathlib import Path
from hashlib import sha256
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parent.parent / 'public' / 'scenes'
SOURCES = {
    'bus-training-01/base.png': 'fba39e86fe1ce441ac5bff1cde4131143f6dbff73307ab86d9cf20ee8922b59b',
    'bus-training-01/pedestrian-emerges.png': 'ae25856c16cad2f897e17f0b39ae28576669197f8b16842256ed3437e0cdc826',
    'matched-clear-01/base.png': 'c01bd936e9671e5e36c25988dbe234b68673e497aeb148107818d84515e75a74',
    'unfamiliar-blocked-01/van-shadow-layer.png': '9da420ab0f3db80ca62b5ffc9f2f1f4f858b95c3cd0e0234354e63e641bcacb7',
}

def load(name):
    im=Image.open(ROOT/name).convert('RGBA')
    assert im.size==(1672,941), (name,im.size)
    return im

for name, digest in SOURCES.items():
    im=load(name)
    assert sha256(im.tobytes()).hexdigest()==digest, f'PDF-source pixel mismatch: {name}'
    print('SOURCE MATCH:',name,digest)

bus=load('bus-training-01/base.png')
actor=load('bus-training-01/pedestrian-emerges.png')
assert actor.getchannel('A').getextrema()==(0,255), 'walker must remain a transparent overlay'
# Full-frame source bus is identical for both endings; only the second adds the walker.
ending2=Image.alpha_composite(bus,actor)
mask_actor=np.asarray(actor.getchannel('A'))
diff_actor=np.any(np.asarray(bus)!=np.asarray(ending2),axis=2)
assert np.count_nonzero(diff_actor & (mask_actor==0))==0
print('PASS: same frozen bus for both endings; no differences outside pedestrian alpha')

clear=load('matched-clear-01/base.png')
van=load('unfamiliar-blocked-01/van-shadow-layer.png')
blocked=load('unfamiliar-blocked-01/base.png')
expected=Image.alpha_composite(clear,van).convert('RGB')
assert np.array_equal(np.asarray(expected),np.asarray(blocked.convert('RGB'))), 'blocked view is not exactly clear + van/shadow'
mask_van=np.asarray(van.getchannel('A'))
diff=np.any(np.asarray(clear.convert('RGB'))!=np.asarray(blocked.convert('RGB')),axis=2)
outside=int(np.count_nonzero(diff & (mask_van==0)))
assert outside==0, f'{outside} changed pixels outside van/shadow overlay'
assert np.count_nonzero(diff)>0, 'missing van composite'
print(f'PASS: only van/shadow pixels differ; outside changed = {outside}; changed = {np.count_nonzero(diff)}')
print('PASS: all frozen assets match approved PDF/source pixel hashes')
