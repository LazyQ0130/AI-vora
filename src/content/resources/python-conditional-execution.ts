// P16原创示例；正文、折叠参考与作者实跑共享源码，独立预期在专项验证器。
export const conditionalCode = {
  before: 'count = 5\nlimit = 6\n\nprint(count <= limit)\nprint("Check finished")',
  main: 'count = 5\nlimit = 6\n\nif count <= limit:\n    print("Within limit")\n\nprint("Check finished")',
  twoLines: 'count = 5\nlimit = 6\n\nif count <= limit:\n    print("Within limit")\n    print("Prepare labels")\n\nprint("Check finished")',
  movedLine: 'count = 7\nlimit = 6\n\nif count <= limit:\n    print("Within limit")\nprint("Prepare labels")\n\nprint("Check finished")',
  broken: 'packed = 8\ncapacity = 6\n\nif packed <= capacity:\n    print("Checking batch")\nprint("Pack allowed")\n\nprint("Check finished")',
  repaired: 'packed = 8\ncapacity = 6\n\nif packed <= capacity:\n    print("Checking batch")\n    print("Pack allowed")\n\nprint("Check finished")',
  own: 'books = 9\nshelf_capacity = 12\n\nif books <= shelf_capacity:\n    print("Books fit")\n\nprint("Shelf check finished")',
} as const;
export type ConditionalKey = keyof typeof conditionalCode;
export const conditionalBlockNames: Record<ConditionalKey, string> = {
  before: "before_if.py",
  main: "quantity_check.py",
  twoLines: "two_messages.py",
  movedLine: "moved_message.py",
  broken: "repair_if.py · 修复前",
  repaired: "repair_if.py · 修复参考",
  own: "shelf_check.py · 题一参考",
};
