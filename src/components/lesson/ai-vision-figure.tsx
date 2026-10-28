import { useId } from "react";
import type { ContentBlock } from "@/content/models";
import { shelfBoxes, workbenchHelmets, outlineBounds, pointsAttribute, visionCanvas } from "@/content/lessons/ai000/vision-example";
const labelStyle = { display: "block", fontSize: 14, lineHeight: 1.8, color: "#c7d2ec" } as const;
const outputStyle = { borderLeft: "3px solid #77e2df", padding: "12px 16px", margin: "16px 0", background: "#172c3a" } as const;

export function AiVisionFigure({ block }: { block: Extract<ContentBlock, {type:"ai-task-figure"}> }) {
  const id = useId(), hatch = `${id}-hatch`;
  const workbench = block.kind === "vision-workbench";
  const detection = block.kind === "vision-detection", segmentation = block.kind === "vision-segmentation";
  const objects = workbench ? workbenchHelmets : shelfBoxes;
  return <figure className="ai-figure ai-vision-figure" style={{overflowWrap:"anywhere"}} aria-labelledby={`${id}-caption`} aria-describedby={`${id}-description`} data-vision-kind={block.kind}>
    <p className="ai-srOnly" id={`${id}-description`}>{block.alt}</p>
    <span style={labelStyle}>{workbench ? "观察新图：器材室工作台" : "同一输入：货架示意图"}</span>
    <svg style={{width:"100%",height:"auto",display:"block",border:"1px solid #53627f",borderRadius:8,margin:"16px 0"}} viewBox={`0 0 ${visionCanvas.width} ${visionCanvas.height}`} role="img" aria-label={workbench ? "工作台上左上和右下各一顶安全帽，右上一本笔记本，左下一卷胶带，无相互遮挡。" : "货架上层左侧和右侧各一纸箱，下层左侧一个瓶装物品，右侧一个文件袋，无相互遮挡。"}>
      <defs><pattern id={hatch} width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#52dacf" fillOpacity=".48"/><path d="M-2 2L2-2M0 10L10 0M8 12L12 8" stroke="#eaffff" strokeWidth="1.5"/></pattern></defs>
      <rect width="360" height="240" fill="#17243c"/>
      {workbench ? <g data-base-scene="workbench">
        <rect x="12" y="12" width="336" height="216" rx="6" fill="#33435c" stroke="#96a5bc" strokeWidth="2"/>
        <g data-object="notebook"><path d="M212 25H315V102H212Z" fill="#d8e2ef" stroke="#182a44" strokeWidth="3"/><path d="M230 25V102M242 46H300M242 59H294M242 72H300" stroke="#657b98" strokeWidth="3"/></g>
        <g data-object="tape"><circle cx="83" cy="176" r="32" fill="#c8b89a" stroke="#17243c" strokeWidth="3"/><circle cx="83" cy="176" r="15" fill="#33435c" stroke="#17243c" strokeWidth="3"/></g>
        {objects.map(o=><g key={o.id} data-object={o.id}><polygon points={pointsAttribute(o.outline)} fill="#edbd55" stroke="#322e28" strokeWidth="3"/><path d={o.id==="helmet-left" ? "M40 84H120M78 32V76" : "M232 196H312M270 144V188"} fill="none" stroke="#79591f" strokeWidth="3"/></g>)}
      </g> : <g data-base-scene="shelf">
        <path d="M19 16V235M342 16V235M19 138H342M19 233H342" fill="none" stroke="#9baabe" strokeWidth="8"/>
        {objects.map(o=><g key={o.id} data-object={o.id}><polygon points={pointsAttribute(o.outline)} fill="#c69460" stroke="#3b2e28" strokeWidth="2"/><path d={o.id==="box-left" ? "M36 48L70 69L146 55M70 69V126M92 38L125 59L125 76" : "M222 44L246 68L328 64M246 68V132M267 41L293 66L293 84"} fill="none" stroke="#61442d" strokeWidth="2"/></g>)}
        <g data-object="bottle"><path d="M72 150H88V164L103 179V218H57V179L72 164Z" fill="#8fbfbf" stroke="#172e3a" strokeWidth="3"/><path d="M70 146H90V157H70Z" fill="#d9e2eb" stroke="#172e3a" strokeWidth="2"/><path d="M63 185H97V204H63Z" fill="#d6e4dc"/></g>
        <g data-object="folder"><path d="M205 160H308L316 220H196Z" fill="#e4e0d1" stroke="#4a4c53" strokeWidth="3"/><path d="M205 160L255 192L308 160" fill="none" stroke="#7d817f" strokeWidth="2"/><circle cx="255" cy="189" r="3" fill="#4a4c53"/></g>
      </g>}
      {detection && shelfBoxes.map(o=><rect key={o.id} data-detection={o.id} {...outlineBounds(o.outline)} fill="none" stroke="#8df9ed" strokeWidth="3" strokeDasharray="7 4" vectorEffect="non-scaling-stroke"/>)}
      {segmentation && shelfBoxes.map(o=><polygon key={o.id} data-semantic-category="纸箱" data-mask={o.id} points={pointsAttribute(o.outline)} fill={`url(#${hatch})`} stroke="#e8ffff" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>)}
    </svg>
    {block.kind === "vision-classification" && <div className="ai-vision-output" style={outputStyle}><span style={labelStyle}>期望交付 · 整图类别</span><strong>有纸箱</strong><p>这次只作有无判断，不交数量、位置框或轮廓。</p></div>}
    {detection && <div className="ai-vision-output" style={outputStyle}><span style={labelStyle}>期望交付 · 类别与位置</span><ul>{shelfBoxes.map(o=><li key={o.id}>纸箱 · {o.position}的独立虚线框</li>)}</ul><p>每个框对应一件目标；框内角落仍可能包含背景。</p></div>}
    {segmentation && <div className="ai-vision-output" style={outputStyle}><span style={labelStyle}>期望交付 · 纸箱类别区域</span><strong>斜线覆盖处：纸箱</strong><p>两处轮廓使用同一类别标记。实线边缘贴合外形，未给各件独立实例编号。</p></div>}
    <figcaption id={`${id}-caption`}>{block.caption}</figcaption>
  </figure>;
}
