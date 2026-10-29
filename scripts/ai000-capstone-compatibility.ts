import { readFileSync } from "node:fs";
import { beforeR3Source } from "./ai000-r3-compatibility";

// 只逆转本轮登记且唯一匹配的完整上下文；额外改动仍交由整文件摘要拒绝。
const changes=JSON.parse(readFileSync(new URL("../docs/ai000-7-3/SOURCE_CHANGES.json",import.meta.url),"utf8")) as {
  sources:{path:string;changes:{before:string;after:string}[]}[];
};
export function beforeCapstoneSource(path:string,source:string) {
  source=beforeR3Source(path,source);
  const entry=changes.sources.find(s=>s.path===path);
  if(!entry)return source;
  let text=source.replaceAll("\r\n","\n");
  for(const edit of entry.changes)if(text.split(edit.after).length===2)text=text.replace(edit.after,edit.before);
  return text;
}
