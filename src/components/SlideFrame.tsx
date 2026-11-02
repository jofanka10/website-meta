import type { ReactNode } from 'react'

type Props = { bg?: string; children: ReactNode }

export default function SlideFrame({ bg, children }: Props) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                containerType: 'inline-size',
                background: '#141416',
                backgroundImage: bg ? `url(${bg})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                overflow: 'hidden',
            }}
        >
            {children}
        </div>
    )
}