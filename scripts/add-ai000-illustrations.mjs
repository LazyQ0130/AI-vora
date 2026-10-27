import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

// 按已审核的section/区块位置接入；不改写旧内容，也不依靠格式化重排全文。
const { entries } = JSON.parse(await readFile('docs/ai000-4-4/GENERATION_RECORDS.json', 'utf8'));
for (const entry of entries) {
  if (entry.lessonId === 'AI000-C04-L04') continue;
  const file = 'src/content/lessons/ai000/' + entry.file;
  let source = await readFile(file, 'utf8');
  if (source.includes(`illustration("${entry.lessonId}")`)) continue;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  let blocks;
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const property = name => node.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText(tree).replaceAll('"', '') === name);
      if (property('id')?.initializer.text === entry.section) blocks = property('blocks')?.initializer;
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  if (!blocks || !ts.isArrayLiteralExpression(blocks) || !blocks.elements[entry.index]) throw new Error(file + ': missing planned block position');
  const position = blocks.elements[entry.index].getStart(tree);
  const indent = source.slice(source.lastIndexOf('\n', position) + 1, position);
  if (!/^\s*$/.test(indent)) throw new Error(file + ': expected block on its own line');
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  source = `import { illustration } from "./illustrations";${newline}` + source.slice(0, position) + `illustration("${entry.lessonId}"),${newline}${indent}` + source.slice(position);
  await writeFile(file, source);
  console.log(entry.lessonId + ' → ' + entry.section + '[' + entry.index + ']');
}
