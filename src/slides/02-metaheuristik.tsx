import { useMemo, useState, type CSSProperties } from 'react'
import Field, { type Dot } from '../components/Field'

const N = 30
const CENTER = { x: 1, y: -1 }
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const SOFT = 'rgba(255,255,255,0.6)'
const AMBER = '#fbbf24'
const SKY = '#38bdf8'

const gauss = () =>
    Math.sqrt(-2 * Math.log(Math.random() || 1e-9)) * Math.cos(2 * Math.PI * Math.random())
const clamp = (v: number) => Math.max(-4, Math.min(4, v))

const root: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3cqmin',
    padding: '4cqmin 4cqw 9cqmin',
    color: '#fff',
    fontFamily: 'Inter, system-ui, sans-serif',
    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
}
const title: CSSProperties = {
    margin: 0,
    fontSize: '5cqmin',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    animation: `fadeUp 0.5s ${EASE} both`,
}
const row: CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: '3cqmin',
    width: 'min(86cqw, 165cqmin)',
}
const card: CSSProperties = {
    background: 'rgba(18, 18, 20, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: '2.5cqmin',
    backdropFilter: 'blur(48px)',
    WebkitBackdropFilter: 'blur(48px)',
    boxShadow: '0 2cqmin 6cqmin rgba(0, 0, 0, 0.25)',
    boxSizing: 'border-box',
}
const badge: CSSProperties = {
    flex: 1,
    padding: '1.8cqmin 2cqmin',
    borderRadius: '1.4cqmin',
    border: '1px solid rgba(255,255,255,0.1)',
}
const badgeTitle: CSSProperties = {
    fontSize: '2.2cqmin',
    fontWeight: 700,
    marginBottom: '0.8cqmin',
}
const badgeText: CSSProperties = {
    fontSize: '1.7cqmin',
    lineHeight: 1.5,
    opacity: 0.85,
}

export default function Slide02() {
    const noise = useMemo(() => Array.from({ length: N }, () => [gauss(), gauss()]), [])
    const [explore, setExplore] = useState(0.5)

    const dots: Dot[] = noise.map(([a, b]) => ({
        x: clamp(CENTER.x + a * explore * 3),
        y: clamp(CENTER.y + b * explore * 3),
        color: explore < 0.35 ? AMBER : explore > 0.7 ? SKY : '#ffffff',
        r: 3,
    }))

    const mode = explore < 0.35 ? 'Eksploitasi' : explore > 0.7 ? 'Eksplorasi' : 'Seimbang'
    const modeColor = explore < 0.35 ? AMBER : explore > 0.7 ? SKY : SOFT

    return (
        <div style={root}>
            <h1 style={title}>Apa itu Metaheuristik?</h1>

            <div style={row}>
                {/* kiri: demo interaktif */}
                <div
                    style={{
                        ...card,
                        padding: '3cqmin',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2cqmin',
                        flexShrink: 0,
                        animation: `fadeUp 0.7s ${EASE} 0.12s both`,
                    }}
                >
                    <div style={{ borderRadius: '1.2cqmin', overflow: 'hidden', boxShadow: '0 2cqmin 4cqmin rgba(0,0,0,0.3)' }}>
                        <Field dots={dots} star={[CENTER.x, CENTER.y]} size="34cqmin" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.6cqmin', fontSize: '1.7cqmin' }}>
                        <span style={{ color: AMBER, fontWeight: 600 }}>Eksploitasi</span>
                        <input
                            type="range"
                            min={0.05}
                            max={1}
                            step={0.01}
                            value={explore}
                            onChange={(e) => setExplore(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#ff5a5f' }}
                        />
                        <span style={{ color: SKY, fontWeight: 600 }}>Eksplorasi</span>
                    </div>

                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '1.6cqmin',
                            padding: '0.8cqmin 1.6cqmin',
                            borderRadius: '1cqmin',
                            background: 'rgba(0,0,0,0.25)',
                            color: modeColor,
                            fontWeight: 600,
                            transition: 'color 0.3s',
                        }}
                    >
                        Mode: {mode}, σ = {(explore * 3).toFixed(1)}
                    </div>
                </div>

                {/* kanan: penjelasan */}
                <div
                    style={{
                        ...card,
                        flex: 1,
                        minWidth: 0,
                        padding: '3.5cqmin 4cqmin',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '2.6cqmin',
                        animation: `fadeUp 0.7s ${EASE} 0.22s both`,
                    }}
                >
                    <p style={{ margin: 0, fontSize: '1.9cqmin', lineHeight: 1.6 }}>
                        Metaheuristik adalah{' '}
                        <strong style={{ color: '#e2e8f0' }}>strategi pencarian umum</strong> untuk masalah
                        optimasi yang sulit, ketika metode eksak terlalu lama atau tidak tersedia. Metode ini
                        tidak menjamin solusi optimal, tetapi biasanya menghasilkan solusi yang sangat baik
                        dalam waktu yang wajar.
                    </p>

                    <div style={{ display: 'flex', gap: '2cqmin' }}>
                        <div style={{ ...badge, background: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.2)' }}>
                            <div style={{ ...badgeTitle, color: AMBER }}>Eksploitasi</div>
                            <div style={badgeText}>
                                Memperbaiki area yang sudah menjanjikan, fokus di sekitar solusi terbaik saat ini.
                            </div>
                        </div>
                        <div style={{ ...badge, background: 'rgba(56,189,248,0.08)', borderColor: 'rgba(56,189,248,0.2)' }}>
                            <div style={{ ...badgeTitle, color: SKY }}>Eksplorasi</div>
                            <div style={badgeText}>
                                Menjelajahi area baru agar tidak terjebak di solusi lokal yang kurang optimal.
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            paddingTop: '1.6cqmin',
                            borderTop: '1px solid rgba(255,255,255,0.12)',
                            fontSize: '1.5cqmin',
                            color: SOFT,
                            lineHeight: 1.5,
                        }}
                    >
                        Glover (1986). <em>Computers &amp; Operations Research</em>, 13(5). ·
                        Blum &amp; Roli (2003). <em>ACM Computing Surveys</em>, 35(3).
                    </div>
                </div>
            </div>
        </div>
    )
}