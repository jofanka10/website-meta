import type { CSSProperties } from 'react'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const SOFT = 'rgba(255,255,255,0.6)'

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
const card: CSSProperties = {
    width: 'min(78cqw, 150cqmin)',
    padding: '3.5cqmin 4cqmin',
    borderRadius: '2.5cqmin',
    background: 'rgba(18, 18, 20, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(48px)',
    WebkitBackdropFilter: 'blur(48px)',
    boxShadow: '0 2cqmin 6cqmin rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.6cqmin',
    boxSizing: 'border-box',
    animation: `fadeUp 0.7s ${EASE} 0.12s both`,
}
const ideaBox: CSSProperties = {
    flex: 1,
    padding: '2.4cqmin 2.2cqmin',
    borderRadius: '1.4cqmin',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
}

const ideas = [
    { no: '01', title: 'Gaya antar-kandidat', text: 'Kandidat saling menolak jika terlalu dekat dan saling menarik jika jaraknya sedang, sehingga populasi tetap berkelompok.' },
    { no: '02', title: 'Tarikan ke target', text: 'Semua kandidat juga ditarik menuju solusi terbaik sejauh ini.' },
    { no: '03', title: 'Koefisien c', text: 'Nilai c menurun tiap iterasi. Di awal gaya kuat sehingga pencarian luas, di akhir kandidat berkumpul di sekitar solusi terbaik.' },
]

export default function Slide05() {
    return (
        <div style={root}>
            <h1 style={title}>Apa itu GOA?</h1>

            <div style={card}>
                <p style={{ margin: 0, fontSize: '1.9cqmin', lineHeight: 1.6 }}>
                    Grasshopper Optimization Algorithm (GOA) diperkenalkan oleh Saremi, Mirjalili, dan Lewis
                    pada tahun 2017. Seperti ALO, GOA berbasis populasi, tetapi pergerakan kandidatnya
                    dihitung dari gaya yang dialaminya, bukan dari langkah acak.
                </p>

                <div style={{ display: 'flex', gap: '2cqmin' }}>
                    {ideas.map((it) => (
                        <div key={it.no} style={ideaBox}>
                            <div style={{ fontSize: '1.5cqmin', color: SOFT, marginBottom: '0.8cqmin' }}>{it.no}</div>
                            <div style={{ fontSize: '2.2cqmin', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.8cqmin' }}>
                                {it.title}
                            </div>
                            <div style={{ fontSize: '1.7cqmin', lineHeight: 1.55, opacity: 0.85 }}>{it.text}</div>
                        </div>
                    ))}
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
                    Saremi, S., Mirjalili, S., &amp; Lewis, A. (2017). Grasshopper Optimisation Algorithm: Theory
                    and application. <em>Advances in Engineering Software</em>, 105, 30–47.
                </div>
            </div>
        </div>
    )
}