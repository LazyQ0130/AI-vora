"""从已组装教材表格重数，不导入TS分类/汇总函数，也不读取参考解答作预期。"""
import json
from collections import Counter
from pathlib import Path

root = Path(__file__).resolve().parents[1]
evidence = root / "docs/ai000-7-1"
lesson = json.loads((evidence / "LESSON.json").read_text(encoding="utf-8"))


def tables(section_id):
    section = next(s for s in lesson["sections"] if s["id"] == section_id)
    return [b["rows"] for b in section["blocks"] if b["type"] == "table"]


repairs = tables("eight-records")[0]
correct = [r[0] for r in repairs if r[2] == r[3]]
wrong = [r[0] for r in repairs if r[2] != r[3]]
assert correct == ["R01", "R02", "R03", "R05", "R06", "R08"]
assert wrong == ["R04", "R07"]
assert len(correct) / len(repairs) == 0.75
by_class = {
    name: [sum(r[2] == name and r[2] == r[3] for r in repairs),
           sum(r[2] == name for r in repairs)]
    for name in ["照明故障", "漏水故障", "门锁故障"]
}
assert by_class == {"照明故障": [2, 3], "漏水故障": [2, 3], "门锁故障": [2, 2]}

borrow, parcels = tables("projects-task")
seen, tally = set(), Counter()
for row in borrow:
    if row[1] in seen:
        continue
    seen.add(row[1])
    tally[(row[2], row[3])] += 1
assert len(borrow) == 6 and len(seen) == 5
assert tally == {("11月2日", "科普"): 2, ("11月2日", "文学"): 1,
                 ("11月3日", "未登记"): 1, ("11月3日", "科普"): 1}
parcel_results = [(r[0], 4 + 2 * int(r[2]), int(r[4]),
                   abs(4 + 2 * int(r[2]) - int(r[4]))) for r in parcels[:2]]
assert parcel_results == [("A", 4, 4, 0), ("B", 8, 7, 1)]

plan_rows = tables("plan-task")[0]
events = {}
for row in plan_rows:
    if row[1] in events:
        assert row[2:] == events[row[1]][2:]
    events[row[1]] = row
unknown = [r[1] for r in events.values() if r[3] == "尚未确认"]
compared = [r for r in events.values() if r[3] != "尚未确认"]
result = {r[1]: r[3] == r[4] for r in compared}
assert (len(plan_rows), len(events), len(compared), unknown) == (7, 6, 5, ["E24"])
assert result == {"E21": True, "E22": False, "E23": True, "E25": True, "E26": True}
assert sum(result.values()) / len(result) == 0.8
changed = sum(r[3] == ("照明故障" if r[1] == "E23" else r[4]) for r in compared)
assert changed / len(compared) == 0.6

report = {
    "method": "Python stdlib from rendered Lesson tables; no TS helper or solution as oracle",
    "main": {"correct": correct, "wrong": wrong, "total": len(repairs),
             "ratio": len(correct) / len(repairs), "byConfirmedClass": by_class},
    "library": {"raw": len(borrow), "events": len(seen),
                "counts": [{"date": k[0], "category": k[1], "count": v} for k, v in tally.items()]},
    "parcel": parcel_results,
    "plan": {"raw": len(plan_rows), "events": len(events), "comparable": len(compared),
             "unknown": unknown, "eventResults": result, "ratio": 0.8, "changedRatio": 0.6},
}
(evidence / "NUMERIC_RECHECK.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("7.1 independent table recount passed: main 6/8, library 6 rows/5 events, plan 4/5 and changed 3/5")
