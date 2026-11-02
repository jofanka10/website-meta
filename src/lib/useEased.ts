import { useEffect, useRef, useState } from 'react'

type P = { x: number; y: number }

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function useEased<T extends P>(target: T[], ms = 450): P[] {
    const [cur, setCur] = useState<P[]>(target)
    const ref = useRef<P[]>(target)
    const raf = useRef(0)

    useEffect(() => {
        const from = ref.current
        if (from.length !== target.length) {
            ref.current = target
            setCur(target)
            return
        }
        const start = performance.now()
        const tick = (now: number) => {
            const k = Math.min(1, (now - start) / ms)
            const e = easeOut(k)
            const out = target.map((t, i) => ({
                x: from[i].x + (t.x - from[i].x) * e,
                y: from[i].y + (t.y - from[i].y) * e,
            }))
            ref.current = out
            setCur(out)
            if (k < 1) raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf.current)
    }, [target, ms])

    return cur
}