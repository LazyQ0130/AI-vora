import { useId } from "react";
import type { ContentBlock } from "@/content/models";
import { exhibitImages, lostPropertyImages, blueWave, whiteStar, compassTicks } from "@/content/lessons/ai000/multimodal-example";

export function AiMultimodalFigure({ block }: { block: Extract<ContentBlock, { type: "ai-task-figure" }> }) {
  const id = useId();
  const lost = block.kind === "multimodal-lost-property";
  const items = lost ? lostPropertyImages : exhibitImages;
  return <figure className="ai-figure" data-multimodal-kind={block.kind} aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`} style={{ overflowWrap: "anywhere" }}>
    <p className="ai-srOnly" id={`${id}-description`}>{block.alt}</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: 16 }}>
      {items.map(item => <div key={item.id} data-photo-id={item.id} style={{ minWidth: 0, padding: 12, border: "1px solid #53627f", borderRadius: 8, background: "#17243c" }}>
        <strong style={{ display: "block", fontSize: 14, lineHeight: 1.8, marginBottom: 8 }}>{lost ? "原图" : "图片"} {item.id}</strong>
        <svg viewBox="0 0 240 180" role="img" aria-label={item.alt} style={{ display: "block", width: "100%", height: "auto" }}>
          {item.shape === "bowl" && <g data-shape="bowl">
            <path d="M36 68Q120 48 204 68C197 124 170 146 120 148C70 146 44 124 36 68Z" fill="#eee4ce" stroke="#6d675e" strokeWidth="3" />
            <ellipse cx="120" cy="68" rx="84" ry="18" fill="#d6c9ae" stroke="#6d675e" strokeWidth="3" />
            <ellipse cx="120" cy="68" rx="69" ry="11" fill="#f5eddb" />
            <path data-visible-feature="blue-wave" d={blueWave} fill="none" stroke="#2762c6" strokeWidth="5" strokeLinecap="round" />
          </g>}
          {item.shape === "compass" && <g data-shape="compass">
            <circle cx="120" cy="90" r="68" fill="#d3b879" stroke="#746546" strokeWidth="3" />
            <circle cx="120" cy="90" r="63" fill="#f2ead4" stroke="#746546" strokeWidth="2" />
            <g data-visible-feature="scale" stroke="#3c4555" strokeWidth="2.5">{compassTicks.map((tick, i) => <line key={i} {...tick} />)}</g>
            <g data-visible-feature="needle"><path d="M120 42L132 98L120 90L108 98Z" fill="#bb334b" /><path d="M120 138L108 82L120 90L132 82Z" fill="#33435c" /><circle cx="120" cy="90" r="5" fill="#746546" /></g>
          </g>}
          {item.shape === "star-cup" && <g data-shape="star-cup">
            <path data-visible-feature="handle" d="M158 80H178Q202 80 202 103Q202 126 178 126H158V114H175Q188 114 188 103Q188 92 175 92H158Z" fill="#3378ca" stroke="#194e87" strokeWidth="3" />
            <path d="M60 60H160V144Q160 157 146 157H74Q60 157 60 144Z" fill="#3378ca" stroke="#194e87" strokeWidth="3" />
            <ellipse cx="110" cy="60" rx="50" ry="9" fill="#bbd9f3" stroke="#194e87" strokeWidth="3" />
            <polygon data-visible-feature="white-star" points={whiteStar} fill="#fffaf0" />
          </g>}
          {item.shape === "striped-flask" && <g data-shape="striped-flask">
            <rect x="76" y="48" width="88" height="113" rx="14" fill="#bd3d52" stroke="#6c2839" strokeWidth="3" />
            <rect data-visible-feature="lid" x="78" y="31" width="84" height="27" rx="6" fill="#c6d0dc" stroke="#516175" strokeWidth="3" />
            <g data-visible-feature="black-stripes" stroke="#1a1b21" strokeWidth="7"><path d="M78 91H162" /><path d="M78 111H162" /></g>
          </g>}
        </svg>
      </div>)}
    </div>
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
