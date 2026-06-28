"""
Light Re-ID by tracklet stitching — link fragmented tracks of the same player.

ByteTrack drops a player on occlusion/blur and starts a new id, so one player
becomes many short tracks. We stitch tracks into players using only what we
already have (no new model, fully local):
  - same team (jersey-colour cluster),
  - the next track starts AFTER the previous ends (no time overlap) within a
    short gap,
  - the spatial jump between them is reachable at human speed in that gap,
  - similar jersey colour.
Greedy nearest-cost assignment. This won't perfectly recover crossings (that
needs an appearance-embedding model), but it collapses dozens of fragments into
a handful of players and gives real per-player distance.

Pure / dependency-free so it can be unit-tested without a GPU or video.
"""
from math import hypot

MAX_GAP_S = 3.0       # max time gap between two tracks of the same player
MAX_SPEED = 10.0      # m/s — reachability bound during the gap
POS_SLACK_M = 3.0     # tolerance on top of speed*gap
COLOR_MAX = 30.0      # max Lab colour distance to still be "same shirt"


def _color_dist(a, b):
    if not a or not b:
        return 0.0
    return hypot(hypot(a[0] - b[0], a[1] - b[1]), a[2] - b[2])


def stitch(tracklets, max_gap=MAX_GAP_S, max_speed=MAX_SPEED):
    """tracklets: [{id, team, color:[L,a,b]|None, points:[(t,x,y),...]}].
    Returns players: [{player, team, tracks, points:[(t,x,y),...] sorted}]."""
    tl = []
    for t in tracklets:
        pts = sorted(t["points"], key=lambda p: p[0])
        if not pts:
            continue
        tl.append({
            "id": t["id"], "team": t.get("team", -1), "color": t.get("color"),
            "points": pts, "t0": pts[0][0], "t1": pts[-1][0],
            "p0": (pts[0][1], pts[0][2]), "p1": (pts[-1][1], pts[-1][2]),
        })
    tl.sort(key=lambda t: t["t0"])

    chains = []
    for t in tl:
        best, best_cost = None, 1e18
        for c in chains:
            if c["team"] != t["team"]:
                continue
            gap = t["t0"] - c["end_t"]
            if gap < 0 or gap > max_gap:          # must be after, within the gap
                continue
            d = hypot(t["p0"][0] - c["end_p"][0], t["p0"][1] - c["end_p"][1])
            if d > max_speed * gap + POS_SLACK_M:  # unreachable in time
                continue
            cd = _color_dist(t["color"], c["color"])
            if cd > COLOR_MAX:
                continue
            cost = d + 0.1 * cd + gap
            if cost < best_cost:
                best_cost, best = cost, c
        if best is None:
            chains.append({
                "team": t["team"], "color": t["color"],
                "members": [t["id"]], "points": list(t["points"]),
                "end_t": t["t1"], "end_p": t["p1"],
            })
        else:
            best["members"].append(t["id"])
            best["points"].extend(t["points"])
            best["end_t"], best["end_p"] = t["t1"], t["p1"]

    players = []
    for i, c in enumerate(sorted(chains, key=lambda c: -len(c["points"]))):
        c["points"].sort(key=lambda p: p[0])
        players.append({"player": i + 1, "team": c["team"],
                        "tracks": len(c["members"]), "points": c["points"]})
    return players


if __name__ == "__main__":
    # Player 1 (team 0): two fragments that should stitch (0.5 s gap, continues).
    p1a = [(t * 0.1, 1.0 * t * 0.1, 5.0) for t in range(21)]          # 0..2 s, x 0->2
    p1b = [(2.5 + t * 0.1, 2.0 + 1.0 * t * 0.1, 5.0) for t in range(16)]  # 2.5..4 s
    # Player 2 (team 1): one track elsewhere, different colour.
    p2 = [(t * 0.1, 50.0 - 1.0 * t * 0.1, 30.0) for t in range(31)]
    # Decoy (team 0): overlaps p1a in time but far away — must NOT merge.
    dec = [(t * 0.1, 80.0, 60.0) for t in range(21)]

    tl = [
        {"id": 1, "team": 0, "color": [50, 10, 10], "points": p1a},
        {"id": 2, "team": 0, "color": [50, 10, 10], "points": p1b},
        {"id": 3, "team": 1, "color": [20, 40, 60], "points": p2},
        {"id": 4, "team": 0, "color": [50, 10, 10], "points": dec},
    ]
    players = stitch(tl)
    by_members = {tuple(sorted(p["tracks"] for p in [pp])): pp for pp in players}  # noqa
    assert len(players) == 3, [p["tracks"] for p in players]
    merged = [p for p in players if p["tracks"] == 2]
    assert len(merged) == 1 and set(t for t in [1, 2]), "tracks 1+2 should merge"
    teams = sorted(p["team"] for p in players)
    assert teams == [0, 0, 1], teams
    print("reid self-test OK:", len(players), "players from", len(tl), "tracklets",
          "| merged-track-counts:", sorted(p["tracks"] for p in players))
