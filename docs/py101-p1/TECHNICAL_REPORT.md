# PY101 1.2技术验收

当前稿件PY101-C01-L02 r1，2026-10-29（Asia/Shanghai）。教材编写和下列技术验收已完成。先以draft/private接入，初轮TypeScript、Lint和Python实际运行通过后进入pending-review/preview，再完成全量测试与生产浏览器验收。人工学科审核、中文教学审核与真实试学均未进行；本报告不构成reviewEvidence。

## 结果与证据

| 检查 | 结果 / 文件 |
| --- | --- |
| 正式目标映射 | 3目标对应trace-target、same-target-two-starts两道核心题，具两级提示、分步解答、错法、rubric和合理替代；EDITORIAL_BRIEF.md与PRE_SOLUTIONS.md给语义依据，schema/review:teaching通过 |
| 路径实际实验 | Windows、Python 3.14.2、PowerShell 7.6.5；20个真实PowerShell案例通过，逐条记录command/cwd/stdout/stderr/退出码/运行前后cwd；PYTHON_EXECUTION.json |
| 相对/绝对路径 | 根、alpha、beta与新题west起点正确定位；绝对alpha路径从根与beta均输出Alpha A1；两次父终端cwd均不变 |
| 同名/空格/失败恢复 | Alpha A1与Beta B2区分；空格未引用失败、引用后Space S3；缺失文件退出2；题二相对/绝对路径在两个起点都得到Target T6和开发变化Check Z9；复制相同文本到另一文件的反例仍记录为另一目标 |
| 网页代码同源 | 6个Python短文件逐个对照资源模块并实际执行，stdout独立预期一致、stderr空、退出0；修改变体是开发输入，不是学生提交 |
| 下载 | 本课resources为空，不增加下载包/Notebook；prepare:downloads正常生成原16组资源，32个原下载文件由基线哈希保护，内容不变 |
| TypeScript / ESLint / Node | typecheck、lint通过；291/291 Node测试通过、无跳过；TYPECHECK.txt、LINT.txt、NODE_TESTS.txt；正式命令退出码和时间见CHECK_RESULTS.json |
| 全仓Python | 25个Python单元测试、48个网页Python代码块、原10组核心/完整版对照通过；TEACHING_V2_3_PYTHON_RESULTS.json、PYTHON_TESTS.txt |
| 教学结构清单 | review:teaching导出49节当前矩阵；结构通过不等于专业审稿，TEACHING_V2_3_CONTENT_MATRIX.json等 |
| 生产构建 | Next.js 16.4.3构建76页通过，新1.2为SSG；BUILD.txt；浏览器发现操作顺序措辞后再次构建并重启本轮3002生产服务 |
| HTTP路由 | 生产服务http://127.0.0.1:3002，104/104既有路由检查通过；新课200、1.3–1.6规划404、错误课程归属均符合；本轮3条边界请求另存BOUNDARY_ROUTES.json |
| 真实浏览器 | Codex内置Chromium，1440×1000桌面、768×1024平板、390×844手机、320×844窄屏；BROWSER_CHECKS.json与三张JPG |
| 复制与保存 | 实际点击源码复制，保存browser-copied/alpha/run.py并用真实Python运行，Alpha A1、stderr空、退出0；BROWSER_CODE_EXECUTION.json。长Windows绝对路径与手机目录树复制值均完整、无行号；不把toast当作唯一证据 |
| 页面交互 | 八个主导航组聚焦正确标题；两题六折叠初始关闭、展开正常；Quiz错答/正答反馈正常；平板/手机抽屉关闭后聚焦练习；临时输入刷新清空、恢复链接保留 |
| 响应式 | 390px下文档375px、320px下305px，没有撑宽；长路径在308px代码区局部滚动，scrollWidth约482/475px；目录树保留缩进 |
| 导航与状态 | 1.1→1.2动态链接、上一节返回1.1实测；第5章6入口保留；1.3–1.6无链接，浏览器手输1.3显示404；待审核提示可见，PY101仍planned |
| 进度 | 新1.2 r1初始不继承旧完成，刷新恢复；100%浏览仍completed=false；验收前已存在的旧键逐字节不变；Node另测1.1、5.1r1/r2与新课保存隔离 |
| 历史保护 | COMPATIBILITY.json：48旧Lesson、48旧Publication及2125个基线文件哈希不变，包含P0报告与蓝图、AI000历史证据、旧下载、课程事实、1.1/第五章及用户原4个跟踪修改。没有批量删除或覆盖旧证据 |

## 测试适配与失败处理

固定48课和PY7课的多处断言改为tests/helpers/registered-content.ts依据实际Publication与Registry检查双向集合、课程可读/旧版集合。旧历史全文/哈希循环仍执行；本轮新增专项按基线明确只允许增加PY101-C01-L02，防止两边同时多加课被集合相等漏检。不重构运行时系统，不放宽真实内容保护。

源码兼容只登记publication-manifest、course-engine和P0兼容接入三个必要文件；P1层只接受完整命中的after摘要，额外尾部原样返回，随后继续P0/R3精确逆转。P0及AI000旧SOURCE_CHANGES/历史快照不改写。

实际失败与恢复：

1. 新基线脚本初次用换行解析git ls-files，中文路径被Git引号转义导致ENOENT；改为-z/NUL读取后保存真实基线，无内容编辑发生在基线成功之前。
2. 新测试用filter组合条件后TypeScript未收窄联合类型，typecheck失败（TYPECHECK_FAILED.txt）。改为循环中的显式type判断，后续typecheck通过；Node第一次语义运行已通过，不能把Node通过当作类型通过。
3. 浏览器按动作连续审读发现空格实验后初稿写「留在beta」，但学生此刻在path-lab；改为「先cd到beta并用pwd确认」，重新构建并核对生产页，见EDITORIAL_RECHECK.md。
4. 新origin的CDP剪贴板读取超时，未更改权限或安全设置。重新观察页面、点击复制并用已提供的浏览器剪贴板接口读取，确认源码/长命令/目录树值，再保存执行；超时不记成复制成功。
5. Next构建自动改写next-env.d.ts的两条dev路由声明。第一次只尝试恢复routes候选，摘要不匹配即停止写入；再核对root-params声明，只有两项都还原且全文件SHA256命中开工基线才写回。最终保护检查通过，不提交该文件。

## 限制

本机只实测Windows与PowerShell 7.6.5，未实测macOS、Windows PowerShell 5.1、实体手机/平板、屏幕阅读器或其他浏览器。macOS命令依据Python及zsh官方资料核对；Apple具体页面返回429，未宣称读到全文。保存浏览器复制源码使用文件工具，学生编辑器保存UI没有端到端实测。没有新安装任务，不把已有解释器成功当作所有设备环境可用。

1.1旧状态句和通用收起ML词表的保留待办见EDITORIAL_RECHECK.md；它们不作为本课目标或练习先修。本次技术证据适用于当前r1，但无法证明零基础学生已独立学会。学时为编辑估计；人工审稿与真实试学按HUMAN_REVIEW_AND_PILOT.md交接。
