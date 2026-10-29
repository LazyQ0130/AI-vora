# PY101-P3交付与P4交接

2026-10-29。实际fetch后的起点HEAD与origin/main均为b70eaab04b6be1f058a8c04ad59af17c7d790648。仅新增正式Lesson PY101-C01-L04「为项目准备独立的虚拟环境」，contentVersion1、order4、基础必学。最终提交身份由包含本报告的Git提交确定；推送及远端SHA另在最终交付回复中核实，避免在报告内编造自引用提交号。

## 教学成稿

3个目标分别为创建两个项目环境、用指定解释器运行并取得实际身份、发现环境错配并安全修复；assessmentMap对应create-project-envs（目标1/2）与repair-wrong-env（目标3），不是Quiz。10节内文沿两个项目需求→基础安装与环境→创建→直接调用→只读诊断→激活→编辑器→恢复→保留源码→新题展开。

主例为python-projects/project-a与project-b，各含main.py、observe_env.py和.venv。源码只用print；现成sys观察工具不作为import/变量/函数先修考核。第一次教授venv及环境身份，不重讲1.3保存/工作区。新题在自选新位置创建两个环境；故障题使用workshop/report/check.py与workshop/tools/label/tag.py不同布局，控制保存、脚本和基础版本，只改变解释器。两题均有两级提示、解释性答案、常错、替代方案、rubric，要求真实命令/诊断/复跑证据。

learningTime为阅读14–18、练习6–10、代码实践20–30分钟，合40–58，basis=editorial-estimate。超出蓝图30–50上限是两个新环境、诊断及修复证据增加的操作负担；安装、权限和异常恢复另计，待目标试学校准。

## 实证与工程范围

|证据类别|本轮结果与边界|
|---|---|
|自动技术|最终typecheck、lint通过；原工作区Node302/302；干净暂存树导出Node301/301，差1项为用户原有未提交阅读器测试。生产构建78页、HTTP104/104；16组旧下载同源生成且原文件未变；56个网页Python块、10组核心题对照、51节技术矩阵；专项20/20|
|Python/Shell|Windows10.0.26300.9711、CPython3.14.2、PowerShell7.6.5；四个新项目环境，28条真实命令/断言。主例、陌生练习、错误环境/恢复、激活/deactivate、只cd不换环境、独立新shell、忽略规则均取证。公开日志替换真实工作区/用户前缀|
|VS Code GUI|实际A/B项目发现、选择、官方运行；B切到基础Python后诊断prefix==base，再选回B环境复跑。现有A扩展自动策略尝试因5.1模块失败；未手工改策略，B仅新工作区用cmd。GUI与shell证据分别保存，未伪称GUI退出码或完整5.1手动流程|
|macOS|官方文档核验，尚未macOS实测|
|真实浏览器|本轮3004生产服务，1440/768/390/320四宽；实际复制粘贴、提示/答案/rubric、Quiz、锚点、相邻导航、已读重载隔离、筹备/404。修复答案长路径撑宽后重构建复查；细节见BROWSER_REPORT.md|
|AI辅助复核|先编辑简报、事实、预解，成稿另轮重算/审读；不是专业真人审核|
|真人教学证据|Python教师、中文教学编辑审核及真实零基础试学均未开展，责任角色/所需证据见EDITORIAL_RECHECK.md|

源码范围：新课与python-venv同源资源、engine/Publication接入；root .gitignore新增.venv/；既有Python验证器加新块检查；沿用P1兼容登记器登记P3授权变化；相关旧测试按可读性/动态新增课修正，而非删去历史保护；新6项专项测试与真实Windows环境验证脚本；现有答案列表只加长文本换行CSS。没有新增Schema、播放/运行系统、依赖、下载机制或装饰图。

1.3仅最后状态过渡段由“1.4尚规划”勘误为待审核试读。前后逐段、对象摘要、版本决定见TRANSITION_AMENDMENT.json/md；目标、题目/答案/锚点与r1进度均不变。1.2已登记的旧状态句仍保留，本轮不全面重写。其他旧Lesson、AI000 R3、MA101、第五章、下载及历史报告均受原摘要保护。

工作区审计覆盖50份旧Lesson、2564个原跟踪文件。用户原有next-env.d.ts、scripts/ai000-r3-compatibility.ts、src/components/lesson/reader.tsx、tests/reading-experience.test.ts保持原始字节且未暂存；既有未跟踪附件未删除/提交。构建生成的next-env变化按原始指纹恢复。四个.venv、机器截图/配置、临时导出路径未进入暂存树；没有删除、stash、reset-hard或强推。

## 发布与人工欠账

先完成draft/private不可读门禁及真实草稿构建/HTTP证据，再转pending-review/preview。当前新课r1待人工审核试读；PY101仍planned，10章/26–36小时/原先修/命令行数据清洗与统计小工具项目不变；1.5、1.6无Lesson且无试读路由；AI000及第五章没有自动升级发布。

人工审核应绑定实际修订：Python教师检查定义/路径/各shell安全恢复；中文教学编辑检查基础安装—项目—环境层级、只读诊断负担与新题迁移；符合1.1–1.3能力且未学venv的目标学生独立做两题，记录创建、身份判断、同版本误判、激活误解、提示使用、补讲及分项耗时。无虚构教师签署、学生结果或完成率。试学后校准40–58分钟并决定修订和发布；现在不进入reviewed/pilot/published。

## 进入P4之前

先确认学生能独立创建/定位项目环境、直接调用其解释器、从executable/prefix/base_prefix辨别错配并真正复跑。P4/1.5首次教授Jupyter安装、内核及单元格执行顺序，不能把它们当作已学；本轮未提前制作。依赖管理与环境复现仍属后续1.6边界。

遗留事实：macOS未实测，5.1安全模块故障未深查，GUI现有扩展的自动激活行为随版本/配置变化；1.2旧状态句待单独授权范围处理。以上与人工审稿/试学均如实交接。第5章函数试读仍需变量、表达式、控制流程等基础，新课完成不能替代这些先修。

复核入口：[技术报告](TECHNICAL_REPORT.md)、[浏览器报告](BROWSER_REPORT.md)、[GUI记录](EDITOR_VALIDATION.md)、[辅助编辑复核与人工任务](EDITORIAL_RECHECK.md)、[官方事实](SOURCE_FACTS.md)、[课前简报](EDITORIAL_BRIEF.md)、[预解](PRE_SOLUTIONS.md)。
