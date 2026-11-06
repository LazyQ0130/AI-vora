# P20交付：Reader修复与3.4试读解锁

2026-11-06。最终生产矩阵通过已知P1及普通滚轮回归，允许PY101-C03-L04/r1为pending-review/preview。整课仍planned，无新课/正文/版本/section变更，无人工审核通过结论。

1. 起点d50d2a48b4919d6b387646982f5163ee276c8a7d。原4份修改、7份未跟踪内容重新指纹；原3355份跟踪文件与7份未跟踪文件均保留原字节。
2. 未改逻辑的生产Reader三次复现short-circuit→错误入口，另一次诊断取得真实localStorage覆盖证据，不用普通reload成功掩盖SPA失败。
3. 根因为UI几何/latest与阅读书签未区分，旧清理在课程URL下flush过渡section；不推断未观测的上游内部滚动回调。
4. 最小运行时改动为Reader及一个小会话辅助器：只接收合法阅读输入滚动点或明确锚点，离开提交已接受点，取消过期保存、保证幂等与scope独立。存储模块/合并规则不改。
5. 首版另发现真实滚轮失败并保留；最终版同步接收scroll点，视觉继续rAF，三项新红测转绿，同一输入已成功重验。
6. 最终3.3原路径连续3次、3.4连续3次均稳定保存→SPA课程→返回→reload保持；另两段、快速离开、reduced-motion、前进/后退、跨课、直接hash、完整文档、手机Drawer与焦点通过。
7. 实际浏览器存储诊断与Node夹具明确分开；83旧修订/v1夹具字符串不变，真实UI旧3.2仍已读完，新3.4未继承完成。没有清/迁/重置记录。
8. 最终typecheck、零警告候选Lint、417单测、26专项、下载16组/3Notebook、Python160例/10组、教学63课、Webpack90页、114全局HTTP及10专项通过。原工作区一既有Lint警告和Turbopack联接根失败均留证。
9. 3.4两道练习原样；两份真实网页Copy落盘并Python运行通过，6个网页Python块同源。四宽截图实际查看，最终preview实际200，错误归属和3.5–3.8仍404。
10. 63旧Lesson/Scope及62其他Publication摘要保持，P19 draft/private和全部P0–P19历史证据不改。未知源码/对象变化不获兼容豁免。
11. P1在本次固定生产矩阵关闭；macOS、实体触屏、教师/中文编辑、目标学生试学仍待办，3.4最多pending-review/preview。
12. 修复在独立干净codex/p20-reader提交并正常推送远端main；单个原子提交绑定Reader、精确登记和通过门禁的Publication。原本地main继续d50d2a4，含用户Reader的原检出与3000服务保持；不以覆盖制造三端一致。最终完整SHA以本报告所在提交和最终对话远端核验为准。
13. 远端修复/解锁安全推送后可在下一轮正式制作3.5；使用保留的隔离修复树或先按VERSION_AND_COMPATIBILITY安全整合原开发检出。3.5教学仍从P19简报另行启动，本轮没有开始正文。

READER_FIX.patch为独立运行时补丁。原用户diff只读git apply --check通过，用户自定义整文件SHA测试在组合稿中仍需重新审查登记；原文件不自动应用、不提交。全部证据见TECHNICAL_REPORT、BROWSER_REPORT、ROOT_CAUSE_ANALYSIS、READER_REPRO_BEFORE/AFTER、READER_PROGRESS_REGRESSION与PUBLICATION_GATE_DECISION。
