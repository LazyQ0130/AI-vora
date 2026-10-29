# PY101 1.3技术验收

新课PY101-C01-L03，r1；工程验证记录集中在本目录，最终汇总见DELIVERY_REPORT.md。起草先draft/private，门禁见DRAFT_GATE.json。Python终端专项与真实VS Code证据分别见PYTHON_RUNS.json和EDITOR_VALIDATION.md；53个网页Python代码块执行记录见TEACHING_V2_3_PYTHON_RESULTS.json。它们只证明对应技术行为，不替代专业内容审稿或零基础学生试学。

技术门禁完成后设pending-review/preview，整门PY101仍planned；1.4–1.6没有新增正文、注册或可读路径。两份短练习文件由学生本地创建，沿用代码复制，不新增下载机制、IDE或运行服务。现有下载生成器仍须回归。

旧1.1状态段补充证据见FIRST_LESSON_AMENDMENT.md，1.2不变。历史全文、发布与文件摘要保护、未授权变化拒绝、旧进度保留由专项单测与COMPATIBILITY.json证明。当前清单数量由既有动态核验工具检查，没有删除固定历史保护断言。

验收结果：typecheck、lint通过；npm test为296/296，专项14/14（包含在全量）；prepare:downloads同源生成16组，旧文件摘要未变；test:python实际执行53个网页代码块及10组核心/完整版一致；review:teaching核验50节；build生成77页；test:routes为104/104。命令日志均在本目录。浏览器四档与交互、复制接口限制见BROWSER_REPORT.md，真实GUI限制见EDITOR_VALIDATION.md。

保存顺序：初始类型/Lint/53块Python与12情景专项通过后完成draft/private不可读门禁，再登记试读证据入口，执行全量/构建/路由/浏览器验收。最终保留pending-review/preview；没有将技术验收写为人工审核完成。

COMPATIBILITY.json保护2190份改前文件、49旧课与49旧发布项：除明确登记的1.1状态段和技术证据链接，旧课对象不变；1.2对象与源码不变，其他课程、curriculum、资源、旧证据与用户4份修改保持。构建会重写next-env.d.ts，已只在候选字节摘要等于本轮改前基线时恢复用户原改动，未暂存该文件。

提交内容另以暂存树导出验证295/295单测通过，和保留用户原阅读测试的工作区296/296区分记录。旧快照的换行可移植性与原有未提交文件指纹问题已修复，不覆盖历史快照；拒绝额外内容变化的断言保留。详见REPOSITORY_VALIDATION.md。构建/浏览器是在原工作区完成，导出仅用于干净内容回归。
