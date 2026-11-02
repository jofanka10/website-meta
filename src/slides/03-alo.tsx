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
    { no: '01', title: 'Seleksi berbobot', text: 'Titik acuan dipilih dengan seleksi berbobot, sehingga kandidat yang lebih baik lebih sering dijadikan acuan.' },
    { no: '02', title: 'Gerak acak', text: 'Kandidat lain bergerak acak di sekitar acuan tersebut.' },
    { no: '03', title: 'Radius menyempit', text: 'Radius geraknya menyempit seiring iterasi, sehingga pencarian makin fokus.' },
]

export default function Slide03() {
    return (
        <div style={root}>
            <h1 style={title}>Apa itu ALO?</h1>

            <div style={card}>
                <p style={{ margin: 0, fontSize: '1.9cqmin', lineHeight: 1.6 }}>
                    Ant Lion Optimizer (ALO) diperkenalkan oleh Mirjalili pada tahun 2015. ALO termasuk
                    algoritma metaheuristik berbasis populasi: sekumpulan kandidat solusi dibangkitkan,
                    dinilai, lalu diperbaiki secara bertahap.
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

                <p style={{ margin: 0, fontSize: '1.9cqmin', lineHeight: 1.6 }}>
                    Dalam penjadwalan task, setiap solusi adalah vektor pemetaan task ke VM, dan nilai
                    fitness-nya adalah makespan. Untuk membayangkannya, anggap ada tim survei yang
                    mencari titik pengeboran dengan biaya terendah di sebuah area konsesi.
                </p>

                <div
                    style={{
                        paddingTop: '1.6cqmin',
                        borderTop: '1px solid rgba(255,255,255,0.12)',
                        fontSize: '1.5cqmin',
                        color: SOFT,
                        lineHeight: 1.5,
                    }}
                >
                    Mirjalili, S. (2015). The Ant Lion Optimizer. <em>Advances in Engineering Software</em>, 83, 80–98.
                </div>
            </div>
        </div>
    )
}