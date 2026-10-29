import { readFileSync } from "node:fs";

// 只逆转7.1本轮登记、唯一匹配的完整上下文，再交由既有历史兼容链检查全文。
// 草稿阶段可用独立清单；最终清单不得覆盖原快照或放过额外变更。
const changes = JSON.parse(readFileSync(new URL("../docs/ai000-7-1/SOURCE_CHANGES.json",import.meta.url),"utf8")) as {
  sources:{path:string;changes:{before:string;after:string}[]}[];
};
export function beforeFoundationsSource(path:string,source:string) {
  const entry=changes.sources.find(s=>s.path===path);
  if(!entry)return source;
  let text=source.replaceAll("\r\n","\n");
  for(const edit of entry.changes)if(text.split(edit.after).length===2)text=text.replace(edit.after,edit.before);
  return text;
}
