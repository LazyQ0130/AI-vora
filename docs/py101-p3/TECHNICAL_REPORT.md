# PY101 1.4技术验收

基线b70eaab04b6be1f058a8c04ad59af17c7d790648；新课PY101-C01-L04/r1，基础必学。证据区分自动技术、真实Shell/Python、真实GUI、macOS文档、AI辅助审读与待人工/试学，完整交付最终见DELIVERY_REPORT.md。

私有草稿：DRAFT_GATE.json证明注册而不可读；BUILD_DRAFT.txt为实际生产草稿构建，draft/TEACHING_V2_3_ROUTE_RESULTS.json及ROUTES_DRAFT.txt为104/104实际HTTP检查，1.4仍404。TESTS_DRAFT.txt为302/302。旧单测曾默认所有注册内容都开放或使用清单第一项作试读样本，现按真实可读性分支、选取可读fixture并将AI000专属门禁限定本课程；私有不可读断言保留。

最终试读：TYPECHECK.txt、LINT.txt通过；TESTS.txt为原工作区302/302；BUILD.txt为Next.js16.4.3生产构建78页；ROUTES.txt与TEACHING_V2_3_ROUTE_RESULTS.json为104/104实际HTTP检查。生产服务由本轮在127.0.0.1:3004启动，真实浏览器覆盖见BROWSER_REPORT.md。窄屏展开答案曾被长路径撑宽，现仅在既有guided-exercise答案列表加overflow-wrap: anywhere，保留代码块原样与局部横向滚动；重新构建并实测320px无答案溢出后，再次通过类型、Lint、302单测与104路由。

既有入口实际运行：prepare:downloads生成16组同源资源且旧文件摘要不变；test:python实际执行56个网页Python块、10组核心题对照及既有Python单元测试；review:teaching生成51节技术矩阵（不称人工教学审核）。日志为DOWNLOADS.txt、PYTHON.txt、TEACHING.txt及相应JSON。专项SPECIALIZED.txt为20/20，含新课6项。未把有特定课程范围的review:editing当作PY101全量审稿。

暂存树另以git checkout-index导出到全新临时目录，仅用node_modules链接复用现有依赖；CLEAN_TESTS.txt为301/301。导出树使用仓库原有四份文件，不带用户未暂存的修改。原工作区多出的一项来自用户原有tests/reading-experience.test.ts，本轮不提交它。因此302与301有明确文件范围差异。干净导出只补验Node全套测试，不冒称另做了该树生产构建或GUI。检查暂存路径，没有.venv、machine或.vscode配置。

Windows实测：Python3.14.2，PowerShell7.6.5；四个新建项目环境，28份命令记录见PYTHON_ENV_RESULTS.json，首次创建单独保留CREATE_*.json。包括基础位置/版本，环境存在，直接调用，各自executable/prefix/base_prefix，普通输出、错误环境/恢复、成功激活/deactivate、只cd沿用旧激活、独立新shell与忽略规则。记录实际cwd、命令、stdout/stderr、退出码与预期；公开路径仅替换真实workspace/user前缀，关系与输出不改。没有安装第三方包、下载新Python或改系统安全设置。macOS仅官方核验，未实测。

测试工具初次使用Windows PowerShell5.1的多行-c引号传递造成SyntaxError，改用保存的只读诊断文件；当前5.1宿主另出现Microsoft.PowerShell.Security模块加载失败，根因未进一步排查，之后在本机可用PowerShell7执行，不把5.1写成已全覆盖。上述均为验证工具/宿主限制，不改学生项目源码或执行策略解决。

GUI观察与限制单独记录EDITOR_VALIDATION.md。1.3状态勘误与r1决定见TRANSITION_AMENDMENT.md。现有内容的对象/文件哈希保护与进度隔离，最终COMPATIBILITY.json和专项测试留证；旧报告、版本、锚点不重建。正文与命令同源于python-venv.ts，无新内容Schema、执行器或下载机制，环境和机器设置均忽略，不入提交。

严格工作区审计命令为npx tsx scripts/audit-py101-p3.ts；审计50份旧Lesson与2564个原跟踪文件，只有明确登记的必要工程修改及1.3最后状态段勘误被接受，四份用户原文件逐字节保持。APPROVED_CHANGES.json为授权变更逆向核对数据；沿用既有P1兼容登记器按新到旧撤销批准修订，没有另造固定总数保护层。P3单测还验证附加未授权文本被拒绝。自动技术、同一AI另轮复核、真实GUI和真人审核是不同证据；人工学科/中文审核与零基础试学均未开展，见EDITORIAL_RECHECK.md。
