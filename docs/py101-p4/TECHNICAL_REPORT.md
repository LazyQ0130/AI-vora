# PY101 1.5技术验收

2026-10-29。基线8f3fd1f814651828c548b8875a2121c4dda1328f；新课PY101-C01-L05/r1，整门PY101仍planned。最先保存DRAFT_GATE.json，实际draft/private注册而不可读；BUILD_DRAFT.txt为78页生产草稿构建，ROUTES_DRAFT.txt及draft/TEACHING_V2_3_ROUTE_RESULTS.json为104/104HTTP，L05仍404；TESTS_DRAFT.txt为308/308。保存真实技术证据后转pending-review/preview，未填reviewEvidence。

已实际通过类型、Lint，62个网页Python块（Notebook显示格带明确前格上下文，其他旧块不变）、10组核心/完整版对照、既有Python单元测试；prepare:downloads保留16组旧资源字节，另生成2份同源Notebook，4.5格式、唯一cell id、空输出/null计数、无本机路径/token或固定机器版本。独立真实内核最终40步和GUI全过程见JUPYTER_VALIDATION.md；macOS未实测。review:teaching输出52节技术结构矩阵，不算专业教学审稿；未用特定范围review:editing声称PY101全量审核。

最终成稿：TESTS.txt为原工作区308/308；TYPECHECK.txt、LINT.txt通过；BUILD.txt为Next.js16.4.3生产构建79页。最终服务127.0.0.1:3005，ROUTES.txt及TEACHING_V2_3_ROUTE_RESULTS.json为104/104实际HTTP。浏览器四档、两平台真实复制粘贴、两份真实下载、提示/答案/rubric、Quiz、导航、404、进度保存重载与隔离均取证，详见BROWSER_REPORT.md。320px初测长下载标签把文档撑到337px，仅将本节新资源按钮改为文件名、用途留描述后重构建，最终305px；没有更改共享CSS或缩小整页。目标复核补充第二题旧状态短观察和重开要求后，重新跑全套308、类型/Lint、40步内核及生产构建，再看最终页面和答案。

提交树独立核验：按明确允许列表暂存，在全新临时目录git checkout-index导出，链接现有node_modules；CLEAN_TESTS.txt为307/307。导出不带用户四份未提交修改，少1项来自用户原有tests/reading-experience.test.ts，与原工作区308项区别明确。此步骤只声明Node全套测试，不冒称干净树另做生产GUI或Jupyter安装。随后只补报告/日志留证，实际代码与所验暂存树一致。检查没有.venv、机器配置、Jupyter缓存/连接文件/token进入索引；公开证据做路径及令牌扫描。

复用现有Lesson/发布/目录/进度/Reader，没有新Schema或站内执行器。现有prepare-downloads只追加Notebook文档写入，原programs生成逻辑不动；资源与网页共用python-notebook.ts。validate-python对L05逐块校验同源身份与明确前置源码，不以独立运行print(name)造成误报；未知单元格立即失败，不静默排除预期错误。真正重启/旧状态/NameError由真实内核专项与GUI分开证明。

历史兼容仍用P1登记器按新到旧撤销精确批准修订；P3审计入口增加本轮参数复用，不复制另一套兼容层。P3单测的新增课集合与规划检查改为动态规则，保留旧对象/文件哈希循环和未授权文本拒绝。当前P4严格审计使用AIVORA_AUDIT_ROUND=py101-p4，对51份旧Lesson、2624份原跟踪文件及7份原未跟踪文件做基线核对。1.4只改最后过渡段，r1和考核/锚点不变，详情见TRANSITION_AMENDMENT.md。用户四份修改须逐字节保持，不暂存；原附件不删。

失败与限制：类型测试属性访问已修复；独立内核驱动重启后通信超时已修复并重跑；Ctrl+C自动化宿主退出码1不冒称Jupyter返回0，补验GUI正常停服、终端0及无残留；公开日志统一脱敏。详细过程见NOTEBOOK_DRIVER_REPAIR.md。所有自动技术、真实内核、真实Jupyter GUI、macOS文档、同一AI另轮复核、人类审稿/试学证据分别登记，不能互相替代。

复现入口：AIVORA_AUDIT_ROUND=py101-p4运行npx tsx scripts/audit-py101-p3.ts；AIVORA_NOTEBOOK_PYTHON与AIVORA_NOTEBOOK_LAB明确指向新练习环境，再运行npx tsx scripts/validate-py101-notebook.ts。Notebook验证器只使用已安装环境，不自行安装或操作用户旧环境。常规脚本通过AIVORA_EVIDENCE_DIR=docs/py101-p4留本轮证据，历史P0–P3不覆盖。
