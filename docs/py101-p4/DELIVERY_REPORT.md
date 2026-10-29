# PY101-P4交付及P5交接

2026-10-29。重新fetch后的HEAD=origin/main=8f3fd1f814651828c548b8875a2121c4dda1328f，无新增远端提交。新课仅PY101-C01-L05「在Jupyter中按顺序运行单元格」，order5、contentVersion1、L1基础必学；1.6不制作。最终提交身份由包含本报告的Git提交确定，推送后完整SHA/远端比对在最终回复核实，不在文件内编造自引用SHA。

## 教学成果

三个正式目标：在项目环境启动Notebook并确认内核，创建文字/代码与保存；预测观察旧状态和乱序错误并恢复；重开后在正确干净内核从头完整执行。assessmentMap对应create-own-notebook（目标1/3）和recover-cell-order（目标2/3）。

主例first-notebook.ipynb包含Markdown说明、marker赋值、print显示及现成内核观察格。真实观察Draft A→改文本不执行仍Draft A→执行后Ready B→重启先显示NameError→恢复→干净全跑。只有最小名字赋值为临时新语法，不引入完整变量/类型/函数/作用域。浏览器、Notebook服务器、Python内核与磁盘文件分别讲清；保存输出不等于新内核状态。

第一题必须自行新建、命名，使用不同名字和自选文字，提交真实文件、预测/输出、实际内核位置、保存/重开与干净全跑证据。第二题用新的出库标签delivery_note情境，独立复现/解释乱序错误；恢复后做一次自选文本未执行的短观察，再重开、明确重启按文档顺序全跑并保存。两题均有两级提示、解释性答案、常错、合理替代与rubric，Quiz和下载点击不替代实际操作。

预计阅读12–18、练习6–10、Notebook实践20–30分钟，共38–58，basis=editorial-estimate；安装/下载/权限/异常等待另计，未虚构学生时间。

## 真实技术证据

|类别|本轮证据与适用边界|
|---|---|
|安装/启动|已有CPython3.14.2，在仓库外全新项目.venv安装Notebook7.6.3，Server2.21.1、ipykernel7.4.0；明确环境Python的-m jupyter notebook成功；本地8888、默认token保护，未用户级注册内核或修改全局环境|
|Jupyter GUI|真实新建/Markdown/Code/命名/内核核对、旧值、NameError、重启全跑、保存、关闭重开再重启全跑；实际文件与脱敏AX/截图留证。关闭会话后无内核，File → Shut Down后终端0、服务退出|
|独立真实内核|40步：主例、两份下载格式/干净执行、物流故障与新标记旧状态、自创题；两题实际保存.ipynb、重读并从干净内核全跑、核验身份，最后shutdown。该证据不冒充GUI|
|工程自动检查|类型、Lint、原工作区308/308单测；干净暂存树导出307/307，差额为用户原有未提交阅读器测试；62个网页Python块与10组对照、旧Python单测、52节技术矩阵；16组旧下载不变，追加2份同源空输出Notebook；生产79页、HTTP104/104|
|Aivora真实浏览器|3005生产服务，桌面/平板/手机/320四档；复制实际粘贴、真实下载、提示/答案/rubric、Quiz、锚点/前后课、独立已读重载、筹备/404；窄屏长下载按钮已修复，最终305px|
|macOS|官方文档核验，未macOS实测|
|教学审核|同一AI另轮求解/中文辅助复核；专业真人审稿、中文编辑签署、目标学生试学均未完成|

失败和实际限制：内核驱动重启后继续用旧client导致IOPub超时，重建通信后复验；初次类型测试错误已修；自动化PTY Ctrl+C退出1不能冒称Jupyter退出0，因此另用当前GUI正常关闭并核对终端0；进程检查曾把自身venv启动器误算残留，按祖先关系排除检查程序后通过。公开日志全部脱敏；一次检查误输出了停服后的失效令牌，未进入公开文件或Git。首次即时剪贴板旧值、重载定位失效均重新观察并取得真实通过证据，没有编造成功。细节见NOTEBOOK_DRIVER_REPAIR.md、JUPYTER_VALIDATION.md、BROWSER_REPORT.md。

## 变更与兼容

新增Lesson与python-notebook同源资源、两份Notebook下载、聚焦单元格/真实内核测试；engine和发布接入；prepare-downloads最小追加Notebook写出；Python校验显式提供单元格上下文，未知块仍失败。沿用现有Schema、Reader、目录和进度，无站内Notebook执行器、运行时API、额外Node依赖或第二套播放器。

复用P3审计入口增加P4参数与P1批准修订登记数据，P3测试改动态新增/规划判断，不删除旧保护或另造固定教材总数层。基线保护51旧Lesson、2624原跟踪文件与7原未跟踪文件。1.4仅最后状态段勘误，r1、核心考核/答案/rubric与锚点不变；before/after/hash及版本理由见TRANSITION_AMENDMENT.json/md。1.2已知旧句不扩写，其他旧课/下载/报告不改。

用户next-env.d.ts、scripts/ai000-r3-compatibility.ts、src/components/lesson/reader.tsx、tests/reading-experience.test.ts保持开工原始字节并未暂存；原附件保留。构建生成的next-env按原指纹恢复。暂存树不含.venv、运行时缓存/连接文件、token、私有配置或原始机器文件；安装和运行均在本轮新项目，服务/内核均已停，临时环境保留供复核。未删除、stash、reset-hard或强推。

## 发布与尚待人类完成

先保存draft/private注册不可读、生产草稿/HTTP门禁，再进入pending-review/preview。当前PY101-C01-L05/r1待人工审核试读；PY101整课仍planned，原10章/26–36小时/培养目标和最终《命令行数据清洗与统计小工具》不变；1.6无正式Lesson或可读路由；AI000、MA101和第五章未自动升级发布。

Python/Jupyter专业审核须检查环境、内核、保存/状态/顺序、安全停服与各平台行为；中文教学编辑须检查同时引入术语、最小赋值、提示效度和新题迁移。目标学生应满足1.1–1.4且未学Jupyter，先无提示独立完成两题，保留文件与解释，记录启动/内核、保存与执行、旧状态预测、恢复、干净全跑、提示/补讲及分项真实用时。具体责任表见EDITORIAL_RECHECK.md；未虚构人名、签署、成绩、通过率或效果。需试学后校准38–58分钟，当前不进入reviewed/pilot/published。

## P5先修边界

进入1.6前，应能运行/保存脚本，判断cwd与目标，核对编辑器/实际解释器，创建并使用项目环境，确认Notebook内核，解释文本、旧输出与状态差异，从干净内核重跑保存文件。1.6《让别人复现一次环境问题》将首次综合最小复现记录与交接，不在本轮提前制作，也不要求已会完整pip、依赖锁定、远程服务或调试框架。

真实欠账为macOS实测、人类专业与中文审核、目标学生试学和估时校准；Ctrl+C宿主差异及1.2旧状态句留待有针对性的后续范围。第5章函数课仍需变量、表达式与控制流程基础，本节最小赋值不能替代这些先修。

入口：[课前简报](EDITORIAL_BRIEF.md)、[官方事实](SOURCE_FACTS.md)、[预解](PRE_SOLUTIONS.md)、[技术报告](TECHNICAL_REPORT.md)、[Jupyter验证](JUPYTER_VALIDATION.md)、[两类浏览器](BROWSER_REPORT.md)、[辅助复核/人工待办](EDITORIAL_RECHECK.md)。
