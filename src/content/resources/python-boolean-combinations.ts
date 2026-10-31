// P18原创示例；正文、折叠参考与真实文件验证共用源码，预期独立登记。
const values = 'count = 5\nminimum = 3\nstock = 6';
const named = values + '\n\nenough = count >= minimum\nwithin_stock = count <= stock';
const main = values + '\n\nif (count >= minimum) and (count <= stock):\n    print("Quantity ready")\n\nprint("Check finished")';
export const booleanCode = {
  named: named + '\n\nprint(enough)\nprint(within_stock)',
  andResult: named + '\nquantity_ready = enough and within_stock\n\nprint(quantity_ready)',
  andIf: named + '\nquantity_ready = enough and within_stock\n\nif quantity_ready:\n    print("Quantity ready")\n\nprint("Check finished")',
  main,
  review: 'count = 2\nminimum = 3\nstock = 6\n\ntoo_few = count < minimum\ntoo_many = count > stock\nneeds_review = too_few or too_many\n\nprint(needs_review)',
  notValue: 'quantity_ready = True\nprint(not quantity_ready)',
  notRange: 'count = 2\nminimum = 3\nstock = 6\n\nquantity_ready = (count >= minimum) and (count <= stock)\n\nprint(quantity_ready)\nprint(not quantity_ready)',
  notComparison: 'count = 2\nminimum = 3\n\nprint(not (count >= minimum))',
  fault: main.replace('count = 5', 'count = 2').replace(') and (', ') or ('),
  fixed: main.replace('count = 5', 'count = 2'),
  own: 'books = 6\nminimum_books = 4\navailable_books = 9\n\nenough_books = books >= minimum_books\nwithin_available = books <= available_books\nready = enough_books and within_available\nneeds_check = (books < minimum_books) or (books > available_books)\n\nprint(enough_books)\nprint(within_available)\nprint(ready)\nprint(needs_check)\nprint(not ready)\n\nif ready:\n    print("Book batch ready")\n\nprint("Book check finished")',
} as const;
export type BooleanKey = keyof typeof booleanCode;
export const booleanBlockNames: Record<BooleanKey, string> = {
  named: 'quantity_parts.py', andResult: 'combined_result.py', andIf: 'saved_condition.py', main: 'quantity_range.py',
  review: 'needs_review.py', notValue: 'reverse_bool.py', notRange: 'reverse_ready.py', notComparison: 'below_minimum.py',
  fault: 'repair_connector.py · 修复前', fixed: 'repair_connector.py · 一词修复参考', own: 'book_range.py · 题一参考',
};
