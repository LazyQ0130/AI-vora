"""编辑核算：仅从题设表独立查找/比较，不读取参考解答作为预期。"""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
questions = json.loads((root / "docs/ai000-7-2/QUESTIONS_ONLY.json").read_text(encoding="utf-8"))
catalog, photos = [next(b["rows"] for b in q["given"] if b["type"] == "table") for q in questions]
queries = {q: [r[0] for r in catalog if q in r[1]] for q in ("植物", "星空", "海洋")}
assert queries == {"植物": ["L01", "L02", "L04"], "星空": ["L03"], "海洋": []}
assert catalog[0][1] == catalog[1][1] and catalog[0][2] != catalog[1][2]
assert catalog[3][3] == "位置待核"
outcomes = {r[0]: r[2] == r[3] for r in photos}
assert outcomes == {"P11": True, "P12": False, "P13": True, "P14": True}
correct = sum(outcomes.values())
assert correct / len(photos) == 0.75
result = {"method": "Python标准库从QUESTIONS_ONLY题设表重新查找与逐行比较；不执行模型", "queries": queries, "sameTitleDifferentAuthors": [catalog[0], catalog[1]], "unknownLocationPreserved": catalog[3], "photoChecks": outcomes, "correct": correct, "denominator": len(photos), "ratio": correct / len(photos), "limit": "给定假设建议的表内核查，不能验证照片内容或目标位置；定性路线另见RECHECK.md"}
(root / "docs/ai000-7-2/NUMERIC_RECHECK.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(result, ensure_ascii=False))
