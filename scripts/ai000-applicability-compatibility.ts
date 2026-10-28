import { readFileSync } from "node:fs";

// 只登记新课注册、发布、分项时间和两个新题ID的分段样式；完整before/after须带唯一上下文。
const changes = JSON.parse(readFileSync(new URL("../docs/ai000-5-5/SOURCE_CHANGES.json",import.meta.url),"utf8")) as {
  sources: {path:string;changes:{before:string;after:string}[]}[];
};
export function beforeApplicabilitySource(path:string,source:string) {
  const entry=changes.sources.find(s=>s.path===path);
  if(!entry)return source;
  let text=source.replaceAll("\r\n","\n");
  for(const edit of entry.changes)if(text.split(edit.after).length===2)text=text.replace(edit.after,edit.before);
  return text;
}
