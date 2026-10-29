# L1-PY101-P0交付报告

2026-10-29。只交付第一章六节蓝图和1.1正文，没有生成1.2或后续课时，没有修改第五章正文、版本、下载或原始课程体系。

## 访问与学生成果

本地生产预览：[1.1 从零运行第一个Python程序](http://127.0.0.1:3001/learn/PY101/PY101-C01-L01)；课程目录：[PY101](http://127.0.0.1:3001/courses/PY101)。正式站点使用相同路由，推送不等于已经验证远端部署。Lesson源码：`src/content/lessons/py101/first-run.ts`，稳定ID PY101-C01-L01、r1，pending-review/preview。

学生需要交付自己修改的三行print脚本、运行前预测、实际输出、解释器版本/文件位置/命令，并在空子目录复现找不到文件、恢复到成功运行。目标是学生自己做出这些成果；本轮工具检查通过不代表已有学生完成。

同源起始脚本的实测输出是：

```text
Hello, Aivora!
File: first_run.py
```

正常执行退出0、stderr为空；路径不存在退出2、stdout为空；缺少引号退出1并含SyntaxError；修复后回到预期两行。16项新课执行对照与两项浏览器取得文件的执行证据另存。参考变化B7和中文变化C9仅为开发验收输入，不是学生提交或成绩。

第一章顺序：1.1首次运行 → 1.2解释器与脚本路径 → 1.3编辑器保存重跑 → 1.4虚拟环境 → 1.5 Jupyter → 1.6环境问题复现。每节已会/首次教/首个成果/核心任务/延后知识/项目积累详见CHAPTER_1_BLUEPRINT.md。下节建议制作1.2，先修依据是1.1已经能保存、修改并运行.py，再比较不同目录和路径；本轮不会继续生成。

## 文件与工程接入

- `src/content/lessons/py101/first-run.ts`：完整图文教材，9个自然标题段落、1个Quiz、2道核心开放任务、各两级提示/解答/rubric。
- `src/content/course-outline.ts`：新增第一章6槽；`publication-manifest.ts`只新增1.1，旧PY自动分支限定第5章，规划不误注册；`course-engine.ts`登记新Lesson。无新React页、在线执行、第三方库或模型API。
- `src/content/resources/core-programs.ts`、`programs.ts`：新增firstRunProgram同源片段及资源；`public/downloads/first_run.py`、`.ipynb`由既有prepare:downloads生成。教材只要求.py，不把Notebook作为首课门槛。
- `scripts/validate-python.ts`增加首课独立预期；`validate-py101-p0.ts`复验正常/失败/变化；`review-py101-p0.ts`保存基线和比较旧内容；`register-py101-p0-sources.ts`与`py101-p0-compatibility.ts`登记本轮精确源码差异。旧capstone兼容链只增加这一层，原用户ai000-r3兼容修改不动。
- `tests/py101-first-run.test.ts`覆盖规划不公开、进度隔离、同源及额外源码变更拒绝；必要既有测试更新当前课数、预览入口、分母和本课题型。没有改写历史快照以适配新课。
- 本目录含蓝图、EDITORIAL_BRIEF目标映射、SOURCES官方核验、EDITORIAL_RECHECK、人工待办、BASELINE/COMPATIBILITY/SOURCE_CHANGES、全部命令日志与执行/路由/浏览器JSON、桌面/平板/手机截图。runtime小文件是可重建的测试证据，源头仍为资源模块；没有手工维护第二份教材代码。

## 验收与保护范围

详见TECHNICAL_REPORT.md及CHECK_RESULTS.json：类型、ESLint、286 Node测试、25 Python单元测试、42网页代码块、10组旧核心对照、16项首课执行、同源下载、教学映射、75页生产构建、104 HTTP路径、四种视口与实际交互全部通过。限制是干净Windows/macOS安装、实体设备和编辑器保存UI未实测，专业人工审稿与真实学生试学未开展。

47旧教材与47旧发布对象、30旧下载文件哈希不变；第5章6节r2/r1及旧进度键保留。新课r1用独立进度键。AI000 R3与其历史证据、curriculum的10章/26–36小时/先修/目标/项目全部不变。用户4个原跟踪修改和原未跟踪附件保持；next-env构建自动改写按基线摘要恢复。本轮提交采用显式文件清单，不把用户未完工作纳入提交。

教材编写完成、所列技术验证完成；人工学科/中文教学审核待办；学生学习效果未验证；学时是编辑估计。最终提交SHA及推送结果见本轮最终回复与Git日志。本报告不声称远端已经部署或课程已经正式发布。
