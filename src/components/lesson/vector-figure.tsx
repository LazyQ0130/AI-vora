"use client";
import { useId } from "react";
import { add2, scale2, teachingU, teachingV, scalingFactors, vectorPixel, vectorView, type Point2 } from "@/lib/vector-teaching";
import type { ContentBlock } from "@/content/models";
const colors = { cyan:"#67e8f9",purple:"#c4adff",white:"#ecf0ff",muted:"#7486a6" };
function VectorPlot({ label, description, vectors, point, route }: {
  label:string; description:string; vectors:{start:Point2;end:Point2;color:string;dashed?:boolean}[];
  point?:Point2; route?:Point2[];
}) {
  const id=useId().replace(/:/g,"");
  const xTicks=Array.from({length:vectorView.maxX-vectorView.minX+1},(_,i)=>i+vectorView.minX);
  const yTicks=Array.from({length:vectorView.maxY-vectorView.minY+1},(_,i)=>i+vectorView.minY);
  const path = (points:Point2[]) => points.map((p,i)=>`${i ? "L":"M"}${vectorPixel(p).join(" ")}`).join(" ");
  return <div className="vector-plot-region" role="region" aria-label={`${label}坐标图，可横向滚动`} tabIndex={0}><svg viewBox="0 0 400 320" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>{label}</title><desc id={`${id}-desc`}>{description}。两轴等比例，每格一单位。</desc>
    <defs>{vectors.map((v,i)=><marker key={i} id={`${id}-arrow-${i}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L8 4 L0 8 Z" fill={v.color}/></marker>)}</defs>
    {xTicks.map(x=><g key={`x${x}`}><path d={path([[x,vectorView.minY],[x,vectorView.maxY]])} stroke="#344461" strokeWidth=".6"/><text x={vectorPixel([x,0])[0]} y={vectorPixel([x,0])[1]+21} textAnchor="middle" fill="#a6b6d2" fontSize="17">{x}</text></g>)}
    {yTicks.map(y=><g key={`y${y}`}><path d={path([[vectorView.minX,y],[vectorView.maxX,y]])} stroke="#344461" strokeWidth=".6"/>{y!==0&&<text x={vectorPixel([0,y])[0]-9} y={vectorPixel([0,y])[1]+5} textAnchor="end" fill="#a6b6d2" fontSize="17">{y}</text>}</g>)}
    <path d={path([[vectorView.minX,0],[vectorView.maxX,0]])} stroke="#8295b7"/><path d={path([[0,vectorView.minY],[0,vectorView.maxY]])} stroke="#8295b7"/>
    <text x="353" y={vectorPixel([0,0])[1]-12} fontSize="16" fill="#c5d1e7">东 x</text><text x={vectorPixel([0,0])[0]+7} y="26" fontSize="16" fill="#c5d1e7">北 y</text>
    {route&&<path d={path(route)} fill="none" stroke={colors.muted} strokeWidth="2" strokeDasharray="5 5"/>}
    {vectors.map((v,i)=><path key={i} d={path([v.start,v.end])} fill="none" stroke={v.color} strokeWidth="3" strokeDasharray={v.dashed?"5 4":undefined} markerEnd={`url(#${id}-arrow-${i})`}/>)}
    {point&&<circle cx={vectorPixel(point)[0]} cy={vectorPixel(point)[1]} r="5" fill={colors.white}/>}
  </svg></div>;
}
export function VectorFigure({ kind }: {kind: Extract<ContentBlock,{type:"vector-figure"}>["kind"]}) {
  const origin:Point2=[0,0];
  if(kind==="scaling") return <figure className="vector-teaching-figure"><div className="vector-plot-grid">{scalingFactors.map(factor=>{
    const end=scale2(factor,teachingU);
    return <div key={factor} className="vector-plot-card"><h3>{factor}u = ({end.join(", ")})</h3><VectorPlot label={`${factor} 倍向量`} description={`u=(3,2)，${factor}u=(${end.join(",")})${factor===0?"，零向量无确定方向":""}`} vectors={factor===0?[]:[{start:origin,end:teachingU,color:colors.muted,dashed:true},{start:origin,end,color:factor<0?colors.purple:colors.cyan}]} point={factor===0?origin:undefined}/><p>{factor>0?"方向相同":factor<0?"方向相反":"没有确定方向"} · {factor===0?"长度为 0":`长度为原来的 ${Math.abs(factor)} 倍`}</p></div>;
  })}</div><figcaption>前三幅图的灰色虚线为原向量 u=(3,2)，东向分量 : 北向分量 = 3 : 2。正倍数保持方向，负倍数反向；0u 只在原点画一个点。各图横纵轴使用相同比例。</figcaption></figure>;
  if(kind==="meaning") return <figure className="vector-teaching-figure"><div className="vector-plot-grid">
    <div className="vector-plot-card"><h3>从 (0,0) 到 (3,2)</h3><VectorPlot label="位移与路线" description="向东3、向北2的位移由原点指向(3,2)；虚线先东后北，表示一种实际路线" vectors={[{start:origin,end:teachingU,color:colors.cyan}]} route={[origin,[3,0],teachingU]}/><p>实线：整体位移；虚线：一种走法。</p></div>
    <div className="vector-plot-card"><h3>从 (1,1) 到 (4,3)</h3><VectorPlot label="平移后相同的位移" description="箭头从(1,1)指向(4,3)，仍向东3、向北2" vectors={[{start:[1,1],end:add2([1,1],teachingU),color:colors.cyan}]}/><p>起点改变，向东与向北的变化没变。</p></div>
  </div><figcaption>两轴等比例，每格一米。两支箭头的位移相同；固定起终点后，路线可以改变，位移不随绕行改变。</figcaption></figure>;
  if(kind==="components") return <figure className="vector-teaching-figure"><VectorPlot label="u 的两个坐标分量" description="u=(3,2)，水平方向变化3，竖直方向变化2" vectors={[{start:origin,end:teachingU,color:colors.cyan}]} route={[origin,[3,0],teachingU]}/><figcaption>按“东、北”的顺序记录：第一分量 +3，第二分量 +2；u=(3,2)。虚线是读分量的辅助线，不是另一种向量定义。</figcaption></figure>;
  return <figure className="vector-teaching-figure"><VectorPlot label="向量加法首尾相接" description="u=(3,2)，v=(-1,1)；把v从原点平移到u的终点(3,2)，指向(2,3)；合向量从原点指向(2,3)" vectors={[{start:origin,end:teachingU,color:colors.cyan},{start:origin,end:teachingV,color:colors.purple,dashed:true},{start:teachingU,end:add2(teachingU,teachingV),color:colors.purple},{start:origin,end:add2(teachingU,teachingV),color:colors.white}]}/><figcaption>青色 u=(3,2)，紫色 v=(−1,1)；紫色虚线显示 v 的原位置。平移后首尾相接，白色合向量 u+v=(2,3)。每格一单位。</figcaption></figure>;
}
