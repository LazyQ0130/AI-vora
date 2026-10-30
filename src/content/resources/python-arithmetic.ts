// P10原创数量关系：正文、参考路径与真实作者验证共用源码；独立预期在专项验证器。
const baseValues = "box_count = 4\nper_box = 3\nspare = 4";
const totalSetup = baseValues + "\ntotal = box_count * per_box + spare";
const main = totalSetup + "\n\nprint(total)\nprint((box_count + spare) * per_box)\nprint(total / box_count)";
const revise = totalSetup + "\nremaining = total - 2\naverage = total / box_count\nprint(total)\nprint(remaining)\nprint(average)";
const ownCalculate = "bag_count = 5\nper_bag = 6\nloose = 3\ntaken = 4\ntotal_cords = bag_count * per_bag + loose\nremaining_cords = total_cords - taken\nprint(total_cords)\nprint(remaining_cords)";
const ownGrouping = "tube_count = 3\nper_tube = 5\nloose_sheets = 6\ntotal_sheets = tube_count * per_tube + loose_sheets\nprint(total_sheets)\nprint((tube_count + loose_sheets) * per_tube)\nprint(total_sheets / tube_count)";
export const arithmeticCode = {
  multiply: "box_count = 4\nper_box = 3\nprint(box_count * per_box)",
  total: totalSetup + "\nprint(total)",
  subtract: "remaining = total - 2\nprint(remaining)",
  precedence: baseValues + "\nprint(box_count * per_box + spare)\nprint(spare + box_count * per_box)",
  grouping: "print((box_count + spare) * per_box)",
  moreBoxes: "box_count = 4\nadded_boxes = 4\nper_box = 3\nprint((box_count + added_boxes) * per_box)",
  division: "average = total / box_count\nprint(average)\nprint(type(average))",
  nonIntegral: "volume_l = 7\ncontainer_count = 2\nprint(volume_l / container_count)",
  leftGrouping: "print(12 / 3 * 2)\nprint(12 / (3 * 2))\nprint(10 - 3 + 2)\nprint(10 - (3 + 2))",
  main,
  revise,
  changedMain: main.replace("per_box = 3", "per_box = 5"),
  changedRevise: revise.replace("per_box = 3", "per_box = 5"),
  zeroDivide: "print(8 / 0)",
  ownCalculate,
  ownChanged: ownCalculate.replace("bag_count = 5", "bag_count = 7"),
  ownGrouping,
  ownRepaired: ownGrouping.replace("print((tube_count + loose_sheets) * per_tube)", "print(tube_count * per_tube + loose_sheets)"),
} as const;
export type ArithmeticKey = keyof typeof arithmeticCode;
export const arithmeticBlockNames: Record<ArithmeticKey, string> = {
  multiply: "boxes.py · 第一轮",
  total: "boxes.py · 完整五行",
  subtract: "追加片段 · boxes.py末尾",
  precedence: "order_boxes.py",
  grouping: "追加片段 · boxes.py末尾的分组对照",
  moreBoxes: "more_boxes.py",
  division: "追加片段 · boxes.py中的平均分配",
  nonIntegral: "share_water.py",
  leftGrouping: "same_level.py",
  main: "box_relations.py",
  revise: "revise_boxes.py",
  changedMain: "box_relations.py · 只改每盒件数",
  changedRevise: "revise_boxes.py · 只改每盒件数",
  zeroDivide: "zero_divisor.py · 预期ZeroDivisionError",
  ownCalculate: "cords.py · 参考初稿",
  ownChanged: "cords.py · 参考修改稿",
  ownGrouping: "paper_grouping.py · 参考初稿",
  ownRepaired: "paper_grouping.py · 参考修复稿",
};
export const arithmeticSetups: Partial<Record<ArithmeticKey, string>> = {
  subtract: totalSetup,
  grouping: baseValues,
  division: totalSetup,
};
