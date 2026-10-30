// P8原创短例；正文、练习参考与作者验证共用源码。独立预期在scripts/python-variable-checks.ts。
const assign = 'task_name = "Pack notebooks"';
const read = "print(task_name)";
const update = 'task_name = "Check labels"';
export const variableCode = {
  assign,
  read,
  update,
  main: [assign, read, update, read].join("\n"),
  changedMain: [assign, read, 'task_name = "Sort envelopes"', read].join("\n"),
  literal: 'task_name = "Ready"\nprint("task_name")\nprint(task_name)',
  firstRead: 'print(dispatch_label)\ndispatch_label = "Packed T7"',
  repaired: 'dispatch_label = "Packed T7"\nprint(dispatch_label)',
  ownInitial: 'display_note = "Hang posters"\nprint(display_note)\ndisplay_note = "Place signs"\nprint(display_note)',
  ownChanged: 'display_note = "Hang posters"\nprint(display_note)\ndisplay_note = "Open doors"\nprint(display_note)',
} as const;
export type VariableCodeKey = keyof typeof variableCode;
export const variableBlockNames: Record<VariableCodeKey, string> = {
  assign: "赋值片段 · 稍后组合",
  read: "读取片段 · 接在首次赋值之后",
  update: "更新片段 · 接在首次读取之后",
  main: "task_labels.py",
  changedMain: "task_labels.py · 只改第二次赋值后",
  literal: "name_or_text.py",
  firstRead: "dispatch_label.py · 预期出现NameError",
  repaired: "repair_label.py · 修复参考",
  ownInitial: "gallery_plan.py · 参考初稿",
  ownChanged: "gallery_plan.py · 参考修改稿",
};
