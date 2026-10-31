# P16 技术验收

2026-10-31，Asia/Shanghai。实际Windows环境：Node **24.16.0**，CPython **3.14.2**，Next **16.4.3**。只新增PY101-C03-L01/order1/r1，optionalLesson=false；实际draft/private不可读，经下列技术与候选浏览器门禁后进入pending-review/preview，无reviewEvidence，整门planned。

| 命令/验证 | 工作区或干净候选实际结果 | 记录 |
| --- | --- | --- |
| `npm run typecheck` | 工作区与候选均exit0 | typecheck-final、typecheck-candidate-final |
| `npm run lint` | 工作区exit0、0错误/1既有警告，来自忽略目录.workbuddy/py101-p15/audit.ts未使用paragraphs；不在本轮源码内，未动用户文件。干净候选0错误/0警告 | lint-final、lint-candidate-final |
| `npm test` | 工作区379/379，干净候选378/378；差1是原用户未提交阅读测试 | unit-final、unit-candidate-preview-recheck |
| `npm run prepare:downloads` | 16组Python/Notebook及3份分格Notebook；下载逐字节保持，空输出与null执行号契约通过 | downloads、downloads-candidate |
| `npm run test:python` | 133网页代码块、10组核心/完整对照和既有Python单元测试通过，exit0 | PYTHON_RESULTS；clean-preview子目录为干净候选 |
| `npm run review:teaching` | 60节结构、目标映射/分层与学时表生成，exit0 | CONTENT_MATRIX、teaching-candidate |
| `npm run build` | 干净候选默认Turbopack失败：外部node_modules联接超出解析根，next/package.json无法解析 | build-draft-turbopack，原错误保留 |
| `npm run build -- --webpack` | 沿项目已核准路线，draft86页、preview87页生产构建成功，exit0 | build-draft-webpack、build-preview-webpack |
| `npm run test:routes` | draft及preview各111/111，生产next start，exit0 | DRAFT_ROUTE_RESULTS、ROUTE_RESULTS及clean-preview |
| `npx tsx scripts/validate-py101-conditional-routes.ts` | draft/preview各11/11，含3.1实际权限、3.2–3.8全部404、两个错误归属404与2.6可读 | DRAFT_HTTP_GATE、PREVIEW_HTTP_GATE |

上述日志均在本目录，名称后缀为.log；同名TEACHING_V2_3文件只是脚本沿用的文件名，不将P16稿件称作旧稿。公开运行记录仅替换本机路径前缀，原始作者运行日志在临时实验目录保留；未伪造stdout或键盘回显。未改环境配置，不宣称解决Turbopack根因。

## Python与教学行为

PRE_SOLUTIONS先于Lesson注册，验证器的预期由整数大小与块归属独立填写。`validate-py101-conditional.ts`每次保存.py、重读比对、核SHA，再启动独立CPython进程；17个不同PID覆盖无if真/假、单if低/等/高、块外print、两语句块真/假、一条移出块、逻辑错、修后真/假、参考资料架三轮及陌生>=最低标准三轮。PYTHON_RUNS记录源码/cwd/实际命令/预期/stdout/stderr/退出/PID。所有17轮exit0；逻辑错误能够正常运行，但业务输出不符合规定。正文没有人为SyntaxError/IndentationError实验，不冒称测过它们。

COPIED_CODE_RUNS是另2份通过真实网页Copy按钮取得的.py，分别执行主例与修复假路径；四空格/冒号/空行均保留。BLUEPRINT_PRECHECK另行实跑8份规划主例（3.7用真实stdin 2/9/4），不注册后续课或将计划例子当作正式教材。

## 历史、进度与工作区保护

2.6只改最后一段衔接；完整Lesson前后差异断言、目标/练习/锚点及scope相同，r2与Publication保持。其余58份旧Lesson及59份旧Publication全对象摘要一致。12课r1/r2共24份旧进度字符串由专项存储单测验证不变，新3.1使用独立r1键且不继承完成；浏览器以普通UI复核2.6与3.1的完成状态隔离/重载，未注入存储。

原P0–P15断言不再错误观察当前新增第三章：继续使用同一个APPROVED_CHANGES完整摘要登记器，P14/P15视图只在新Lesson与Publication**两份完整摘要均匹配**时排除后增课。旧测试只换观察入口/同版本新增集合，不改原题目/历史报告/快照和原断言。任何额外源码、旧Lesson、Publication、新课改写或未知ID都不匹配豁免，6项P16专项含负例。通用content测试仅把3.1纳入既有“核心开放代码题+assessmentMap”分支，不强塞两道Quiz。

WORKSPACE_PROTECTION：3060份原跟踪文件中15份授权既有文件改变、3045份字节不变；原4修改/7未跟踪共11份的SHA仍完全相同。curriculum、其他课、图、下载、P0–P15固定包与存储实现未改。候选导出不含4份用户修改和7份原未跟踪；334份src/scripts/tests/curriculum及新P16源码逐一比对，规范化换行后与候选相同，见CANDIDATE_SOURCE_MATCH；原文件保护另用逐字节SHA，不以换行规范化代替。

## 失败与修复范围

首轮工作区373/379，6项失败来自历史视图排除P16后仍使用当前新增集合/蓝图；同步历史观察入口后379/379。首轮preview干净候选377/378，1项失败来自旧通用Quiz门槛，纳入已有开放题契约后378/378。以上失败日志保留，没有修改P0–P15快照以迎合新稿。工具对一次合并路由记录命令的自动审查拒绝后，拆为既有test:routes和专项脚本成功完成，没有跳过门禁。

浏览器过程中的复制/导航读取时序与目录定位重查详BROWSER_REPORT。技术通过仅支持待审预览，不构成学科/中文审稿、真人试学或macOS实机结果。
