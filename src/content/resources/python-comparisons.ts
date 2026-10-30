// P11原创短例。正文、参考路径和作者执行共享源码；独立预期见专项验证器。
const values = "count = 5\nlimit = 6";
const boundaryLow = values + "\nprint(count < limit)\nprint(count <= limit)\nprint(count == limit)";
const ownBoundaryLow = "art_total = 9\ndisplay_limit = 10\nprint(art_total < display_limit)\nprint(art_total <= display_limit)\nprint(art_total >= display_limit)";
export const comparisonCode = {
  basic: values + "\nprint(count <= limit)",
  saveResult: "within_limit = count <= limit\nprint(within_limit)",
  equalNot: "print(count == limit)\nprint(count != limit)",
  assignCompare: "count = 5\nprint(count == 6)\ncount = 6\nprint(count == 6)",
  greater: "count = 7\nlimit = 6\nprint(count > limit)\nprint(count >= limit)\nprint(count <= limit)",
  main: values + "\nwithin_limit = count <= limit\n\nprint(within_limit)\nprint(count == limit)\nprint(count != limit)",
  boundaryLow,
  boundaryEqual: boundaryLow.replace("count = 5", "count = 6"),
  boundaryHigh: boundaryLow.replace("count = 5", "count = 7"),
  allAtCapacity: 'count = 6\nlimit = 6\nprint("At capacity")\nprint(count < limit)\nprint(count <= limit)\nprint(count > limit)\nprint(count >= limit)\nprint(count == limit)\nprint(count != limit)',
  ownCompare: "loaded_books = 9\ncart_capacity = 12\nfits_cart = loaded_books <= cart_capacity\nprint(fits_cart)\nprint(loaded_books == cart_capacity)\nprint(loaded_books != cart_capacity)",
  ownBoundaryLow,
  ownBoundaryEqual: ownBoundaryLow.replace("art_total = 9", "art_total = 10"),
  ownBoundaryHigh: ownBoundaryLow.replace("art_total = 9", "art_total = 11"),
} as const;
export type ComparisonKey = keyof typeof comparisonCode;
export const comparisonBlockNames: Record<ComparisonKey, string> = {
  basic: "capacity_check.py · 首次比较",
  saveResult: "追加片段 · capacity_check.py保存结果",
  equalNot: "追加片段 · capacity_check.py相等与不等",
  assignCompare: "assignment_or_comparison.py",
  greater: "above_limit.py",
  main: "capacity_results.py",
  boundaryLow: "boundary_values.py · 低于限制",
  boundaryEqual: "boundary_values.py · 恰好等于",
  boundaryHigh: "boundary_values.py · 高于限制",
  allAtCapacity: "six_comparisons.py",
  ownCompare: "book_cart.py · 参考路径",
  ownBoundaryLow: "display_boundary.py · 参考低于",
  ownBoundaryEqual: "display_boundary.py · 参考等于",
  ownBoundaryHigh: "display_boundary.py · 参考高于",
};
export const comparisonSetups: Partial<Record<ComparisonKey, string>> = { saveResult: values, equalNot: values };
