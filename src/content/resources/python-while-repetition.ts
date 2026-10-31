// P19原创有限示例；正文、参考与作者实跑共享源码。危险漏更新只作纸面分析。
const main = 'packed = 0\ntarget = 3\n\nwhile packed < target:\n    packed = packed + 1\n    print(packed)\n\nprint("Packing finished")';
const newStart = main.replace('packed = 0', 'packed = 2').replace('target = 3', 'target = 5');
export const whileCode = {
  once: main.replace('while packed < target:', 'if packed < target:'),
  main,
  zero: main.replace('packed = 0', 'packed = 3'),
  newStart,
  beforePrint: main.replace('    packed = packed + 1\n    print(packed)', '    print(packed)\n    packed = packed + 1'),
  fault: main.replace('packed + 1', 'packed + 2'),
  fixed: newStart,
  own: 'labels_done = 2\nlabel_goal = 6\n\nwhile labels_done < label_goal:\n    labels_done = labels_done + 1\n    print(labels_done)\n\nprint("Label check finished")',
} as const;
export type WhileKey = keyof typeof whileCode;
export const whileBlockNames: Record<WhileKey, string> = {
  once: 'one_item.py', main: 'packing_loop.py', zero: 'packing_zero.py', newStart: 'packing_new_start.py',
  beforePrint: 'before_update.py', fault: 'repair_increment.py · 修复前',
  fixed: 'repair_increment.py · 修复后的新数据参考', own: 'label_counter.py · 题一参考',
};
// Static/纸面检查专用，绝不属于whileCode可执行白名单，也不作为网页Python块。
export const missingUpdateForPaper = 'packed = 0\ntarget = 3\n\nwhile packed < target:\n    print(packed)';
