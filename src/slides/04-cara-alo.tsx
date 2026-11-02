import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import Field, { type Dot, type Seg } from '../components/Field'
import { initALO, stepALO, type ALO } from '../lib/alo'
import { useEased } from '../lib/useEased'

const T = 30
const ACC = '#ff5a5f'
const SOFT = 'rgba(255,255,255,0.6)'

const PHASES = [
    { name: 'Seleksi', desc: 'Setiap semut memilih antlion dengan roulette. Fitness lebih kecil berarti peluang terpilih lebih besar.' },
    { name: 'Random walk', desc: 'Semut bergerak acak di sekitar antlion terpilih dan solusi terbaik. Radius makin kecil seiring iterasi.' },
    { name: 'Update', desc: 'Jika posisi semut lebih baik, ia menggantikan antlion. Solusi terbaik global ikut diperbarui.' },
]
const INTRO = 'Semut dan antlion ditempatkan secara acak. Klik semut untuk melihat koneksinya, lalu tekan Lanjut.'
const SPEEDS = [900, 450, 200, 80]
const SPEED_LABELS = ['0.5×', '1×', '2×', '4×']

const root: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4cqmin 4cqw 9cqmin',
    color: '#fff',
    fontFamily: 'Inter, system-ui, sans-serif',
    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
}
const card: CSSProperties = {
    width: 'min(86cqw, 165cqmin)',
    padding: '3.5cqmin 4cqmin',
    borderRadius: '2.5cqmin',
    background: 'rgba(18, 18, 20, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(48px)',
    WebkitBackdropFilter: 'blur(48  px)',
    boxShadow: '0 2cqmin 6cqmin rgba(0, 0, 0, 0.25)',
    display: 'grid',
    gridTemplateColumns: '44cqmin 1fr',
    gap: '4cqmin',
    alignItems: 'center',
    animation: 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both',
}
const pill: CSSProperties = {
    alignSelf: 'flex-start',
    fontSize: '1.7cqmin',
    fontWeight: 600,
    padding: '0.7cqmin 1.8cqmin',
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
    padding: '0.8cqmin 2cqmin 0.8cqmin 0.8cqmin',
    fontSize: '1.9cqmin',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
}
const arrowDot: CSSProperties = {
    width: '3.2cqmin',
    height: '3.2cqmin',
    borderRadius: '50%',
    background: ACC,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.9cqmin',
}
const ghost: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '999px',
    padding: '0.9cqmin 2cqmin',
    fontSize: '1.9cqmin',
    color: '#fff',
    fontFamily: 'inherit',
    cursor: 'pointer',
}
const label: CSSProperties = { margin: 0, fontSize: '1.6cqmin', color: SOFT }
const big: CSSProperties = {
    margin: '0.4cqmin 0 0',
    fontSize: '5cqmin',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.02em',
}

function Sparkline({ data }: { data: number[] }) {
    if (data.length < 2) return <div style={{ height: '6cqmin' }} />
    const W = 200
    const H = 48
    const mn = Math.min(...data)
    const mx = Math.max(...data)
    const rng = mx - mn || 1
    const pts = data
        .map((v, i) => `${(i / (data.length - 1)) * W},${H - 3 - ((v - mn) / rng) * (H - 6)}`)
        .join(' ')
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '6cqmin', display: 'block' }} preserveAspectRatio="none">
            <polyline points={pts} fill="none" stroke={ACC} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}

export default function Slide04() {
    const [n, setN] = useState(12)
    const [s, setS] = useState<ALO>(() => initALO(12))
    const [auto, setAuto] = useState(false)
    const [spdIdx, setSpdIdx] = useState(1)
    const [sel, setSel] = useState<number | null>(null)

    const antsE = useEased(s.ants, 450)
    const liosE = useEased(s.lions, 450)
    const bestArr = useMemo(() => [s.best], [s.best])
    const bestE = useEased(bestArr, 450)[0]

    const next = () => setS((p) => (p.t >= T ? p : stepALO(p, T)))

    const doReset = (pop: number) => {
        setAuto(false)
        setSel(null)
        setS(initALO(pop))
    }

    useEffect(() => {
        if (!auto) return
        const id = setInterval(() => setS((p) => (p.t >= T ? p : stepALO(p, T))), SPEEDS[spdIdx])
        return () => clearInterval(id)
    }, [auto, spdIdx])

    useEffect(() => {
        if (s.t >= T) setAuto(false)
    }, [s.t])

    const started = s.sel.length > 0
    const activePhase = started ? (s.phase === 0 ? 2 : s.phase - 1) : -1
    const done = s.t >= T

    const pickAnt = (x: number, y: number) => {
        let idx = -1
        let bd = Infinity
        antsE.forEach((a, i) => {
            const d = Math.hypot(a.x - x, a.y - y)
            if (d < bd) {
                bd = d
                idx = i
            }
        })
        setSel(bd < 1.2 ? idx : null)
    }

    const dots: Dot[] = [
        ...antsE.map((a, i) => ({
            x: a.x,
            y: a.y,
            color: i === sel ? ACC : '#ffffff',
            r: i === sel ? 5.5 : 3.5,
        })),
        ...liosE.map((l) => ({ x: l.x, y: l.y, color: '#ffb3b3', r: 6, hollow: true })),
    ]

    const segs: Seg[] = []
    if (s.phase === 1)
        antsE.forEach((a, i) => {
            const l = liosE[s.sel[i]]
            segs.push({
                a: [a.x, a.y],
                b: [l.x, l.y],
                color: sel === i ? '#ffffff' : sel !== null ? 'rgba(255,90,95,0.25)' : 'rgba(255,90,95,0.9)',
                w: sel === i ? 2 : 1,
            })
        })
    if (s.phase === 2)
        antsE.forEach((a, i) => {
            const p = s.prev[i]
            segs.push({
                a: [p.x, p.y],
                b: [a.x, a.y],
                color: sel === i ? '#ffffff' : sel !== null ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                w: sel === i ? 2 : 1,
            })
        })
    if (sel !== null && started && s.phase !== 1) {
        const l = liosE[s.sel[sel]]
        if (l && antsE[sel])
            segs.push({ a: [antsE[sel].x, antsE[sel].y], b: [l.x, l.y], color: 'rgba(255,90,95,0.7)' })
    }

    return (
        <div style={root}>
            <div style={card}>
                <div>
                    <div style={{ borderRadius: '1.2cqmin', overflow: 'hidden', boxShadow: '0 2cqmin 4cqmin rgba(0,0,0,0.3)' }}>
                        <Field dots={dots} star={[bestE.x, bestE.y]} segs={segs} onPick={pickAnt} size="44cqmin" />
                    </div>
                    <p style={{ ...label, textAlign: 'center', marginTop: '1.6cqmin' }}>
                        Klik semut untuk menyorot koneksinya
                    </p>
                </div>

                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2.2cqmin' }}>
                    <span style={pill}>Metode</span>
                    <h1 style={{ margin: 0, fontSize: '5cqmin', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                        Cara Kerja ALO
                    </h1>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8cqmin' }}>
                        {PHASES.map((p, i) => {
                            const on = i === activePhase
                            return (
                                <div
                                    key={p.name}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: '1.6cqmin',
                                        opacity: activePhase < 0 || on ? 1 : 0.4,
                                        transition: 'opacity 0.3s ease',
                                    }}
                                >
                                    <span style={{ fontSize: '1.8cqmin', fontWeight: 700, color: on ? ACC : SOFT, minWidth: '3cqmin' }}>
                                        0{i + 1}
                                    </span>
                                    <span style={{ fontSize: '3cqmin', fontWeight: 800, letterSpacing: '-0.01em' }}>{p.name}</span>
                                </div>
                            )
                        })}
                    </div>

                    <p style={{ margin: 0, fontSize: '1.9cqmin', lineHeight: 1.5, color: SOFT, minHeight: '5cqmin' }}>
                        {activePhase >= 0 ? PHASES[activePhase].desc : INTRO}
                    </p>

                    <div style={{ display: 'flex', gap: '6cqmin' }}>
                        <div>
                            <p style={label}>Iterasi</p>
                            <p style={{ ...big, color: ACC }}>
                                {s.t}
                                <span style={{ fontSize: '2.4cqmin', color: SOFT, fontWeight: 600 }}> / {T}</span>
                            </p>
                        </div>
                        <div>
                            <p style={label}>Nilai terbaik</p>
                            <p style={big}>{s.best.f.toFixed(3)}</p>
                        </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '1.7cqmin', color: SOFT, minHeight: '3cqmin' }}>
                        {sel !== null && sel < s.ants.length && (
                            <>
                                Semut #{sel + 1}: f = {s.ants[sel].f.toFixed(3)}
                                {started && s.sel[sel] !== undefined && (
                                    <>
                                        {' · '}Antlion #{s.sel[sel] + 1}: f = {s.lions[s.sel[sel]].f.toFixed(3)}
                                    </>
                                )}
                            </>
                        )}
                    </p>

                    <div>
                        <p style={label}>Konvergensi</p>
                        <Sparkline data={s.hist} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.6cqmin', flexWrap: 'wrap' }}>
                        <button onClick={next} disabled={done} style={{ ...primary, opacity: done ? 0.4 : 1 }}>
                            <span style={arrowDot}>→</span>
                            Lanjut
                        </button>
                        <button onClick={() => setAuto((a) => !a)} disabled={done} style={{ ...ghost, opacity: done ? 0.4 : 1 }}>
                            {auto ? 'Jeda' : 'Putar'}
                        </button>
                        <button onClick={() => doReset(n)} style={ghost}>
                            Reset
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '2.4cqmin', fontSize: '1.8cqmin' }}>
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
                                    fontSize: '1.8cqmin',
                                    color: i === spdIdx ? ACC : SOFT,
                                    fontWeight: i === spdIdx ? 700 : 400,
                                }}
                            >
                                {l}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2cqmin', fontSize: '1.8cqmin' }}>
                        <span style={{ color: SOFT }}>Populasi</span>
                        <input
                            type="range"
                            min={4}
                            max={30}
                            value={n}
                            onChange={(e) => {
                                const v = Number(e.target.value)
                                setN(v)
                                doReset(v)
                            }}
                            style={{ flex: 1, accentColor: ACC }}
                        />
                        <span style={{ minWidth: '4cqmin', textAlign: 'right', fontWeight: 700 }}>{n}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}