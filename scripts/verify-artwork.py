"""Optional asset pixel-consistency check: requires Pillow (`python -m pip install pillow`)."""
from pathlib import Path
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parent.parent/'public'/'scenes'
clear=np.array(Image.open(root/'matched-clear-01'/'base.png').convert('RGB'), dtype=np.uint8)
blocked=np.array(Image.open(root/'unfamiliar-blocked-01'/'base.png').convert('RGB'), dtype=np.uint8)
van=np.array(Image.open(root/'unfamiliar-blocked-01'/'van-shadow-layer.png').convert('RGBA'), dtype=np.uint8)
assert clear.shape==blocked.shape and clear.shape[:2]==van.shape[:2]
expected=np.asarray(Image.alpha_composite(Image.fromarray(clear,'RGB').convert('RGBA'),Image.fromarray(van,'RGBA')).convert('RGB'))
assert np.array_equal(expected,blocked), 'blocked view must equal fixed clear view + van/shadow layer'
difference=np.any(clear!=blocked,axis=2)
outside=int((difference & (van[:,:,3]==0)).sum())
assert outside==0
bus=np.array(Image.open(root/'bus-training-01'/'base.png').convert('RGBA'))
ped=np.array(Image.open(root/'bus-training-01'/'pedestrian-emerges.png').convert('RGBA'))
assert bus.shape==ped.shape
print('PASS: exact blocked view equals fixed clear base with transparent van/shadow layer')
print('PASS: zero changed pixels outside van/shadow layer; changed_pixels=',int(difference.sum()))
print('PASS: training bus base and full-frame pedestrian overlay dimensions match')
