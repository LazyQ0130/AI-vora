# P17 技术验收

2026-10-31，Asia/Shanghai。实际环境为Windows、Node **24.16.0**、CPython **3.14.2**、Next **16.4.3**。唯一新增PY101-C03-L02/order2/r1/optionalLesson=false。先真实draft/private不可读，经候选技术/浏览器及复制运行通过后，工作区转pending-review/preview；无reviewEvidence，整门PY101仍planned。

| 检查/命令 | 实际结果 | 本目录证据 |
| --- | --- | --- |
| `npm run typecheck` | 工作区与干净候选均exit0 | typecheck-draft/final、typecheck-candidate-draft/final.log |
| `npm run lint` | 工作区0错误/1既有警告；干净候选0错误/0警告，均exit0 | lint-draft/final、lint-candidate-draft/final.log |
| `npm test` | 工作区draft/final均385/385，候选draft/preview均384/384 | unit-draft/final、unit-candidate-draft/preview.log |
| `npm run prepare:downloads` | 16组Python/Notebook及3份分格Notebook通过；空输出/null执行号，旧下载字节未变 | downloads、downloads-candidate.log |
| `npm run test:python` | 143网页代码块、10组核心/完整对照及既有Python单元测试均通过 | PYTHON_RESULTS及clean-preview子目录；python-web/candidate.log |
| `npm run review:teaching` | 61课目标映射、分项时间与分层清单生成，exit0 | CONTENT_MATRIX及clean-preview；teaching/candidate.log |
| `npm run build` | 干净候选Turbopack失败：外部node_modules联接超出解析根，找不到next/package.json | build-draft-turbopack.log，保留真实失败 |
| `npm run build -- --webpack` | 按项目已核准路线，draft87页、preview88页生产构建成功，exit0 | build-draft-webpack、build-preview-webpack.log |
| `npm run test:routes` | draft/preview各112/112，全站生产HTTP通过 | DRAFT_ROUTE_RESULTS、ROUTE_RESULTS、clean-preview |
| `npx tsx scripts/validate-py101-branches-routes.ts` | draft/preview各10/10：新3.2权限、3.1可读、未来3.3–3.8与两个错误归属404 | DRAFT_HTTP_GATE、PREVIEW_HTTP_GATE |

工作区既有警告位于忽略目录`.workbuddy/py101-p15/audit.ts`，变量paragraphs未使用；该文件不属于本轮源码，未擅自改动。候选少1个测试来自原用户未提交阅读体验测试，原文件保留、不暂存。没有新Lint警告或通过改用户环境掩盖问题。Turbopack根因未修复，未改Next配置或系统策略。

## Python：不能只看exit0

PRE_SOLUTIONS在注册前保存。`validate-py101-branches.ts`独立填写预期，复用已有保存文件运行器：每轮真实写.py、重读核SHA，再启动独立CPython；24次普通运行覆盖单if衔接、两路真/假/等值、三档低/等/高、首项<=重叠、仅修<、独立if重复、两题各阶段与陌生先判>的门票数据。所有正常退出且逐字符匹配预解；故障例虽然exit0，但输出不符合唯一分类要求，报告没有把它称为正确分类程序。

另2次作者标准库`python -m trace --trace`运行同一保存副本，预测与实际执行行分别是[1,2,4,5]和[1,2,4,6,7]，确认首项真时后面比较没有执行。没有把trace、函数或容器塞进学生正文。PYTHON_RUNS记录24个不同PID的源码/SHA、cwd/命令、预期/实际stdout、stderr、退出，以及两次trace完整输出和执行行；公开仅替换本机路径前缀，原始文件记录在临时实验目录保留。

COPIED_CODE_RUNS另证2份真实通过网页Copy取得的文件，保留else/elif同层、体内4空格、冒号与换行，实际执行结果为Within limit/Check finished及At limit/Check finished。不是以DOM读取或参考输出冒充剪贴板/进程。本轮不人为增加SyntaxError/IndentationError实验。

## 内容、历史与范围

6项P17专项验证身份/发布门禁/相邻顺序、三目标两核心代码题映射、两级提示/解释/错法/rubric、else/elif先解释后代码、10个同源网页Python块、真实24轮/2 trace、全部60旧对象/scope、未知改动拒绝和新版进度隔离。通用content测试只增加3.2到已有开放代码题分支，未增加Quiz门槛。

原60份Lesson、60份Publication及scope逐项摘要完全相同，特别是3.1/r1正文、末段、目标、两题及发布依据；第一、二章12课均r2，第5章及其他课程保持。P16测试只换到已有历史视图工厂的P16入口，原断言不变；P0–P16报告/快照不覆盖。新增历史豁免只接受3.2 Lesson和Publication两份完整摘要，额外代码、改标题/状态、未知ID或来源均拒绝。

存储单测为全部60个既有scope及有新版的旧r1建立测试字符串，再保存3.2/r1的56%/first-match；新scope初始无记录、不继承完成，重载位置正确，全部旧字符串逐字节不改。12课旧r1/r2与3.1/r1由同一逻辑覆盖，存储实现未改。浏览器另以正常UI证明新位置离开/重开/reload、旧3.1完成保留；不声称作者或内存测试是学生试学或实际所有用户的历史记录。

WORKSPACE_PROTECTION：3133份原跟踪文件中仅7份授权源码改变，其余3126份字节保持；原4修改/7未跟踪共11份原SHA/字节数一致。curriculum、全部历史报告、下载、图、第一/二章及3.1源码无改动。候选导出排除原11份工作区内容，341份应用/脚本/测试/课程事实源码和新增P17文件与最终稿逐项核对LF摘要一致；原文件保护另用原字节SHA，不以换行规范化替代。

## 实际限制与交接

本轮Node专项和全套首轮即通过；保留真实Turbopack失败，Webpack替代路线没有冒称修复根因。首次网页复制读到旧剪贴板，检查发现后未保存为通过，重试得到正确新代码并实跑，详BROWSER_REPORT。日志公开副本替换本机路径前缀、统一换行并去除CLI行尾空白；Python JSON中的stdout/stderr除路径前缀外保持实际内容，不补造回显。

真实生产浏览器覆盖1440/768/390/320，九节点目录/标题焦点、两题提示/答案/rubric、分支对齐/复制、边界表、3.1↔3.2、新阅读位置重载与错误/未来路由。技术结论只支持pending-review/preview；教师审稿、中文教学编辑、目标学生独立试学、时间校准及macOS实机均待办，不填reviewEvidence。
