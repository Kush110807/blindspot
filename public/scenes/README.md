# BlindSpot approved scene files

The frozen bus base, full-frame post-lock pedestrian layer and matched clear-view background are unchanged approved artwork. The blocked assessment (scene `unfamiliar-blocked-01`, version `1.2.2-provisional`) is derived from the fixed clear background by adding only the latest van/soft shadow PNG layer. No other scene image was regenerated. Layer provenance and deterministic rebuilding inputs are in `assets/source-artwork/`, `scripts/rebuild-van-layer.py`, and `docs/ASSET_CREDITS.md`.

Run `python scripts/verify-artwork.py` for decoded-pixel hash and no-change-outside-layer assertions. The matched clear and blocked views have identical dimensions (1672 × 941). No claim of instructor review or validated safety scoring is made.
