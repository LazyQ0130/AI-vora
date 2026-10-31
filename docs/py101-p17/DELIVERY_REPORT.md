# PY101-P17 交付报告

2026-10-31，Asia/Shanghai。唯一正式新课3.2已完整生产，证据独立于P16蓝图。起始main与origin/main为`47a8b740d166fe5dcd2241fb2178891872ec5cf8`；完成前重新fetch仍相同。最终提交完整SHA在交付回复和包含本文件的Git历史核对，不预填尚未生成的自身SHA。采用正常main提交/推送，不强推。

三个目标：独立写if/else两条互斥提示并解释真假/块外；写if/elif/else少/等/超分类，三组实跑并解释首个真分支；复现独立if的重复提示，解释并修成范围明确的互斥结构。两道核心开放代码题为choose-one-message、repair-overlapping-choice，分别覆盖1/2及2/3；两级提示、原因、错法和rubric完整，不靠Quiz检验会写。

学生独立成果：自选新容量/名额/库存情境、名称、限制和文字的.py，先两路真/假各运行，再改三档低/等/高各运行；交源码加阶段差异、关键预测/真实结果和短解释。另保存题二重复输出与本人修复源码，低/等/高三轮复验。环境/命令共用一次，不能删print或硬编码答案凑分类。

教学顺序从3.1原单if及7件只显示结束入手，产生另一条提醒需求；先解释else、对齐和互斥，再给两路完整代码。之后提出单列等值需求，先解释elif和顺序，再给三档代码；完成三轮才诊断重叠和独立if。3.1末段原文已经准确，无任何正文勘误或版本变更，仍r1。

实际两路5/6均Within limit、7为Over limit，均接Check finished；三档5/6/7分别Room left、At limit、Over limit，均接结束。首项<=的重叠链在6先显示Within limit，后面==没有求值；只改<才显示At limit。两个独立if在等值分别检查，输出两条数量提示；它们可用于独立事实，唯一分类需明确设计互斥。题二kits8/10/13修后分别Below/At/Over shelf limit，每轮一条分类加结束；仅将第二个if换elif但保留<=仍不是正确修复。

真实Python证据为24个保存文件/独立进程、2次标准库trace执行行核对、另外2份网页Copy取得的源码落盘运行。记录均含源码SHA、cwd/命令、预解、stdout/stderr、退出，普通24轮有不同PID；trace实证未执行后项，不以exit0判业务正确。两份复制文件与注册源码逐字符相同，分别输出Within limit/Check finished及At limit/Check finished。

环境Node24.16.0、CPython3.14.2、Next16.4.3。工作区类型检查通过、385/385；Lint0错误和原忽略目录1项既有警告。干净候选类型/Lint零警告、384/384（少1项原用户未提交测试）。16组下载及3份空Notebook、143网页Python块/10组对照、61课教学结构通过。默认Turbopack外部node_modules联接限制真实失败保留，已核准Webpack生产路线draft87页/preview88页成功；112/112全站路由与10/10专项门禁通过，未改环境或冒称解决Turbopack根因。

生产浏览器1440/768/390/320均核对正文、三目标/两题、提示/解答/rubric、if/elif/else同层/四空格、边界表、九节点目录/聚焦、3.1↔3.2、参考折叠及错误/未来404。3.2 first-match位置离开、无hash重开、reload后恢复入口保持；旧3.1 r1完成仍在，新课不继承完成。复制首次旧值被识别后重试成功，没有伪造剪贴板验证。

全部60旧Lesson/60旧Publication与scope摘要相同；第一、二章12节r2及3.1/r1、第五章/其他课程、图/下载与所有P0–P16历史报告保持。旧当前scope/旧r1字符串与新3.2/r1隔离由专项存储测试核对，未注入、迁移或清空真实进度。原4份修改/7份未跟踪的路径/字节数/SHA保持，不暂存；3133原跟踪仅7授权源码改变、3126原字节不变。341份源码与干净候选对照一致。无删除、stash、reset-hard或系统安全策略修改。

身份PY101-C03-L02/order2/r1/optionalLesson=false，初始draft/private真实生产404；技术与候选浏览器/复制运行后进入pending-review/preview，technicalEvidence指向本轮TECHNICAL_REPORT，无reviewEvidence，PY101仍planned。3.3–3.8未注册Lesson/Publication/可读路由，不改P16蓝图和curriculum。

教师、中文教学编辑、真实满足先修学生试学、时间校准及macOS实机仍待办，责任/证据要求在EDITORIAL_RECHECK；前两章及3.1历史欠账继续，没有虚构人名、签署、通过率或学会结论。预计阅读12–18/练习8–12/代码20–30、共40–60分钟仍为编辑估计，else+elif负担待真人验证。

下一轮3.3具体简报见NEXT_3_3_BRIEF：围绕材料下限/库存上限，先分别求比较的bool，再按同时、至少一项、取反逐步引入and/or/not；准备区别两项贡献及边界的数据，两题沿P16的组合规则/连接词诊断方向。正式生产需重新简报/预解/事实与门禁；**本轮未开始3.3正文。**
