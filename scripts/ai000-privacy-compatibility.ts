import { readFileSync } from "node:fs";
import { beforeResponsibleSource } from "./ai000-responsible-compatibility";

// 仅逆转6.2注册/清单/学时/新题样式的已登记且唯一匹配片段。
// 原教材、图示与任何额外源码仍须命中完整旧摘要。
const changes = JSON.parse(readFileSync(new URL("../docs/ai000-6-2/SOURCE_CHANGES.json",import.meta.url),"utf8")) as {
  sources:{path:string;changes:{before:string;after:string}[]}[];
};
export function beforePrivacySource(path:string,source:string) {
  source=beforeResponsibleSource(path,source);
  const entry=changes.sources.find(s=>s.path===path);
  if(!entry)return source;
  let text=source.replaceAll("\r\n","\n");
  for(const edit of entry.changes)if(text.split(edit.after).length===2)text=text.replace(edit.after,edit.before);
  return text;
}
