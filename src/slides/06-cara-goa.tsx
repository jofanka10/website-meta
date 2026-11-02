import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import Field, { type Dot, type Seg } from '../components/Field'
import Tex from '../components/Tex'
import { coef, initGOA, sForce, stepGOA, type GOA } from '../lib/goa'
import { useEased } from '../lib/useEased'

const N = 12
const T = 40
const ACC = '#ff5a5f'
const ATT = '#7fe0c4'
const SOFT = 'rgba(255,255,255,0.6)'
const SPEEDS = [800, 400, 200, 80]
const SPEED_LABELS = ['0.5×', '1×', '2×', '4×']

const STEPS = [
    { name: 'Gaya antar-kandidat', desc: 'Kandidat saling tarik jika jaraknya sedang dan saling tolak jika terlalu dekat. Klik satu kandidat untuk melihat gayanya: hijau berarti tarikan, merah berarti tolakan.' },
    { name: 'Tarikan ke target', desc: 'Setelah gaya dihitung, setiap kandidat juga ditarik menuju solusi terbaik sejauh ini, yaitu titik bercincin hijau.' },
    { name: 'Koefisien c', desc: 'Nilai c menurun tiap iterasi. Di awal gaya kuat sehingga pencarian luas. Di akhir gaya melemah sehingga kandidat berkumpul.' },
]
const INTRO = 'Kandidat ditempatkan secara acak. Klik salah satu titik untuk melihat gaya yang dialaminya, lalu tekan Lanjut.'

const root: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3cqmin 4cqw 8cqmin',
    color: '#fff',
    fontFamily: 'Inter, system-ui, sans-serif',
    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
}
const card: CSSProperties = {
    width: 'min(86cqw, 165cqmin)',
    maxHeight: '86cqmin',
    overflowY: 'auto',
    boxSizing: 'border-box',
    padding: '3cqmin 3.5cqmin',
    borderRadius: '2.5cqmin',
    background: 'rgba(18, 18, 20, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(48px)',
    WebkitBackdropFilter: 'blur(48px)',
    boxShadow: '0 2cqmin 6cqmin rgba(0, 0, 0, 0.25)',
    display: 'grid',
    gridTemplateColumns: '40cqmin 1fr',
    gap: '3.5cqmin',
    alignItems: 'center',
    animation: 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both',
}
const pill: CSSProperties = {
    alignSelf: 'flex-start',
    fontSize: '1.5cqmin',
    fontWeight: 600,
    padding: '0.6cqmin 1.6cqmin',
    borderRadius: '999px',
    background: 'rgba(255, 255, 255, 0.92)',
    color: '#111',
    textShadow: 'none',
}
const primary: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1cqmin',
    background: '#fff',
    color: '#111',
    border: 'none',
    borderRadius: '999px',
    padding: '0.6cqmin 1.8cqmin 0.6cqmin 0.6cqmin',
    fontSize: '1.7cqmin',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
}
const arrowDot: CSSProperties = {
    width: '2.8cqmin',
    height: '2.8cqmin',
    borderRadius: '50%',
    background: ACC,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.7cqmin',
}
const ghost: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '999px',
    padding: '0.7cqmin 1.8cqmin',
    fontSize: '1.7cqmin',
    color: '#fff',
    fontFamily: 'inherit',
    cursor: 'pointer',
}
const label: CSSProperties = { margin: 0, fontSize: '1.4cqmin', color: SOFT }
const big: CSSProperties = {
    margin: '0.3cqmin 0 0',
    fontSize: '3.6cqmin',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.02em',
}

function Sparkline({ data }: { data: number[] }) {
    if (data.length < 2) return <div style={{ height: '4cqmin' }} />
    const W = 200
    const H = 48
    const mn = Math.min(...data)
    const mx = Math.max(...data)
    const rng = mx - mn || 1
    const pts = data
        .map((v, i) => `${(i / (data.length - 1)) * W},${H - 3 - ((v - mn) / rng) * (H - 6)}`)
        .join(' ')
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '4cqmin', display: 'block' }} preserveAspectRatio="none">
            <polyline points={pts} fill="none" stroke={ACC} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}

function FormulaRow({ title, math }: { title: string; math: string }) {
    return (
        <div>
            <p style={{ ...label, marginBottom: '0.2cqmin' }}>{title}</p>
            <div style={{ fontSize: '1.5cqmin' }}>
                <Tex math={math} />
            </div>
        </div>
    )
}

export default function Slide06() {
    const [s, setS] = useState<GOA>(() => initGOA(N))
    const [pick, setPick] = useState<number | null>(null)
    const [auto, setAuto] = useState(false)
    const [spdIdx, setSpdIdx] = useState(1)

    const gE = useEased(s.g, 450)
    const bestArr = useMemo(() => [s.best], [s.best])
    const bestE = useEased(bestArr, 450)[0]

    const done = s.t >= T

    const next = () => setS((p) => (p.t >= T ? p : stepGOA(p, T)))

    const reset = () => {
        setAuto(false)
        setPick(null)
        setS(initGOA(N))
    }

    useEffect(() => {
        if (!auto) return
        const id = setInterval(() => setS((p) => (p.t >= T ? p : stepGOA(p, T))), SPEEDS[spdIdx])
        return () => clearInterval(id)
    }, [auto, spdIdx])

    useEffect(() => {
        if (s.t >= T) setAuto(false)
    }, [s.t])

    const pickAt = (x: number, y: number) => {
        let idx = -1
        let bd = Infinity
        gE.forEach((g, i) => {
            const d = Math.hypot(g.x - x, g.y - y)
            if (d < bd) {
                bd = d
                idx = i
            }
        })
        setPick(bd < 1.2 ? idx : null)
    }

    const activeStep = pick !== null ? 0 : done ? 2 : s.t > 0 ? 1 : -1

    const dots: Dot[] = gE.map((g, i) => ({
        x: g.x,
        y: g.y,
        color: i === pick ? ATT : '#ffffff',
        r: i === pick ? 5.5 : 3.5,
    }))

    const segs: Seg[] = []

    if (s.t > 0)
        gE.forEach((g, i) => {
            const p = s.prev[i]
            segs.push({
                a: [p.x, p.y],
                b: [g.x, g.y],
                color: pick === i ? '#ffffff' : pick !== null ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)',
                w: pick === i ? 2 : 1,
            })
        })

    if (pick !== null && pick < gE.length) {
        const a = gE[pick]
        gE.forEach((b, j) => {
            if (j === pick) return
            const d = Math.hypot(b.x - a.x, b.y - a.y)
            const sv = sForce(d)
            segs.push({
                a: [a.x, a.y],
                b: [b.x, b.y],
                color: sv >= 0 ? ATT : ACC,
                w: 1 + Math.abs(sv) * 14,
            })
        })
    }

    return (
        <div style={root}>
            <div style={card}>
                <div>
                    <div style={{ borderRadius: '1.2cqmin', overflow: 'hidden', boxShadow: '0 2cqmin 4cqmin rgba(0,0,0,0.3)' }}>
                        <Field dots={dots} star={[bestE.x, bestE.y]} segs={segs} onPick={pickAt} size="40cqmin" />
                    </div>
                    <p style={{ ...label, textAlign: 'center', marginTop: '1.4cqmin' }}>
                        Klik kandidat untuk melihat gaya yang dialaminya
                    </p>
                </div>

                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.6cqmin' }}>
                    <span style={pill}>Metode</span>
                    <h1 style={{ margin: 0, fontSize: '4.2cqmin', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                        Cara Kerja GOA
                    </h1>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4cqmin' }}>
                        {STEPS.map((p, i) => {
                            const on = i === activeStep
                            return (
                                <div
                                    key={p.name}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: '1.4cqmin',
                                        opacity: activeStep < 0 || on ? 1 : 0.4,
                                        transition: 'opacity 0.3s ease',
                                    }}
                                >
                                    <span style={{ fontSize: '1.5cqmin', fontWeight: 700, color: on ? ACC : SOFT, minWidth: '2.6cqmin' }}>
                                        0{i + 1}
                                    </span>
                                    <span style={{ fontSize: '2.3cqmin', fontWeight: 800, letterSpacing: '-0.01em' }}>{p.name}</span>
                                </div>
                            )
                        })}
                    </div>

                    <p style={{ margin: 0, fontSize: '1.5cqmin', lineHeight: 1.45, color: SOFT, minHeight: '4.4cqmin' }}>
                        {activeStep >= 0 ? STEPS[activeStep].desc : INTRO}
                    </p>

                    <div style={{ display: 'flex', gap: '4cqmin' }}>
                        <div>
                            <p style={label}>Iterasi</p>
                            <p style={{ ...big, color: ACC }}>
                                {s.t}
                                <span style={{ fontSize: '1.9cqmin', color: SOFT, fontWeight: 600 }}> / {T}</span>
                            </p>
                        </div>
                        <div>
                            <p style={label}>Koefisien c</p>
                            <p style={big}>{coef(s.t, T).toFixed(2)}</p>
                        </div>
                        <div>
                            <p style={label}>Nilai terbaik</p>
                            <p style={big}>{s.best.f.toFixed(3)}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1cqmin' }}>
                        <FormulaRow
                            title="Posisi baru"
                            math={String.raw`x_i^{t+1} = c \sum_{j \ne i} c\,\frac{ub - lb}{2}\, s(d_{ij})\,\frac{x_j - x_i}{d_{ij}} + T^{t}`}
                        />
                        <FormulaRow title="Fungsi gaya" math={String.raw`s(r) = f\, e^{-r/l} - e^{-r}, \quad f = 0{,}5,\; l = 1{,}5`} />
                        <FormulaRow title="Koefisien" math={String.raw`c = c_{max} - t\,\frac{c_{max} - c_{min}}{T}`} />
                    </div>

                    <div>
                        <p style={label}>Konvergensi</p>
                        <Sparkline data={s.hist} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.4cqmin', flexWrap: 'wrap' }}>
                        <button onClick={next} disabled={done} style={{ ...primary, opacity: done ? 0.4 : 1 }}>
                            <span style={arrowDot}>→</span>
                            Lanjut
                        </button>
                        <button onClick={() => setAuto((a) => !a)} disabled={done} style={{ ...ghost, opacity: done ? 0.4 : 1 }}>
                            {auto ? 'Jeda' : 'Putar'}
                        </button>
                        <button onClick={reset} style={ghost}>
                            Reset
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '2.2cqmin', fontSize: '1.5cqmin' }}>
                        {SPEED_LABELS.map((l, i) => (
                            <button
                                key={l}
                                onClick={() => setSpdIdx(i)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontSize: '1.5cqmin',
                                    color: i === spdIdx ? ACC : SOFT,
                                    fontWeight: i === spdIdx ? 700 : 400,
                                }}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}