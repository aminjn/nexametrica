"""
Physical analytics from per-track pitch positions (real metres).

Input is, per player track, a time series of (t_seconds, x_metres, y_metres)
sampled from the calibrated pitch (per-frame homography). Broadcast tracking is
messy — id-switches fragment one player into many short tracks, and per-frame
homography jitter teleports a position by metres between frames. We therefore:
  - reject teleport points (implied speed above a human cap) BEFORE integrating,
  - lightly smooth positions,
  - integrate distance with a per-segment speed cap,
  - hard-clamp reported speed to a human maximum,
  - only treat tracks with enough samples as real, and never claim a track count
    is a player count (that needs Re-ID to link fragments — a later step).

Pure / dependency-free so it can be unit-tested without a GPU or video.
"""
from collections import defaultdict
from math import hypot

MAX_SPEED = 10.0      # m/s (~36 km/h) — real sprint peak; above this is jitter.
SMOOTH_WIN = 3        # moving-average window over positions
MIN_TRACK_PTS = 12    # tracks shorter than this are fragments → ignored for stats


def _dedup_sort(series):
    s = sorted(series, key=lambda p: p[0])
    out = []
    for p in s:
        if out and p[0] == out[-1][0]:
            continue
        out.append(p)
    return out


def _reject_teleports(series, max_speed):
    """Drop points that imply an impossible speed from the last kept point."""
    if not series:
        return series
    out = [series[0]]
    for t1, x1, y1 in series[1:]:
        t0, x0, y0 = out[-1]
        dt = t1 - t0
        if dt <= 0:
            continue
        if hypot(x1 - x0, y1 - y0) / dt > max_speed:
            continue          # homography jitter / id swap — discard
        out.append((t1, x1, y1))
    return out


def _smooth(series, win=SMOOTH_WIN):
    if win <= 1 or len(series) <= win:
        return series
    out, half = [], win // 2
    for i in range(len(series)):
        a, b = max(0, i - half), min(len(series), i + half + 1)
        xs = sum(p[1] for p in series[a:b]) / (b - a)
        ys = sum(p[2] for p in series[a:b]) / (b - a)
        out.append((series[i][0], xs, ys))
    return out


def _peak_speed(series, win_sec, max_speed):
    """Top speed over a sliding time window — smooths per-frame homography jitter
    that otherwise pegs instantaneous speed at the cap."""
    peak, j = 0.0, 0
    for i in range(len(series)):
        while series[i][0] - series[j][0] > win_sec and j < i:
            j += 1
        dt = series[i][0] - series[j][0]
        if dt >= win_sec * 0.5:
            v = hypot(series[i][1] - series[j][1], series[i][2] - series[j][2]) / dt
            if v <= max_speed:            # over-cap window = residual jitter, ignore
                peak = max(peak, v)
    return peak


def track_metrics(series, max_speed=MAX_SPEED, win_sec=0.6):
    """(distance_m, avg_speed_mps, max_speed_mps, seconds) for one track."""
    series = _reject_teleports(_dedup_sort(series), max_speed)
    if len(series) < 3:
        return 0.0, 0.0, 0.0, 0.0
    series = _smooth(series)
    dist = 0.0
    for (t0, x0, y0), (t1, x1, y1) in zip(series, series[1:]):
        dt = t1 - t0
        if dt <= 0:
            continue
        d = hypot(x1 - x0, y1 - y0)
        if d / dt > max_speed:
            continue
        dist += d
    secs = series[-1][0] - series[0][0]
    avg = (dist / secs) if secs > 0 else 0.0
    mx = _peak_speed(series, win_sec, max_speed)     # windowed → realistic peak
    if mx <= 0:                                       # sparse track → floor at avg
        mx = avg
    return dist, avg, mx, secs


def summarise(track_series, tid2team=None):
    """Aggregate per-track series into sane per-track + per-team stats.

    Only tracks with >= MIN_TRACK_PTS samples are kept. We deliberately do NOT
    report a track count as a player count.
    """
    tid2team = tid2team or {}
    per_track = []
    team_dist = defaultdict(float)
    team_topspeed = defaultdict(float)
    team_secs = defaultdict(float)
    team_tracks = defaultdict(int)
    for tid, series in track_series.items():
        if len(series) < MIN_TRACK_PTS:
            continue
        dist, avg, mx, secs = track_metrics(series)
        if dist <= 0 or secs <= 0:
            continue
        team = tid2team.get(tid, -1)
        per_track.append({
            "track": int(tid),
            "team": int(team),
            "distance_m": round(dist, 1),
            "seconds": round(secs, 1),
            "avg_speed_kmh": round(avg * 3.6, 1),
            "max_speed_kmh": round(mx * 3.6, 1),
        })
        if team in (0, 1):
            team_dist[team] += dist
            team_secs[team] += secs
            if secs >= 3.0:   # only trust longer tracks for the team's top speed
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
                "top_speed_kmh": round(team_topspeed[k] * 3.6, 1),
                "track_seconds": round(team_secs[k], 1),
            })
    return {"per_track": per_track[:12], "teams": teams,
            "stable_tracks": len(per_track)}


ZONE_EDGES_KMH = [7, 15, 20, 25]   # bands: 0-7, 7-15, 15-20, 20-25, 25+
SPRINT_KMH = 20.0                  # a run above this counts as a sprint


def speed_profile(series, max_speed=MAX_SPEED):
    """Seconds spent in each speed band + sprint count, for one track."""
    series = _reject_teleports(_dedup_sort(series), max_speed)
    if len(series) < 3:
        return [0.0] * 5, 0
    series = _smooth(series)
    zones = [0.0] * 5
    sprints, in_sprint = 0, False
    for (t0, x0, y0), (t1, x1, y1) in zip(series, series[1:]):
        dt = t1 - t0
        if dt <= 0:
            continue
        v = hypot(x1 - x0, y1 - y0) / dt
        if v > max_speed:
            in_sprint = False
            continue
        kmh = v * 3.6
        b = sum(1 for edge in ZONE_EDGES_KMH if kmh >= edge)
        zones[b] += dt
        if kmh >= SPRINT_KMH:
            if not in_sprint:
                sprints += 1
                in_sprint = True
        else:
            in_sprint = False
    return zones, sprints


# A real match has ~22 players on the pitch plus subs/refs near the touchline.
# Re-ID on a panning broadcast can't perfectly merge players who leave and
# re-enter the frame, so it tends to OVER-count. We drop tracklets whose total
# on-screen presence is small relative to the main population (likely fragments /
# spectators / refs), and cap to a realistic upper bound.
REL_PRESENCE = 0.18    # keep players present at least 18% as long as the busiest
MAX_PLAYERS = 40       # hard ceiling (22 on pitch + subs/keepers/refs)


def summarise_players(players, min_seconds=15.0):
    """Per-player stats after Re-ID stitching. players: [{player, team, tracks,
    points:[(t,x,y)...]}]. Returns per-player + per-team rollup + player_count."""
    # 1) candidates: real movement + a minimum absolute presence
    cand = []
    for pl in players:
        dist, avg, mx, secs = track_metrics(pl["points"])
        if secs < min_seconds or dist <= 0:
            continue
        z, sp = speed_profile(pl["points"])
        cand.append({
            "player": pl["player"], "number": pl.get("number"),
            "team": int(pl.get("team", -1)), "tracks": pl.get("tracks", 1),
            "distance_m": round(dist, 1), "seconds": round(secs, 1),
            "avg_speed_kmh": round(avg * 3.6, 1), "max_speed_kmh": round(mx * 3.6, 1),
            "_mx": mx, "_z": z, "_sp": sp,
        })

    # 2) relative-presence filter: drop low-presence fragments, then cap
    raw_players = len(cand)
    if cand:
        max_secs = max(c["seconds"] for c in cand)
        cutoff = max(min_seconds, REL_PRESENCE * max_secs)
        kept = [c for c in cand if c["seconds"] >= cutoff]
        kept.sort(key=lambda r: r["seconds"], reverse=True)
        kept = kept[:MAX_PLAYERS]
    else:
        kept = []

    # 3) rollups over the kept players only
    team_dist = defaultdict(float)
    team_top = defaultdict(float)
    team_n = defaultdict(int)
    zones_total = [0.0] * 5
    sprints_total = 0
    for c in kept:
        for i in range(5):
            zones_total[i] += c["_z"][i]
        sprints_total += c["_sp"]
        team = c["team"]
        if team in (0, 1):
            team_dist[team] += c["distance_m"]
            team_n[team] += 1
            if c["seconds"] >= 3.0:
                team_top[team] = max(team_top[team], c["_mx"])

    out = [{k: v for k, v in c.items() if not k.startswith("_")} for c in kept]
    out.sort(key=lambda r: r["distance_m"], reverse=True)
    for i, p in enumerate(out):       # clean sequential rank (1..N), not raw track id
        p["player"] = i + 1
    teams = []
    for k in (0, 1):
        if team_n[k]:
            teams.append({
                "team": k,
                "players": team_n[k],
                "distance_total_m": round(team_dist[k], 1),
                "distance_avg_m": round(team_dist[k] / team_n[k], 1),
                "top_speed_kmh": round(team_top[k] * 3.6, 1),
            })
    return {"players": out[:28], "teams": teams, "player_count": len(out),
            "raw_players": raw_players,
            "speed_zones": [round(z, 1) for z in zones_total],
            "sprints": sprints_total}


if __name__ == "__main__":
    # straight line, 5 m/s for 10 s -> ~50 m, ~5 m/s, capped max.
    a = [(t * 0.1, 5.0 * (t * 0.1), 0.0) for t in range(101)]
    dist, avg, mx, secs = track_metrics(a)
    assert abs(dist - 50.0) < 1.5, dist
    assert abs(avg - 5.0) < 0.3, avg
    assert mx <= MAX_SPEED, mx
    assert abs(secs - 10.0) < 0.01, secs

    # teleport spike must be rejected, distance stays clean, speed bounded.
    b = list(a); b.insert(50, (5.05, 9999.0, 9999.0))
    d2, _, mx2, _ = track_metrics(b)
    assert abs(d2 - 50.0) < 3.0, d2
    assert mx2 <= MAX_SPEED, mx2

    out = summarise({1: a, 2: b}, {1: 0, 2: 1})
    assert out["stable_tracks"] == 2
    assert all(t["top_speed_kmh"] <= MAX_SPEED * 3.6 + 0.1 for t in out["teams"])
    print("physics self-test OK:", round(dist, 1), "m,", round(mx * 3.6, 1), "km/h |", out["teams"])
