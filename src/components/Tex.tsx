import katex from 'katex'
import 'katex/dist/katex.min.css'

export default function Tex({ math }: { math: string }) {
    const html = katex.renderToString(math, { displayMode: true, throwOnError: false })
    return <div style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: html }} />
}