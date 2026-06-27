"""Synthetic self-test for the pitch homography math (no model/GPU needed).
Run: cd worker && python3 test_pitch.py
Synthesizes a broadcast camera, drops/perturbs landmarks like a real detector,
and checks we recover real pitch coordinates and reject garbage."""
import numpy as np, cv2
import pitch

# Synthesize a plausible broadcast camera: world cm -> image px homography.
# Map 4 pitch points to a trapezoid (perspective) in a 1280x720 frame.
world4 = np.array([[0,0],[12000,0],[12000,7000],[0,7000]], dtype=np.float64)
img4   = np.array([[250,150],[1050,150],[1280,680],[-40,680]], dtype=np.float64)
H_w2i, _ = cv2.findHomography(world4, img4)

V = np.array(pitch.PITCH_VERTICES, dtype=np.float64)
Vh = np.hstack([V, np.ones((len(V),1))])
img = (H_w2i @ Vh.T).T
img = img[:, :2] / img[:, 2:3]

rng = np.random.default_rng(0)
img_noisy = img + rng.normal(0, 1.5, img.shape)   # ~1.5px detector noise
# Simulate occlusion: keep a random ~60% of landmarks
keep = rng.random(len(V)) < 0.6
src = img_noisy[keep]; dst = V[keep]
print(f"using {keep.sum()}/{len(V)} landmarks")

H = pitch.solve_homography(src, dst)
assert H is not None, "homography rejected"

# Verify: project some known image points back to world; compare to truth.
errs = []
for i in range(len(V)):
    w = pitch.project(H, img[i,0], img[i,1])
    errs.append(np.hypot(w[0]-V[i,0], w[1]-V[i,1]))
errs = np.array(errs)
print(f"world reprojection error: mean={errs.mean():.1f}cm max={errs.max():.1f}cm")
assert errs.mean() < 150, errs.mean()  # <1.5 m avg; far goal-line compresses to few px

# A player at image (640,400) should map inside the pitch.
px = pitch.project(H, 640, 400)
print("player(640,400) -> pitch cm:", tuple(round(c) for c in px))
assert -200 <= px[0] <= 12200 and -200 <= px[1] <= 7200

# Quality gate must REJECT a degenerate/garbage set.
bad = pitch.solve_homography(np.array([[1,1],[2,2],[3,3],[4,4],[5,5]],float),
                             np.array([[0,0],[1,0],[2,0],[3,0],[4,0]],float))
assert bad is None, "should reject collinear garbage"
print("OK pitch homography self-test passed")
