import { D, clampD, mkPt, randD, type Pt } from './landscape'

export type GOA = { g: Pt[]; prev: Pt[]; best: Pt; t: number; hist: number[] }

export const sForce = (r: number) => 0.5 * Math.exp(-r / 1.5) - Math.exp(-r)
export const coef = (t: number, T: number) => 1 - (t * (1 - 0.0001)) / T

export function initGOA(n: number): GOA {
    const g = Array.from({ length: n }, () => mkPt(randD(), randD()))
    const best = g.reduce((a, b) => (b.f < a.f ? b : a))
    return { g, prev: g, best, t: 0, hist: [best.f] }
}

export function stepGOA(s: GOA, T: number): GOA {
    const c = coef(s.t, T)
    const target = s.best
    const g = s.g.map((gi, i) => {
        let sx = 0
        let sy = 0
        s.g.forEach((gj, j) => {
            if (i === j) return
            const dx = gj.x - gi.x
            const dy = gj.y - gi.y
            const d = Math.hypot(dx, dy)
            if (d < 1e-9) return
            const k = (c * D * sForce(d)) / d
            sx += k * dx
            sy += k * dy
        })
        return mkPt(clampD(c * sx + target.x), clampD(c * sy + target.y))
    })
    const best = g.reduce((a, b) => (b.f < a.f ? b : a), s.best)
    return { g, prev: s.g, best, t: s.t + 1, hist: [...s.hist, best.f] }
}