"""
Light Re-ID by tracklet stitching — link fragmented tracks of the same player.

ByteTrack drops a player on occlusion/blur and starts a new id, so one player
becomes many short tracks. We stitch tracks into players using:
  - jersey NUMBER when read (strong key: same number => same player even across
    long gaps; different confident numbers => never merge),
  - else team + temporal order + pitch reachability + jersey colour.
Greedy nearest-cost assignment, then a final pass that merges any chains sharing
the same jersey number. This is what makes the player count meaningful.

Pure / dependency-free so it can be unit-tested without a GPU or video.
"""
from math import hypot

MAX_GAP_S = 4.5       # max time gap between two tracks of the same player
MAX_SPEED = 10.0      # m/s — reachability bound during the gap
POS_SLACK_M = 3.0     # tolerance on top of speed*gap
COLOR_MAX = 30.0      # max Lab colour distance to still be "same shirt"


def _color_dist(a, b):
    if not a or not b:
        return 0.0
    return hypot(hypot(a[0] - b[0], a[1] - b[1]), a[2] - b[2])


def stitch(tracklets, max_gap=MAX_GAP_S, max_speed=MAX_SPEED):
    """tracklets: [{id, team, color:[L,a,b]|None, number:str|None, points:[(t,x,y)]}].
    Returns players: [{player, team, number, tracks, points:[(t,x,y)] sorted}]."""
    tl = []
    for t in tracklets:
        pts = sorted(t["points"], key=lambda p: p[0])
        if not pts:
            continue
        tl.append({
            "id": t["id"], "team": t.get("team", -1), "color": t.get("color"),
            "number": t.get("number"), "points": pts,
            "t0": pts[0][0], "t1": pts[-1][0],
            "p0": (pts[0][1], pts[0][2]), "p1": (pts[-1][1], pts[-1][2]),
        })
    tl.sort(key=lambda t: t["t0"])

    chains = []
    for t in tl:
        best, best_cost = None, 1e18
        for c in chains:
            if c["team"] != t["team"]:
                continue
            tn, cn = t["number"], c["number"]
            if tn and cn and tn != cn:
                continue                       # conflicting numbers -> never merge
            same_num = bool(tn and cn and tn == cn)
            gap = t["t0"] - c["end_t"]
            if gap < 0:
                continue
            if not same_num:                   # spatio-temporal gating
                if gap > max_gap:
                    continue
                d = hypot(t["p0"][0] - c["end_p"][0], t["p0"][1] - c["end_p"][1])
                if d > max_speed * gap + POS_SLACK_M:
                    continue
                if _color_dist(t["color"], c["color"]) > COLOR_MAX:
                    continue
                cost = d + gap
            else:
                cost = 0.0                     # number match is decisive
            if cost < best_cost:
                best_cost, best = cost, c
        if best is None:
            chains.append({
                "team": t["team"], "color": t["color"], "number": t["number"],
                "members": [t["id"]], "points": list(t["points"]),
                "end_t": t["t1"], "end_p": t["p1"],
            })
        else:
            best["members"].append(t["id"])
            best["points"].extend(t["points"])
            best["end_t"], best["end_p"] = t["t1"], t["p1"]
            if not best["number"] and t["number"]:
                best["number"] = t["number"]

    # final pass: merge any chains that share a jersey number
    by_num, final = {}, []
    for c in chains:
        n = c["number"]
        if n and n in by_num:
            m = by_num[n]
            m["members"].extend(c["members"])
            m["points"].extend(c["points"])
        else:
            if n:
                by_num[n] = c
            final.append(c)

    players = []
    for i, c in enumerate(sorted(final, key=lambda c: -len(c["points"]))):
        c["points"].sort(key=lambda p: p[0])
        players.append({"player": i + 1, "team": c["team"], "number": c["number"],
                        "tracks": len(c["members"]), "members": list(c["members"]),
                        "points": c["points"]})
    return players


if __name__ == "__main__":
    # spatio-temporal merge (no numbers): two fragments of one player stitch.
    p1a = [(t * 0.1, 1.0 * t * 0.1, 5.0) for t in range(21)]
    p1b = [(2.5 + t * 0.1, 2.0 + 1.0 * t * 0.1, 5.0) for t in range(16)]
    p2 = [(t * 0.1, 50.0 - 1.0 * t * 0.1, 30.0) for t in range(31)]
    dec = [(t * 0.1, 80.0, 60.0) for t in range(21)]
    tl = [
        {"id": 1, "team": 0, "color": [50, 10, 10], "number": None, "points": p1a},
        {"id": 2, "team": 0, "color": [50, 10, 10], "number": None, "points": p1b},
        {"id": 3, "team": 1, "color": [20, 40, 60], "number": None, "points": p2},
        {"id": 4, "team": 0, "color": [50, 10, 10], "number": None, "points": dec},
    ]
    assert len(stitch(tl)) == 3

    # number-driven merge: two far-apart tracks with the same number => one player.
    far_a = [(t * 0.1, t * 0.1, 5.0) for t in range(30)]            # 0..3 s, x 0->3
    far_b = [(60.0 + t * 0.1, 60.0, 60.0) for t in range(30)]       # 60..63 s, far away
    other = [(t * 0.1, 40.0, 40.0) for t in range(30)]
    tl2 = [
        {"id": 1, "team": 0, "color": [50, 10, 10], "number": "10", "points": far_a},
        {"id": 2, "team": 0, "color": [50, 10, 10], "number": "10", "points": far_b},
        {"id": 3, "team": 0, "color": [50, 10, 10], "number": "7", "points": other},
    ]
    pl2 = stitch(tl2)
    assert len(pl2) == 2, [p["number"] for p in pl2]          # #10 (merged) + #7
    n10 = [p for p in pl2 if p["number"] == "10"][0]
    assert n10["tracks"] == 2, "same number must merge across gap/space"

    # conflicting numbers close together must NOT merge.
    a = [(t * 0.1, t * 0.1, 5.0) for t in range(20)]
    b = [(2.1 + t * 0.1, 2.0 + t * 0.1, 5.0) for t in range(20)]
    tl3 = [
        {"id": 1, "team": 0, "color": [50, 10, 10], "number": "10", "points": a},
        {"id": 2, "team": 0, "color": [50, 10, 10], "number": "7", "points": b},
    ]
    assert len(stitch(tl3)) == 2, "different numbers must stay separate"
    print("reid self-test OK (spatio-temporal + jersey-number merge + conflict guard)")
