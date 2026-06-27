// Minimal projective homography (4-point DLT) — no dependencies.
// Used for field calibration: map the 4 marked pitch corners (image space) to a
// normalized top-down pitch, then project player points onto the real pitch.
export type Pt = [number, number]

// Solve 3x3 H mapping src[i] -> dst[i] for 4 correspondences. Row-major, h8 = 1.
export function solveHomography(src: Pt[], dst: Pt[]): number[] {
  const A: number[][] = []
  const b: number[] = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]
    const [u, v] = dst[i]
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y])
    b.push(u)
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y])
    b.push(v)
  }
  const h = solve(A, b, 8)
  return [...h, 1]
}

function solve(A: number[][], b: number[], n: number): number[] {
  const M = A.map((row, i) => [...row, b[i]])
  for (let col = 0; col < n; col++) {
    let piv = col
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r
    const tmp = M[col]
    M[col] = M[piv]
    M[piv] = tmp
    const d = M[col][col] || 1e-9
    for (let c = col; c <= n; c++) M[col][c] /= d
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const f = M[r][col]
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c]
    }
  }
  return M.map((row) => row[n])
}

export function applyH(H: number[], p: Pt): Pt {
  const [x, y] = p
  const den = H[6] * x + H[7] * y + H[8] || 1e-9
  return [(H[0] * x + H[1] * y + H[2]) / den, (H[3] * x + H[4] * y + H[5]) / den]
}
