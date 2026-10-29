# PY101 1.1技术验收

当前稿件：PY101-C01-L01 r1，2026-10-29（Asia/Shanghai）。教材编写与以下技术检查已完成；人工学科审核、中文教学审核和真实学生试学均未完成。本报告仅支持pending-review/preview，整门PY101仍planned，无reviewEvidence。

基线：`81feeb132336e499bbc05d346cbe5d9710472723`，fetch后HEAD/main/origin/main一致。先以draft/private接入；完成首轮类型、Lint与Python检查后开放待审核预览，再完成全量测试、生产构建及真实浏览器验收。中途失败和修复见下表，最终八条npm命令均退出0，逐条时间及原始输出见 [CHECK_RESULTS.json](CHECK_RESULTS.json)。

## 检查结果

| 项目 | 最终结果 / 证据 |
| --- | --- |
| 正式目标与开放任务 | 3目标分别映射own-message/own-message/find-script；schema和review:teaching通过；语义说明见EDITORIAL_BRIEF.md，COMPATIBILITY.json导出当前映射 |
| 新课代码与新输入 | 本机Windows Python 3.14.2，16项预期逐一对照stdout/stderr/退出码通过；含中文/单引号、参考变化、交互退出、正常文件、错误路径/扩展名/引号及恢复、未保存、同名误跑；PYTHON_EXECUTION.json |
| 下载同源 | prepare:downloads生成16组资源；新.py、Notebook代码单元与网页主代码严格相等；Notebook未运行，execution_count=null、outputs=[]；本课只展示.py链接 |
| 全仓Python | test:python通过：25单元测试、42网页Python代码块实际执行、原10组核心/完整代码对照；TEACHING_V2_3_PYTHON_RESULTS.json |
| TypeScript / ESLint | typecheck、lint均退出0；TYPECHECK.txt、LINT.txt |
| Node | 286/286通过，无跳过；NODE_TESTS.txt |
| 教学结构清单 | review:teaching输出48节当前教材矩阵；TEACHING_REVIEW.txt及本轮TEACHING_V2_3_*结构文件；不是人工审稿或AI质量评分 |
| 生产构建 | Next.js 16.4.3构建通过，75页面，SSG含新1.1；BUILD.txt |
| HTTP路由 | 生产服务127.0.0.1:3001，104/104通过，含新课200、5个规划课404、错误课程归属404与旧入口；ROUTES.txt、TEACHING_V2_3_ROUTE_RESULTS.json |
| 浏览器 | Codex内置Chromium真实页面，1440×1000桌面、768×1024平板、390×844手机及320×844窄屏；BROWSER_CHECKS.json和三张JPG |
| 复制/保存/下载 | 点击网页复制按钮后读取浏览器剪贴板，实际写入browser_copied.py并执行；点击下载取得本机Downloads/first_run.py；两者字节等于同源源码，stdout预期两行、stderr空、退出0；BROWSER_CODE_EXECUTION.json |
| 目录、题目与状态 | 主导航组锚点及练习抽屉定位/焦点正常；两题六个提示/答案初始关闭、展开正常；Quiz提交给出反馈；输入刷新清空；待审核试读提示可见 |
| 规划/旧课 | 手机目录显示1.2–1.6筹备无链接，浏览器手输1.2显示404页；第五章六入口仍在，5.1可读；正文说明5.1尚有其他先修 |
| 进度 | 新首课r1不继承旧完成；100%浏览仍未标记完成；刷新显示真实恢复入口；浏览器首次读取时已存在的全部旧键逐字节不变，包含5.1历史r1；Node另外验证新旧课保存隔离 |
| 兼容保护 | BASELINE.json与COMPATIBILITY.json：47旧Lesson、47旧Publication、30旧下载文件及7保护文件哈希保持；含用户4个原修改文件、curriculum及第五章工厂；AI000 R3正文/历史证据没有改动 |

## 失败、恢复与复验范围

1. 初次把新程序加为corePrograms键，旧第五章工厂的类型联合要求新讲解项，typecheck失败。改用同一资源模块的独立firstRunProgram导出并登记programs；旧工厂与旧程序保持字节不变；后续类型、全量测试、下载哈希通过。
2. 新增首课使历史固定47课、PY6课、5核心课、旧默认预览入口及「至少两道Quiz」断言不适用。只更新当前总数/入口，对新课检查一个Quiz与两道开放任务；旧内容全文断言继续逐项执行。新增SOURCE_CHANGES.json和精确全文件摘要兼容层，不覆盖历史证据；额外未登记尾部仍被测试拒绝。
3. 开发核验脚本保留了错误与修复文件，重复执行原目录会使应失败的用例成功。分开缺失路径、错误扩展名及修复样例后重跑16项通过；未批量删除任何文件。
4. 浏览器高层剪贴板桥接返回空值，但页面按钮显示复制成功。改由该页面的CDP接口读取navigator.clipboard.readText，确认真实内容，保存并执行成功；没有把提示toast当作复制证据。
5. Next生产构建自动把next-env.d.ts的dev路由声明改为生产路径。按开工保存的SHA256验证候选后恢复用户原始dev声明；不提交该文件。最终兼容复核再次检查原哈希。

## 实测限制

代码实测基于开发机已有Python 3.14.2，不是官方安装流程验收，也没有声称实测3.15。干净Windows、受管无管理员设备、macOS安装及命令未亲自复验；macOS指引仅按官方文档核验。平板/手机是浏览器视口模拟，没有实体设备、辅助技术或多浏览器覆盖。复制文件的保存使用文件工具，Windows记事本和macOS IDLE的保存UI没有端到端实测。

既有通用阅读器保留的默认收起ML词表与第五章过时补修说明列在EDITORIAL_RECHECK.md，不把它们当本节先修。用户原有阅读器修改未纳入本次提交。技术检查允许证明所测契约，不能代替专业审核或证明零基础学生已学会；学时仅为编辑估计，后续见HUMAN_REVIEW_AND_PILOT.md。
