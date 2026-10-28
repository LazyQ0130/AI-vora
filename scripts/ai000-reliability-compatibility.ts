import { readFileSync } from "node:fs";
import { beforePrivacySource } from "./ai000-privacy-compatibility";

// 仅逆转本轮带上下文且唯一命中的注册/发布/学时/新题样式片段。
// 其余原文、空白或额外源码仍由全文件摘要校验；不忽略整个文件。
const changes = JSON.parse(readFileSync(new URL("../docs/ai000-6-1/SOURCE_CHANGES.json", import.meta.url), "utf8")) as {
  sources: {path:string;changes:{before:string;after:string}[]}[];
};
export function beforeReliabilitySource(path:string, source:string) {
  source=beforePrivacySource(path,source);
  const entry=changes.sources.find(s=>s.path===path);
  if(!entry)return source;
  let text=source.replaceAll("\r\n","\n");
  for(const edit of entry.changes) if(text.split(edit.after).length===2) text=text.replace(edit.after,edit.before);
  return text;
}
