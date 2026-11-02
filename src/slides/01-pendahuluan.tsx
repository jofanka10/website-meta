const members = [
    'Revalina Erica Permatasri (007)',
    'Clarissa Aydin Rahmazea (014)',
    'Muhammad Afrizan Rasya (048)',
    'Angga Firmansyah (062)',
    'Jofanka Al-Kautsar P A (107)',
]

export default function Slide01() {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
            }}
        >
            <div
                style={{
                    width: '60cqw',
                    padding: '4cqw 5cqw',
                    borderRadius: '2cqw',
                    background: 'rgba(20, 12, 22, 0.32)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(48px)',
                    WebkitBackdropFilter: 'blur(48px)',
                    boxShadow: '0 2cqw 6cqw rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2.4cqw',
                }}
            >
                <span
                    style={{
                        alignSelf: 'flex-start',
                        fontSize: '0.9cqw',
                        fontWeight: 600,
                        padding: '0.5cqw 1.1cqw',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.92)',
                        color: '#111',
                    }}
                >
                    Tugas SOKA K2
                </span>

                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: '3.6cqw',
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: '-0.02em',
                            color: '#fff',
                        }}
                    >
                        Algoritma Metaheuristik
                    </h1>
                    <h2
                        style={{
                            margin: '1cqw 0 0',
                            fontSize: '1.4cqw',
                            fontWeight: 500,
                            lineHeight: 1.4,
                            color: 'rgba(255, 255, 255, 0.82)',
                        }}
                    >
                        Ant Lion Optimizer (ALO) dan Grasshopper Optimization Algorithm (GOA)
                    </h2>
                </div>

                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />

                <div>
                    <p
                        style={{
                            margin: '0 0 1cqw',
                            fontSize: '0.95cqw',
                            color: 'rgba(255, 255, 255, 0.6)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                        }}
                    >
                        Anggota Kelompok
                    </p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            columnGap: '3cqw',
                            rowGap: '0.9cqw',
                            fontSize: '1.15cqw',
                            color: '#fff',
                        }}
                    >
                        {members.map((m, i) => (
                            <div key={m} style={{ display: 'flex', gap: '1cqw', alignItems: 'baseline' }}>
                                <span style={{ color: 'rgba(255, 255, 255, 0.5)', minWidth: '1.6cqw' }}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span>{m}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}