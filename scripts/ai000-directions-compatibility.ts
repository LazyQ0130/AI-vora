import { readFileSync } from "node:fs";

// 仅逆转7.2登记且唯一匹配的接入/学时/局部样式片段；不忽略整个文件。
const changes=JSON.parse(readFileSync(new URL("../docs/ai000-7-2/SOURCE_CHANGES.json",import.meta.url),"utf8")) as {
  sources:{path:string;changes:{before:string;after:string}[]}[];
};
export function beforeDirectionSource(path:string,source:string) {
  const entry=changes.sources.find(s=>s.path===path);
  if(!entry)return source;
  let text=source.replaceAll("\r\n","\n");
  for(const edit of entry.changes)if(text.split(edit.after).length===2)text=text.replace(edit.after,edit.before);
  return text;
}
