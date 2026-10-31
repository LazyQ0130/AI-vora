# P15技术范围与验收

基线 cb3927fa0be59a8108a30cf183361aa1f7c8a318。十二节r2/36目标/24核心题；现有代码/命令/同源资源不改。无新Lesson、第三章、在线执行、自动评分、Reader、Schema或进度引擎变动。十二Publication仅版本和技术依据更新，仍pending-review/preview，无reviewEvidence，PY101整课planned。

Windows Node24.16.0、CPython3.14.2、Next16.4.3。最终原工作区执行：typecheck、Lint零警告、373/373 Node（含7项新r2专项）、prepare:downloads共16组及3份单元格Notebook、test:python全部126网页块和10组核心/完整版对照、review:teaching全59课、Turbopack生产build、110/110真实生产HTTP路由。新专项直接检查当前对象；历史专项只在整摘要命中后看P14对象，原断言数保留。版本隔离、完整源码/对象未知附加改动拒绝、47份其他课/Publication保护均覆盖。

初次build因新测试联合类型未收窄失败，修正测试类型后最终build通过；初次Lint四个未用旧行号helper警告，删除已失去调用的helper后零警告；未跳过检查。初次Python默认把结果写历史文件，已将新结果另存本目录，并经基线SHA核对恢复原报告精确字节；后续教学/路由报告使用AIVORA_EVIDENCE_DIR隔离输出，P0–P14均不作为本轮输出覆盖。

19个额外真实Python进程验证新增诊断的改值/分组/边界/input与ValueError恢复、相对路径及两个新无pip环境的身份。预解先保存；source SHA、cwd、stdin、stdout、stderr、PID、退出与实际预期在DIAGNOSTIC_RUNS。作者工具的venv --without-pip仅减少验证环境准备，不改学生命令。网页所有原code对象（含两系统命令）前后逐块相等；Notebook/VS Code GUI代码未改，历史真实内核记录复核，不冒称本轮学生或GUI操作。

生产IAB在3032检查全部12课×4视口共48页；两图共8幅视口证据、24题的两提示/答案、六Quiz错误→换项→正确、代码复制、导航/404、旧进度和新r2恢复。首次320路径题长词相连溢出338px，经题干路径之间加空格修复为页面305px；代码仍局部滚动，字体16px。复制首轮读剪贴板过早为空，待UI「已复制」后实读正确，保留首次/复查记录。详见BROWSER_REPORT。

工程检查不是专业人工审稿、学生试学或学习效果证明；所有真人与macOS欠账见REVIEW_PACKET。本轮审核对象/源码摘要绑定见REVIEW_BINDING，P14固定包不改。

干净候选由精确暂存树34da52a5f55046a93660779af1a2687c23256fc8导出，未带四份用户跟踪修改和七份附件。Windows tar首次解包将两个中文课程文件名误解码，导致候选缺模块；保留该失败目录，另建目录用Python UTF-8 tar读取，导出3058文件逐字节核对。未删除/覆盖旧目录、未改课程文件迎合错误。正确候选所有导出文件在完整检查后仍与暂存树相同。

候选typecheck、Lint零警告、372/372 Node、下载、126 Python块/10组对照、59课教学结构、Webpack86页生产build及110/110路由通过。原工作区373与候选372差异来自未暂存的用户原阅读测试增加1项，不把它当本轮提交。候选外部node_modules联接的默认Turbopack真实失败为工作区根外依赖限制；按本地Next CLI官方文档支持的--webpack构建通过，未改turbopack.root或用户环境，未声称Turbopack候选问题解决。公开仅保存必要脱敏失败摘要，机器日志留本机。

保护审计逐字节检查开工2998份跟踪文件：28份本轮既有授权文件改变，2970份保持原字节，含用户四份跟踪修改；七份原未跟踪内容也逐个字节/SHA不变。历史报告、curriculum、同源资源/下载、AI000/MA101/ML与第5章均保留。WORKSPACE_PROTECTION列脱敏别名和真实字节/SHA，完整私有路径只留忽略基线。最终Git与源码提交绑定由交付报告/REVIEW_BINDING及交付回复给出。

最终又同步了1.3现场指认与1.4共用记录两处答案措辞；更新完整摘要和新稿绑定，重新导出上述最终树、执行原工作区373项Node/生产构建及候选全部八门禁，结果仍通过。两处新措辞在原工作区与干净候选的真实生产UI复查，源码/对象摘要匹配。
