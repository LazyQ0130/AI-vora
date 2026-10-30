# P7 技术验证与证据范围

2026-10-30；基线main `e12a19472f677123d5f30c0e76e6f71ea463640d`。本报告支持1.5输入说明精修的技术证据，不是人类审核。旧P4 Notebook教学/GUI、P5过渡与P6先修审核仍按原覆盖使用，本轮不改写其报告。

## 修订与运行验证

- 1.5只在first-cells加入两个段落，无新代码块/下载；objectives、assessmentMap、两道核心题的完整对象、旧块/锚点/代码和进度scope完全不变。REFINEMENT_DIFF及COMPATIBILITY保存精确结果，r1决定见P6_02_REFINEMENT。
- NAME_RUNS：Windows CPython3.14.2的9个真实子进程情景，包括指定两合法/两错误例、下划线/中文合法名、两保留词错误、大小写错读。独立预期全部吻合。
- BLUEPRINT_RUNS：从第二章Markdown读取9段最小主例/反例，另5个恢复/边界/错误输入变体，真实运行全部吻合；含stdin、stdout、退出码与错误类型。只是规划材料预检，不是已注册教材或学生结果。
- 现有诊断、正文Python及三份Notebook源码不变，原下载没有重建；Node既有同源/空输出断言继续运行。

## 原工作区检查

| 命令 | 实际结果 / 范围 |
| --- | --- |
| npm run typecheck | 通过 |
| npm run lint | 全仓ESLint通过 |
| npm test | 315/315；含历史对象/文件保护、额外变更拒绝、六节进度与旧修订 |
| npm run test:python | 通过；68个网页Python块实际执行、10组核心/完整程序一致及现有Python单元测试 |
| npm run review:teaching | 53节现行教材结构矩阵；不是专业审稿，第二章蓝图不混入其数量 |

结构/Python检查均使用本轮证据目录，未写到默认旧报告路径。为控制体积，公开TEACHING_CHECK_SUMMARY保留53节检查数量、1.5目标/核心题结果及完整矩阵摘要；完整生成矩阵与无关数学副产物逐件移至本轮忽略的machine目录保留，没有删除或复制P6大型快照。Python实际运行结果独立留存。详细命令身份及干净候选测试见ENGINEERING.json。

## 真实Aivora页面核查

使用computer-use技能建议的Browser Use接口，真实IAB而非截图模拟。原有3000页刷新后仍显示旧稿；同目录启动3008的尝试被Next现存开发实例门禁拒绝。没有按提示杀掉用户服务、删锁文件或改仓库配置。

随后`git checkout-index`导出到全新仓库外目录，覆盖本轮四个必要源码并复制P7公开证据，通过node_modules联接复用现有依赖。查本机Next16.4.3 `dev --help`后用受支持 `npm run dev -- --webpack --port 3008`独立预览。该导出不含用户四份未提交修改；并非原工作区默认Turbopack生产构建验证。

实际阅读 `/learn/PY101/PY101-C01-L05#first-cells`，核对新增两个段落在原赋值解释之后、实践/新题之前；保留对其他合法写法的明确说明。实际展开create-own-notebook的提示1、提示2、参考解答与自查标准，内容与原题一致，仍要求独立文件/执行，未追加命名格式评分。旧first-cells和exercise锚点可定位，上一节1.4/下一节1.6入口保留，待人工审核提示可见。

证据为BROWSER_RESULTS.json、[新增讲解截图](naming-review.jpg)、[核心题展开截图](exercise-review.jpg)。只做本轮需要的页面检查，响应式组件未改，复用P4/P5历史响应式范围；不冒称重做全站四档、生产路由或实体设备验证。未点击“读完”或清空存储；预览来源的滚动阅读位置可能按既有逻辑正常保存，不声称该来源全部存储逐字未变。收尾中断本轮开发会话的宿主退出1，另核对3008端口关闭、该导出无进程残留，原3000仍监听；不把宿主退出码称为正常生产服务退出0。

## 工程边界与保护

本轮只改1.5文本、该课技术证据引用、现有plans列表和一处P5历史测试的对象恢复入口。没有新增Lesson、Publication、资源、下载、运行时代码或学生端功能；course-outline、course-engine、模型、进度逻辑、curriculum、其他五节、AI000/MA101/第5章及P6包保持本轮改前内容。第二章建议6节仅为文档，目录没有其节级槽位/链接，拟2.1–2.7均不可解析。

不因新增说明重建下载或重复大规模构建/路由截图；本轮没有prepare:downloads、生产build、test:routes或新Notebook GUI实测。P5干净导出Turbopack联接限制、P4 Ctrl+C宿主差异、VS Code自动激活与PowerShell5.1历史问题没有被这些检查消除。macOS实际执行、专业教师/中文编辑、真实零基础试学及学时校准均待开展。

BASELINE记录实际4份用户修改和7项未跟踪文件，后续逐字节核对；临时导出、作者工具、机器路径与环境均不入Git。没有stash/reset-hard/强推、删除或清空进度。
