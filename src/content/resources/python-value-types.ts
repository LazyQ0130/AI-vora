// P9原创短例：正文、参考路径和作者运行共用源码；独立预期在validate-py101-value-types.ts。
const assignments = 'item_count = 3\ncount_text = "3"\nitem_mass = 1.5\nis_ready = True';
const valuePrints = 'print(item_count)\nprint(count_text)\nprint(item_mass)\nprint(is_ready)';
const typePrints = 'print(type(item_count))\nprint(type(count_text))\nprint(type(item_mass))\nprint(type(is_ready))';
export const valueTypeCode = {
  sameDisplay: 'item_count = 3\ncount_text = "3"\nprint(item_count)\nprint(count_text)',
  measurement: 'item_mass = 1.5\nprint(item_mass)',
  booleanValues: 'is_ready = True\nready_text = "True"\nis_waiting = False\nprint(is_ready)\nprint(ready_text)\nprint(is_waiting)',
  firstType: "print(type(item_count))",
  pairTypes: 'item_count = 3\ncount_text = "3"\nprint(type(item_count))\nprint(type(count_text))',
  booleanTypes: 'print(type(is_ready))\nprint(type(ready_text))\nprint(type(is_waiting))',
  main: [assignments, valuePrints, typePrints].join("\n\n"),
  rebind: 'batch_count = 8\nprint(batch_count)\nprint(type(batch_count))\n\nbatch_count = "8"\nprint(batch_count)\nprint(type(batch_count))',
  ownFour: 'kit_label = "Sketch kit"\npencil_count = 6\npencil_length_cm = 17.5\nis_packed = False\nprint(kit_label)\nprint(pencil_count)\nprint(pencil_length_cm)\nprint(is_packed)\nprint(type(kit_label))\nprint(type(pencil_count))\nprint(type(pencil_length_cm))\nprint(type(is_packed))',
  ownRebind: 'crate_total = 12\nprint(crate_total)\nprint(type(crate_total))\ncrate_total = "12"\nprint(crate_total)\nprint(type(crate_total))',
  ownChanged: 'crate_total = 27\nprint(crate_total)\nprint(type(crate_total))\ncrate_total = "27"\nprint(crate_total)\nprint(type(crate_total))',
} as const;
export type ValueTypeKey = keyof typeof valueTypeCode;
export const valueTypeBlockNames: Record<ValueTypeKey, string> = {
  sameDisplay: "same_display.py",
  measurement: "measurement.py",
  booleanValues: "ready_state.py",
  firstType: "类型观察片段 · 接在item_count赋值之后",
  pairTypes: "inspect_pair.py",
  booleanTypes: "类型观察片段 · 接在ready_state.py的赋值之后",
  main: "four_values.py",
  rebind: "changing_type.py",
  ownFour: "drawing_kit.py · 参考路径",
  ownRebind: "crate_types.py · 参考初稿",
  ownChanged: "crate_types.py · 参考修改稿",
};
export const valueTypeSetups: Partial<Record<ValueTypeKey, string>> = {
  firstType: valueTypeCode.sameDisplay.split("\n")[0],
  booleanTypes: valueTypeCode.booleanValues.split("\n").slice(0, 3).join("\n"),
};
