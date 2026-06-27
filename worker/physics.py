"""
Physical analytics from per-track pitch positions (real metres).

Input is, per player track, a time series of (t_seconds, x_metres, y_metres)
sampled from the calibrated pitch (per-frame homography). We turn that into:
  - total distance covered (m)
  - average / peak speed (m/s and km/h)
sanitising tracking artefacts (id-swaps / jitter produce impossible jumps,
which we reject by a speed cap) and lightly smoothing positions.

Pure / dependency-free so it can be unit-tested without a GPU or video.
"""
from collections import defaultdict

MAX_SPEED = 12.0     # m/s (~43 km/h). Real sprints peak ~10; above this is jitter.
SMOOTH_WIN = 3       # moving-average window over positions


def _smooth(series, win=SMOOTH_WIN):
    """Moving average over (t,x,y), keeping timestamps; series sorted by t."""
    if win <= 1 or len(series) <= win:
        return series
    out = []
    half = win // 2
    for i in range(len(series)):
        a, b = max(0, i - half), min(len(series), i + half + 1)
        xs = sum(p[1] for p in series[a:b]) / (b - a)
        ys = sum(p[2] for p in series[a:b]) / (b - a)
        out.append((series[i][0], xs, ys))
    return out


def track_metrics(series, max_speed=MAX_SPEED):
    """(distance_m, avg_speed_mps, max_speed_mps) for one track."""
    series = _smooth(sorted(series, key=lambda p: p[0]))
    dist = 0.0
    speeds = []
    for (t0, x0, y0), (t1, x1, y1) in zip(series, series[1:]):
        dt = t1 - t0
        if dt <= 0:
            continue
        d = ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** 0.5
        v = d / dt
        if v > max_speed:        # impossible jump -> id swap / jitter, skip segment
            continue
        dist += d
        speeds.append(v)
    avg = sum(speeds) / len(speeds) if speeds else 0.0
    mx = max(speeds) if speeds else 0.0
    return dist, avg, mx


def summarise(track_series, tid2team=None):
    """Aggregate per-track series into per-track + per-team physical stats.

    track_series: {track_id: [(t,x,y), ...]}  (metres)
    tid2team:     {track_id: 0|1}              (optional)
    """
    tid2team = tid2team or {}
    per_track = []
    team_dist = defaultdict(float)
    team_topspeed = defaultdict(float)
    team_tracks = defaultdict(int)
    for tid, series in track_series.items():
        if len(series) < 3:
            continue
        dist, avg, mx = track_metrics(series)
        if dist <= 0:
            continue
        team = tid2team.get(tid, -1)
        per_track.append({
            "track": int(tid),
            "team": int(team),
            "distance_m": round(dist, 1),
            "avg_speed_kmh": round(avg * 3.6, 1),
            "max_speed_kmh": round(mx * 3.6, 1),
        })
        if team in (0, 1):
            team_dist[team] += dist
            team_topspeed[team] = max(team_topspeed[team], mx)
            team_tracks[team] += 1

    per_track.sort(key=lambda r: r["distance_m"], reverse=True)
    teams = []
    for k in (0, 1):
        if team_tracks[k]:
            teams.append({
                "team": k,
                "tracks": team_tracks[k],
                "distance_total_m": round(team_dist[k], 1),
                "distance_avg_m": round(team_dist[k] / team_tracks[k], 1),
                "top_speed_kmh": round(team_topspeed[k] * 3.6, 1),
            })
    return {"per_track": per_track[:40], "teams": teams}


if __name__ == "__main__":
    # --- self-test: synthetic tracks with known answers ---
    # Track A: straight line, 5 m/s for 10 s -> 50 m, avg 5 m/s, max 5 m/s.
    a = [(t * 0.1, 5.0 * (t * 0.1), 0.0) for t in range(101)]
    dist, avg, mx = track_metrics(a)
    assert abs(dist - 50.0) < 1.0, dist   # ~0.5 m lost to endpoint smoothing
    assert abs(avg - 5.0) < 0.2, avg
    assert abs(mx - 5.0) < 0.3, mx

    # Track B: same, plus a teleport (id-swap) that must be rejected.
    b = list(a)
    b.insert(50, (5.05, 999.0, 999.0))   # bogus point mid-series
    dist2, _, mx2 = track_metrics(b)
    assert abs(dist2 - 50.0) < 3.0, dist2      # teleport distance excluded
    assert mx2 < MAX_SPEED, mx2                 # impossible speed rejected

    # Aggregation + team rollup.
    out = summarise({1: a, 2: b}, {1: 0, 2: 1})
    assert len(out["per_track"]) == 2
    assert out["teams"][0]["team"] == 0
    print("physics self-test OK:", dist, round(avg * 3.6, 1), "km/h |", out["teams"])
