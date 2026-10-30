# P11技术验收

2026-10-30。唯一新课PY101-C02-L04/r1、order4、非可选。先在正式源码使用draft/private，实际对象不可解析、目录无href，生产108条路由全部通过且新课HTTP404，IAB实际看到不存在页面（DRAFT_GATE.json）。然后从基线构造隔离preview候选，工程与四档生产浏览器通过后才将正式源码提升为pending-review/preview，并应用两处已授权状态勘误。最终工作区另行完整构建和路由验证。PY101保持planned，不登记2.5/2.6，不填reviewEvidence。

## Python事实与实跑

先形成EDITORIAL_BRIEF、SOURCE_FACTS与独立PRE_SOLUTIONS，预测后才执行。Windows10.0.26300、PowerShell7.6.5、CPython3.14.2；官方网页当前版本与安装版本分别记录，无升级。Node24.16.0、Next16.4.3；全局既有Python验证使用NumPy2.5.2，新课无库依赖。

PYTHON_RUNS.json保留21次真实保存文件运行：14份同源程序/补齐上下文片段、完整逐步追加、保存结果的bool观察、9条字面比较、陌生8/8与限15下13/15/18三轮。每次写盘后重读、计算SHA，再以独立PowerShell进程从文件目录运行真实.py，记录命令、源码、cwd代号、PID、stdout/stderr/退出码。主例True/False/True；固定限6的5/6/7三轮分别True/True/False、False/True/True、False/False/False。正文、参考与陌生三轮各自同文件名、只改实际量，不能用一次结果代替。原始机器路径仅保留在忽略的作者实验目录，公开证据脱敏。

网页8个Python代码块通过严格文件名/源码匹配与独立预期校验；片段明确前置赋值。新课每块只接受退出0、stderr空、完整精确stdout；没有新增受控错误或print(count=6)实验。既有NameError、ZeroDivisionError等契约未改。全站真实25项Python单元测试、102个网页代码块、10组核心/完整版一致通过，详见WEB_PYTHON_RESULTS；网页执行和保存文件执行分别留证。

## 工程结果与干净候选限制

| 检查 | 最终工作区 | 干净候选 |
| --- | --- | --- |
| typecheck / lint | 退出0 | 退出0 |
| npm test | 346/346，失败/跳过0 | 345/345，失败/跳过0 |
| prepare:downloads | 16组Python/Notebook、另3份Notebook，退出0 | 同上 |
| test:python | 25项/102块/10组通过 | 同上 |
| review:teaching | 57节结构检查，退出0 | 同上 |
| npm run build | 默认Turbopack退出0 | 默认Turbopack退出1；Webpack替代退出0 |
| test:routes | 108/108，生产3024 | 108/108，生产3025 |

工作区多1项为用户开工已有Reader测试；干净候选来自git archive基线加13份明确任务代码，排除4份原跟踪修改及7份原未跟踪内容，不把两种测试数量混报。依赖使用现有node_modules联接，没有安装或改锁文件。外部候选默认Turbopack真实错误为Could not find the Next.js package；联接依赖在候选根外，根因未修复。保留完整脱敏错误CANDIDATE_BUILD_LIMITATION.json，使用本地Next指南支持的npm run build -- --webpack构建并start验收。没有把失败写成默认构建通过。ENGINEERING_WORKSPACE/CLEAN分别保留实际命令与退出码。

CLEAN_CANDIDATE.json逐文件比较全部13份任务代码的LF摘要，最终工作区、干净检查与浏览器构建输入相同；最终报告属于文档补充，不改变构建产品。无在线运行器、评分器、下载或装饰资源。新课8项专项测试检查身份/门禁、目标与两题、六符号/不超纲、精确输出、三轮真实记录、精确勘误与拒绝未知变更、导航/404/planned以及新旧进度隔离，没有固定全站Lesson数量门槛。

## 历史与工作区保护

开工重新fetch，HEAD/origin/main均b85e329b4688c0b55bbaf3f6c849a0732bc8455b；提交前再次fetch相同。按实际清单保护4份跟踪修改和7份未跟踪文件，11份原始字节/数量/SHA完全一致，见WORKSPACE_BASELINE及WORKSPACE_PROTECTION。Next构建自动改动的next-env仅在确认等于已知生成变化后还原开工原字节，用户原修改保留且不暂存；原3000服务不动。

原2818份跟踪内容/脚本/测试/资源/curriculum/文档以逐项指纹审计，公开BASELINE保留重点指纹及全清单聚合摘要；原56个Lesson/Publication中54个全对象不变，2.1/2.3分别只替末段paragraph后全对象相等，Publication仅技证指针变化，r1及progressScope保持。对应注册使用原兼容登记器、精确变更摘要；额外正文/源码变化仍不获豁免。P8/P10等旧报告未改，旧下载无差异，第一章、第5章、AI000/MA101/ML等既有断言继续通过。

## 生产浏览器与证据边界

BROWSER_REPORT、BROWSER_RESULTS记录20项确认检查及四张截图：1440/768/390/320宽度、两级提示/答案/rubric、复制六符号/ASCII引号/LF换行、目录和标题焦点、2.3→2.4、两处状态勘误、404/planned、新r1重载和旧r1/r2隔离。320整页内容宽305无横向溢出，代码区254/267有独立键盘横滚。初次立即粘贴读到旧剪贴板输出保留为诊断，原因未确定；等待已复制反馈后桌面/手机逐字通过，无权限变更。

这是技术开放依据，不是专业审稿通过。教师、中文教学编辑、真实零基础学生、macOS实机与28–43分钟编辑估时校准均未开展，第一章及2.1–2.3历史人工欠账继续。无签署、学生通过率或学会能力结论。
