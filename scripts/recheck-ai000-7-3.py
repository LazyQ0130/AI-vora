"""从通知原文和固定题材料重新核查，不用参考解答作计算器。"""
import json
import re
from datetime import datetime, date
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "docs/ai000-7-3"
notices = json.loads((root / "NOTICE_INPUTS.json").read_text(encoding="utf-8"))
lesson = json.loads((root / "LESSON.json").read_text(encoding="utf-8"))
by_id = {n["id"]: n for n in notices}
stamp = lambda text: datetime.strptime(re.search(r"2026年\d+月\d+日\d+:\d+", text).group(), "%Y年%m月%d日%H:%M")
original = stamp(by_id["N1"]["text"])
updated = stamp(by_id["N3"]["text"])
other = stamp(by_id["N2"]["text"])
deadline = re.search(r"需在(11月\d+日\d+:\d+)前", by_id["N1"]["text"]).group(1)
assert (original.day, updated.day, updated.hour, other.day, other.hour) == (12, 13, 14, 14, 19)
assert deadline == "11月10日18:00" and "其他报名要求不变" in by_id["N3"]["text"]
assert by_id["N1"]["event"] == by_id["N3"]["event"] != by_id["N2"]["event"]
assert len(set(n["event"] for n in notices)) == 2
assert all(date(2026, 11, 12) <= d.date() <= date(2026, 11, 14) for d in (updated, other))
old_place = re.search(r"在(综合楼.*?)举行", by_id["N1"]["text"]).group(1)
new_place = re.search(r"地点为([^。]+)", by_id["N3"]["text"]).group(1)
assert old_place == "综合楼报告厅" and new_place == "科技楼一楼报告厅"
assert "未说明是否需报名及报名方式" in by_id["N2"]["text"]
output = next(b["rows"] for s in lesson["sections"] if s["id"] == "capstone-example-analysis" for b in s["blocks"] if b["type"] == "table")
assert len(output) == 2
assert all(x in output[0][1] for x in ("11月13日14:00", new_place, deadline, "入口待核"))
assert all(x in output[1][1] for x in ("11月14日19:00", "教学楼B201", "报名及方式待核"))
questions = json.loads((root / "QUESTIONS_ONLY.json").read_text(encoding="utf-8"))
slots = next(b["rows"] for b in questions[0]["given"] if b["type"] == "table")
assert [r[0] for r in slots] == ["S1", "S2", "S3"]
assert "标为空闲" in slots[0][1] and "已占用" in slots[1][1] and "未给状态" in slots[2][1]
result = {"method": "Python标准库从通知原文提取日期/地点，按明确的同活动更新关系独立核对；从固定题表重新查状态", "noticeCount": len(notices), "currentEventCount": len(output), "E1Original": original.isoformat(), "E1Current": updated.isoformat(), "E1Place": new_place, "E1DeadlineRetained": deadline, "E2Current": other.isoformat(), "E2Registration": "未知", "slots": {"S1": "空闲快照", "S2": "占用快照", "S3": "未知"}, "reservationConfirmed": "未知", "limits": "教学构造范围；无网页访问、接口、真实预约或模型执行证据；定性另轮解见RECHECK.md"}
(root / "INDEPENDENT_RECHECK.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Notices, update scope, two current events and three slot evidence states verified")
