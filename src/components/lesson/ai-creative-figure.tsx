import { useId } from "react";
import type { ContentBlock } from "@/content/models";
import { exchangePosters, techPosters } from "@/content/lessons/ai000/creative-work-example";

export function AiCreativeFigure({ block }: { block: Extract<ContentBlock, { type: "ai-task-figure" }> }) {
  const id = useId();
  const items = block.kind === "creative-tech-posters" ? techPosters : exchangePosters;
  return <figure className="ai-figure" data-creative-kind={block.kind} aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`} style={{ overflowWrap: "anywhere" }}>
    <p className="ai-srOnly" id={`${id}-description`}>{block.alt}</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 16 }}>
      {items.map(item => <div key={item.id} style={{ minWidth: 0 }}>
        <strong style={{ display: "block", fontSize: 16, marginBottom: 10 }}>候选 {item.id}</strong>
        <article data-poster-id={item.id} data-layout={item.layout} aria-label={`候选${item.id}海报`} style={{ background: "#f6f1e5", color: "#203c45", padding: 20, border: "2px solid #c5d5cf", borderRadius: 8, fontSize: 16, lineHeight: 1.9 }}>
          <h3 data-poster-field="name" style={{ margin: "0 0 20px", fontSize: 24, lineHeight: 1.5, fontWeight: 800, color: "#203c45" }}>{item.name}</h3>
          {item.layout === "flat" ? <div data-poster-body="flat" style={{ display: "grid", gap: 12 }}>
            <p data-poster-field="content" style={{ margin: 0 }}>{item.content}</p>
            <p data-poster-field="participation" style={{ margin: 0 }}>{item.participation}</p>
            <p data-poster-field="time" style={{ margin: 0 }}>{item.time}</p>
            <p data-poster-field="place" style={{ margin: 0 }}>{item.place}</p>
          </div> : <>
            <div data-poster-group="time-place" style={{ borderTop: "3px solid #366156", borderBottom: "1px solid #8fa89b", padding: "12px 0", marginBottom: 20, fontWeight: 700, fontSize: 18 }}>
              <p data-poster-field="time" style={{ margin: "0 0 8px" }}>{item.time}</p>
              <p data-poster-field="place" style={{ margin: 0 }}>{item.place}</p>
            </div>
            {item.layout === "split-projects" ? <ul data-poster-field="content" style={{ paddingLeft: 22, margin: "0 0 16px" }}><li>机器人演示</li><li>科学小实验</li></ul> : <p data-poster-field="content" style={{ margin: "0 0 16px" }}>{item.content}</p>}
            <p data-poster-field="participation" style={{ margin: 0, fontWeight: 700 }}>{item.participation}</p>
          </>}
        </article>
      </div>)}
    </div>
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
