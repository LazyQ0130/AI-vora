# 1.2 过时状态句的最小勘误

日期：2026-10-30。改前提交 `5d71fe8b585db695ceb926bfb35211a2104639f0`；精确原文、改文及 Lesson 对象/源码 SHA-256 见 [TRANSITION_AMENDMENT.json](TRANSITION_AMENDMENT.json)。

唯一教材变化位于 `src/content/lessons/py101/script-paths.ts` 的 `next-step` 最后一段：原称“1.3当前仍是规划；阅读器可能跳到现有第5章”，与现行注册事实冲突。现在说明 1.3–1.6 均有待人工审核试读，可按第一章顺序继续，并保留第5章需要变量、表达式、控制流程基础的提醒。

版本决定依据 `COURSE_AUTHORING.md` 的进度/修订规则：这次只纠正可读状态与衔接，没有改变教学结构、正式目标、assessmentMap、练习、提示、答案、rubric 或 section/exercise ID，维持 r1。既有完成记录仍可读取，不迁移、不删除、不冒充能力验证。

发布清单仅将 1.2 的 technicalEvidence 指向本补充证据；P1 技术报告仍支撑原代码/路径实验，本轮兼容检查与连接预检见 [TECHNICAL_PRECHECK.md](TECHNICAL_PRECHECK.md)。状态继续 pending-review/preview，没有 reviewEvidence。

为使历史全文保护继续接受且只接受这一精确变化，在现有兼容登记器的 plans 列表头加入 P6；[APPROVED_CHANGES.json](APPROVED_CHANGES.json) 登记三个必要源码的改前全文和改后摘要，以及一个 Lesson/Publication 对象。没有改写 P0–P5 快照、削弱摘要条件或另建兼容系统。额外未授权变化仍由原测试拒绝。

[COMPATIBILITY.json](COMPATIBILITY.json) 对照改前对象验证：53 份 Lesson/Publication 集合不变，只有 1.2 段落与其技术证据指向变化；六节版本、进度 scope、旧锚点和补修链接相同。内存存储中旧六节完成值继续有效；未操作用户真实浏览器存储。
