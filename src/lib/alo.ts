import { D, clampD, mkPt, randD, type Pt } from './landscape'

export type ALO = {
    ants: Pt[]
    prev: Pt[]
    lions: Pt[]
    sel: number[]
    best: Pt
    t: number
    phase: 0 | 1 | 2
    hist: number[]
}

export function initALO(n: number): ALO {
    const ants = Array.from({ length: n }, () => mkPt(randD(), randD()))
    const lions = Array.from({ length: n }, () => mkPt(randD(), randD()))
    const best = lions.reduce((a, b) => (b.f < a.f ? b : a))
    return { ants, prev: ants, lions, sel: [], best, t: 0, phase: 0, hist: [best.f] }
}

export function stepALO(s: ALO, T: number): ALO {
    // Fase 0: seleksi antlion dengan roulette
    if (s.phase === 0) {
        const w = s.lions.map((l) => 1 / (1 + l.f))
        const tot = w.reduce((a, b) => a + b, 0)
        const sel = s.ants.map(() => {
            let r = Math.random() * tot
            let k = 0
            while (k < w.length - 1 && (r -= w[k]) > 0) k++
            return k
        })
        return { ...s, sel, phase: 1 }
    }

    // Fase 1: random walk di sekitar antlion terpilih dan solusi terbaik
    if (s.phase === 1) {
        const half = D * 0.5 * (1 - s.t / T) + 0.05
        const ants = s.ants.map((_, i) => {
            const a = s.lions[s.sel[i]]
            const cx = (a.x + s.best.x) / 2
            const cy = (a.y + s.best.y) / 2
            return mkPt(
                clampD(cx + (Math.random() * 2 - 1) * half),
                clampD(cy + (Math.random() * 2 - 1) * half),
            )
        })
        return { ...s, prev: s.ants, ants, phase: 2 }
    }

    // Fase 2: penggantian antlion jika semut lebih baik
    const lions = [...s.lions]
    s.ants.forEach((a, i) => {
        const k = s.sel[i]
        if (a.f < lions[k].f) lions[k] = a
    })
    const best = lions.reduce((x, y) => (y.f < x.f ? y : x), s.best)
    return { ...s, lions, best, t: s.t + 1, phase: 0, hist: [...s.hist, best.f] }
}