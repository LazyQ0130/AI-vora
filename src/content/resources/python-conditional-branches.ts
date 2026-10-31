import { conditionalCode } from "./python-conditional-execution";

// P17正文、折叠参考与作者运行同源；独立预期见validate-py101-branches.ts。
const threeWay = 'count = 6\nlimit = 6\n\nif count < limit:\n    print("Room left")\nelif count == limit:\n    print("At limit")\nelse:\n    print("Over limit")\n\nprint("Check finished")';
const overlap = 'count = 6\nlimit = 6\n\nif count <= limit:\n    print("Within limit")\nelif count == limit:\n    print("At limit")\nelse:\n    print("Over limit")';
export const branchCode = {
  previous: conditionalCode.main,
  twoWay: 'count = 5\nlimit = 6\n\nif count <= limit:\n    print("Within limit")\nelse:\n    print("Over limit")\n\nprint("Check finished")',
  threeWay,
  overlap,
  orderRepair: overlap.replace("count <= limit", "count < limit"),
  independent: 'count = 6\nlimit = 6\n\nif count <= limit:\n    print("Within limit")\n\nif count == limit:\n    print("At limit")\n\nprint("Check finished")',
  fault: 'kits = 10\nshelf_limit = 10\n\nif kits <= shelf_limit:\n    print("Within shelf limit")\n\nif kits == shelf_limit:\n    print("At shelf limit")\n\nprint("Shelf check finished")',
  fixed: 'kits = 10\nshelf_limit = 10\n\nif kits < shelf_limit:\n    print("Below shelf limit")\nelif kits == shelf_limit:\n    print("At shelf limit")\nelse:\n    print("Over shelf limit")\n\nprint("Shelf check finished")',
  ownTwo: 'people = 11\nseats = 14\n\nif people <= seats:\n    print("Enough seats")\nelse:\n    print("Not enough seats")\n\nprint("Seat check finished")',
  ownThree: 'people = 11\nseats = 14\n\nif people < seats:\n    print("Spare seats")\nelif people == seats:\n    print("All seats taken")\nelse:\n    print("Need more seats")\n\nprint("Seat check finished")',
} as const;
export type BranchKey = keyof typeof branchCode;
export const branchBlockNames: Record<BranchKey, string> = {
  previous: "previous_if.py",
  twoWay: "two_way_check.py",
  threeWay: "three_way_check.py",
  overlap: "overlap_choice.py · 重叠观察",
  orderRepair: "overlap_choice.py · 只改第一项后",
  independent: "independent_checks.py",
  fault: "repair_choice.py · 修复前",
  fixed: "repair_choice.py · 三档修复参考",
  ownTwo: "seat_check.py · 题一两路参考",
  ownThree: "seat_check.py · 题一三档参考",
};
