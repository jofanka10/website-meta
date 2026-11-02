export const SIZE = 1000
export const D = 4

export type Pt = { x: number; y: number; f: number }

export function f(x: number, y: number): number {
    return 20 + x * x - 10 * Math.cos(2 * Math.PI * x) + y * y - 10 * Math.cos(2 * Math.PI * y)
}

export const mkPt = (x: number, y: number): Pt => ({ x, y, f: f(x, y) })
export const clampD = (v: number) => Math.max(-D, Math.min(D, v))
export const randD = () => Math.random() * 2 * D - D

export function toWorld(px: number, py: number) {
    return { x: -D + (px / SIZE) * 2 * D, y: D - (py / SIZE) * 2 * D }
}

export function toPixel(x: number, y: number) {
    return { x: ((x + D) / (2 * D)) * SIZE, y: ((D - y) / (2 * D)) * SIZE }
}

export function buildBackdrop(ctx: CanvasRenderingContext2D): ImageData {
    const img = ctx.createImageData(SIZE, SIZE)
    const vals = new Float32Array(SIZE * SIZE)
    let min = Infinity
    let max = -Infinity
    for (let py = 0; py < SIZE; py++) {
        for (let px = 0; px < SIZE; px++) {
            const w = toWorld(px, py)
            const v = f(w.x, w.y)
            vals[py * SIZE + px] = v
            if (v < min) min = v
            if (v > max) max = v
        }
    }
    for (let i = 0; i < vals.length; i++) {
        const t = Math.pow((vals[i] - min) / (max - min), 0.6)
        const k = i * 4
        img.data[k] = 40 + (1 - t) * 150
        img.data[k + 1] = 40 + (1 - t) * 150
        img.data[k + 2] = 44 + (1 - t) * 150
        img.data[k + 3] = 255
    }
    return img
}