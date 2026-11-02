import type { ReactNode } from 'react'

export default function Page({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                padding: '5cqw 8cqw 10cqw',
                display: 'flex',
                flexDirection: 'column',
                textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                fontFamily: 'Inter, system-ui, sans-serif',
            }}
        >
            <h1 style={{ fontSize: '2.6cqw', fontWeight: 700, margin: 0, textAlign: 'center', animation: 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                {title}
            </h1>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '2cqw',
                    animation: 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both',
                }}
            >
                {children}
            </div>
        </div>
    )
}

export function Body({ children, width = '58cqw' }: { children: ReactNode; width?: string }) {
    return (
        <div style={{ width, fontSize: '1.15cqw', lineHeight: 1.6, textAlign: 'left' }}>
            {children}
        </div>
    )
}