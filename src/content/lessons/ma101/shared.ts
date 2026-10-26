import { lessonSchema, type ContentBlock, type Lesson } from "../../models";
import { mathCourseOutline } from "../../math-outline";
import type { z } from "zod";
export type MathSection = z.input<typeof lessonSchema>["sections"][number];
export const p = (text:string):ContentBlock => ({type:"paragraph",text});
export const m = (latex:string,explanation:string):ContentBlock => ({type:"math",latex,explanation});
export const table = (caption:string,columns:string[],rows:string[][]):ContentBlock => ({type:"table",caption,columns,rows});
export const note = (title:string,text:string):ContentBlock => ({type:"callout",title,text});
export const figure = (kind:Extract<ContentBlock,{type:"vector-figure"}>["kind"]):ContentBlock => ({type:"vector-figure",kind});
export const section = (id:string,title:string,blocks:ContentBlock[],tier:MathSection["tier"]="core"):MathSection => ({id,title,navGroup:id,navLabel:({scene:"问题",intuition:"理解",worked:"例题",definition:"定义",diagram:"图解",application:"应用",mistakes:"误区",practice:"练习",challenge:"挑战",code:"代码",summary:"总结"} as Record<string,string>)[id] ?? title,blocks,tier});
export const exercise = (id:string,title:string,kind:"理解"|"计算"|"迁移",prompt:string,hints:[string,string],solution:string[],rubric:string[]):ContentBlock => ({type:"exercise",id,title,kind,prompt,hints,solution,rubric});
export const localLink = (id:string,title:string,note:string) => ({title,href:`/learn/MA101/${id}`,note});
type Source = Pick<Lesson,"subtitle"|"prerequisites"|"objectives"|"assessmentMap"|"learningTime"> & {sections:MathSection[];prerequisiteLinks?:Lesson["prerequisiteLinks"];contentVersion?:number};
export function mathLesson(id:string,source:Source):Lesson {
  const slot=mathCourseOutline.find((s)=>s.lessonId===id);
  if(!slot) throw new Error(id);
  return lessonSchema.parse({...slot,id,contentVersion:1,resources:[],prerequisiteLinks:[],references:[{title:"OpenStax：向量及其运算",href:"https://openstax.org/books/calculus-volume-3/pages/2-2-vectors-in-three-dimensions",note:"核对向量相等、分量运算与数乘；本课采用平面配送例子，文字、图和练习独立编写。"}],...source});
}
export const summary = (points:string[],next:{title:string;href:string;note:string}):ContentBlock[] => [{type:"summary",points},{type:"reading-links",title:"下一步",links:[next]}];
