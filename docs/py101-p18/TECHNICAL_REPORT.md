# P18 技术验收

2026-10-31，Windows、Node **24.16.0**、CPython **3.14.2**、Next **16.4.3**。唯一新增PY101-C03-L03/order3/r1/optionalLesson=false。先正式draft/private，真实生产404；候选开放试读完成必要浏览器与复制/完整重载验证后，工作区才pending-review/preview。无reviewEvidence，PY101仍planned，3.4–3.8无Lesson/Publication/可读正文。

| 检查 | 实际结果 | 证据 |
| --- | --- | --- |
| npm run typecheck | 工作区draft/final、候选draft/final均exit0；保留初次新测试类型收窄失败及修复 | typecheck各阶段及initial-failure.log |
| npm run lint | 工作区0错误/1既有警告，候选零错误/零警告，均exit0 | lint各阶段.log |
| npm test | 工作区draft/final **392/392**，候选draft/preview **391/391**；初次专项换行断言失败已留存 | unit各阶段及initial-failure.log |
| npm run prepare:downloads | 16组Python/Notebook及3份分格Notebook通过，旧下载字节保持 | downloads、downloads-candidate.log |
| npm run test:python | **154**网页代码块与10组核心/完整版对照、既有Python单元测试通过；两环境一致 | PYTHON_RESULTS、clean-preview、python日志 |
| npm run review:teaching | **62**课目标映射、分项时间与分层清单通过 | CONTENT_MATRIX、clean-preview、teaching日志 |
| npm run build | 候选默认Turbopack exit1，外部node_modules联接超出解析根，找不到next/package.json | build-draft-turbopack.log |
| npm run build -- --webpack | 已核准路线，draft **88**页、preview **89**页生产构建成功 | build-draft/preview-webpack.log |
| npm run test:routes | draft/preview各 **113/113**生产HTTP通过 | DRAFT_ROUTE_RESULTS、ROUTE_RESULTS、clean-preview |
| 专项生产门禁 | draft/preview各 **10/10**：新权限、3.1/3.2、五未来与两错误归属 | DRAFT_HTTP_GATE、PREVIEW_HTTP_GATE |

既有警告位于忽略目录.workbuddy/py101-p15/audit.ts的未使用paragraphs，未修改；没有新源码警告。候选比工作区少1项原用户未提交阅读体验测试，原文件保持。没有改Next配置、依赖、系统安全或把Webpack成功称为Turbopack根因已解决。

## 独立预测、实际进程与同源契约

PRE_SOLUTIONS在起草及运行前保存，报告绑定其SHA。53项字面预解、48个不同保存文件进程：11个网页键的44项数据，另5项陌生门票范围、4项纯bool组合；主例与修复参考五项源程序完全相同，明确复用相同PID/源码/SHA，不重复启动凑次数。所有实际stdout（换行只在比较时规范化）、stderr、exit、命令/cwd、源文件和SHA在PYTHON_RUNS保留。错误or在2与7虽然exit0但businessCorrect=false，修and仅一词差异，五值与边界正确。

每个网页Python块为完整程序，按filename+完整code匹配登记资源；未知名称、改写连接词或追加代码均抛错，不会静默跳过。每键必须有包含原样源码的非空执行案例。11个实际显示块另与资源逐字对照，DOM_SOURCE_MATCH；另2份真实按钮Copy落盘执行见COPIED_CODE_RUNS，二者不是同一种证据。

短路用标准库dis定位原样保存程序的左右COMPARE_OP源位置，再由sys.monitoring局部INSTRUCTION事件观察，4个独立作者进程按预解得到[左]、[左,右]、[左]、[左,右]，对应and左假/左真、or左真/左假；实际输出也核对。没有改变学生程序以插入函数/副作用，观察器只在作者工具。最初legacy sys.settrace观察器没有收到opcode事件，断言失败，源码/实际空事件和日志保留；未冒称该初试能验证短路，也未把它归因于语言语义错误。

SOURCE_FACTS区分官方3.14.10网页与本机3.14.2：一般and/or返回某个操作数，not返回bool；本课比较产生的bool操作数才使具体组合也是bool。专项拒绝典型“所有情况下都返回bool”的错误陈述。正文准确区分预先保存两项比较已执行、直接条件可能跳过右比较，不混淆3.2选择链。

## 历史、进度与授权范围

61旧Lesson、61旧Publication、全部scope摘要完全一致；3.1/3.2 r1正文、目标、练习与末段不改，前两章12节r2、第五章、AI000/MA101/ML与全部历史报告、下载保持。历史视图只增加P17观察入口，原P17断言不改；授权豁免仅完整新对象/来源文件摘要一致时生效，未知标题/顺序/ID/附加源码仍拒绝。

专项存储测试先为全部61旧scope及有新版的历史r1建立字符串，保存新3.3/r1的58%/short-circuit并新建store重载，全部旧串逐字节保持、新课不继承完成。浏览器另证3旧课完成保留、新课未完成及完整导航/文档重载恢复。快速SPA往返观察仍有读到前段/首段的时序现象，**不列为通过、不称已修复**；详BROWSER_REPORT，后续需单独授权Reader复核。本轮未动Reader/存储，也未迁移、注入或清空真实用户记录。

3202份原跟踪中仅7份白名单源码改变、3195原字节保持；原4修改/7未跟踪共11份用户文件的路径/字节/SHA一致。348份源码与生产候选逐项一致。candidate是新导出而非修改原用户checkout，原用户4修改取HEAD副本、7未跟踪不放候选。APPROVED_CHANGES与REVIEW_BINDING绑定当前r1，不扩展平行课程或兼容系统。

## 失败修复与限制

除保留的Turbopack、legacy观察器、Copy旧值和SPA读数，首次专项有raw CRLF与LF直接断言不等，改用既有输出比较器；新测试filter未充分收窄code类型，增加显式类型谓词。两者为新测试实现问题，保留首轮日志，未改写真实Python stdout、预解或学生逻辑来迎合测试。最终全套已通过；公开日志仅替换本机路径前缀、规范化CLI换行/尾空白，JSON实际stdout除路径前缀外保持。

生产四宽1440/768/390/320、九节点目录、双提示/解答/rubric、11源码、真实Copy、局部水平滚动、相邻导航、完整重载与404均有实际证据；浏览器时序观察的适用限制明示，不以截图代替交互。当前仅支持待审核试读。教师、中文教学编辑、满足先修学生独立试学、44–65分钟估计校准、macOS实机均待办，见EDITORIAL_RECHECK；不造签署、通过率或reviewEvidence。
