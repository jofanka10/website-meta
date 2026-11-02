import { useEffect, useRef, type MouseEvent } from 'react'
import { SIZE, buildBackdrop, toPixel, toWorld } from '../lib/landscape'

const K = SIZE / 360 // skala titik dan garis agar ukurannya sama seperti sebelumnya

export type Dot = { x: number; y: number; color: string; r?: number; hollow?: boolean }
export type Seg = { a: [number, number]; b: [number, number]; color: string; w?: number }

type Props = {
    dots: Dot[]
    star?: [number, number]
    segs?: Seg[]
    onPick?: (x: number, y: number) => void
    size?: string
}

export default function Field({ dots, star, segs = [], onPick, size = '26cqw' }: Props) {
    const ref = useRef<HTMLCanvasElement>(null)
    const bg = useRef<ImageData | null>(null)

    useEffect(() => {
        const ctx = ref.current?.getContext('2d')
        if (!ctx) return
        if (!bg.current) bg.current = buildBackdrop(ctx)
        ctx.putImageData(bg.current, 0, 0)

        for (const s of segs) {
            const p = toPixel(s.a[0], s.a[1])
            const q = toPixel(s.b[0], s.b[1])
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = s.color
            ctx.lineWidth = (s.w ?? 1) * K
            ctx.stroke()
        }

        for (const d of dots) {
            const p = toPixel(d.x, d.y)
            ctx.beginPath()
            ctx.arc(p.x, p.y, (d.r ?? 4) * K, 0, Math.PI * 2)
            if (d.hollow) {
                ctx.strokeStyle = d.color
                ctx.lineWidth = 1.5 * K
                ctx.stroke()
            } else {
                ctx.fillStyle = d.color
                ctx.fill()
            }
        }

        if (star) {
            const p = toPixel(star[0], star[1])
            ctx.beginPath()
            ctx.arc(p.x, p.y, 9 * K, 0, Math.PI * 2)
            ctx.strokeStyle = '#7fe0c4'
            ctx.lineWidth = 2 * K
            ctx.stroke()
        }
    }, [dots, star, segs])

    const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!onPick) return
        const r = e.currentTarget.getBoundingClientRect()
        const w = toWorld(
            ((e.clientX - r.left) / r.width) * SIZE,
            ((e.clientY - r.top) / r.height) * SIZE,
        )
        onPick(w.x, w.y)
    }

    return (
        <canvas
            ref={ref}
            width={SIZE}
            height={SIZE}
            onClick={handleClick}
            style={{
                display: 'block',
                width: size,
                height: size,
                borderRadius: '0.6cqw',
                cursor: onPick ? 'crosshair' : 'default',
            }}
        />
    )
}