# P18 生产浏览器验收

2026-10-31，Windows内置Chromium，隔离候选的next start/3008生产服务，非开发模式。候选排除原用户4份修改与7份未跟踪文件，最终348份src/scripts/tests/curriculum源码与工作区对应，文本仅规范化换行比较，原文件保护另用原字节SHA。模拟视口不等于实体设备或学生试学。

先draft/private：Webpack生产88页，3.3统一404，目录无阅读地址；DRAFT_GATE/DRAFT_HTTP_GATE、113项全站生产HTTP及draft-404.png保留。仅候选副本转preview供交互验收，Webpack89页；工作区在必要生产检查、复制实跑与完整重载检查完成后才开放pending-review/preview。没有人工审核签署。

| 视口 | 实际观察 | 证据 |
| --- | --- | --- |
| 1440×1000 | 3.3标题/身份、三目标、两核心题；两题各两个提示及解答/rubric展开，and主例括号/冒号/4空格与块外结束 | desktop-1440.png、BROWSER_CHECKS |
| 768×1024 | Drawer呈现三目标/两题，题二入口关闭面板、hash为exercise-diagnose-connector，H3实际聚焦 | tablet-768.png、tabletFocus记录 |
| 390×844 | or完整程序与预期输出可读，正常not段落和两题内容可访问，代码行首/空格保留，宽内容局部区域承载 | mobile-390.png、宽度/区域度量 |
| 320×812 | 九节点文章目录展开，五组边界表定位，H2聚焦；真实水平滚轮使表内scrollLeft由0到76、再回0，正文另正常向下滚动 | narrow-320.png、horizontalScrollVerified |

四宽document.scrollWidth为1425/753/375/305，均不大于innerWidth；截图可能不含浏览器滚动条，视口以实测值为准。窄表/代码容器overflow-x:auto，不缩小整页。参考核对锚点实际展开verification。11份显示的Python源码按可见token重建（仅将Prism空行占位还原为空行）与登记资源逐字相同，DOM_SOURCE_MATCH；这项与真实Copy证据明确区分。

Copy使用页面真实按钮和剪贴板，不从DOM代替。and主例首次读到P17旧三档代码，检查发现不含当前组合，未保存为通过；稳定代码框后再次点击，才取得quantity_range.py实际源码。错误or程序一次取得当前完整源码。两份分别保存copied-and-main.py/copied-or-fault.py，与登记源逐字符相同，再启动新CPython执行，均输出Quantity ready、Check finished。第二份是可运行的错误放行，businessCorrect=false，不能因为exit0称为业务正确。COPIED_CODE_RUNS含原文件源码/SHA、预解、实际stdout/stderr/exit/PID/cwd/命令。

导航：真实从3.2的下一节入口进入3.3，3.3上一节为3.2；现有第五章课时仍由统一导航在未制作章节后衔接。课程详情真实显示“本课程正在筹备”。浏览器看到错误ML201归属及未制作3.4统一404；3.4–3.8和两个错误归属全部由10项生产HTTP门禁验证。纯教材阶段console error为空，随后预期404另计。

进度只在隔离3008来源用正常UI操作：建立2.4/r2、3.1/r1、3.2/r1读完记录，3.3仍未标记读完。完整导航离开、无hash重开并等阅读器挂载后，“回到上次位置”为#short-circuit；在页面顶部完整reload后仍为该href，点击能聚焦对应H2。再次逐一打开三旧课，已读完按钮保持，新3.3不继承完成。未读取/注入/清空原用户3000来源存储；全部历史r1/r2字符串由专项内存存储测试补足，不声称浏览器包含所有用户的历史数据。

## 保留的时序观察

快速SPA站内往返时曾读到#reverse-result，紧接reload读到#separate-checks；这些不列为通过。进一步观察到导航点击后，焦点先变化而平滑滚动和450ms书签保存尚未完成；待页面可见恢复入口确认为#short-circuit，再用完整文档导航/重新挂载及独立reload，均成功恢复。后一组完整导航结果不能证明所有SPA时序已修复，因此BROWSER_CHECKS同时保留失败读数和成功路径，未覆盖初次记录。

本轮不修改原用户Reader/进度文件，也不宣称已定位或修复SPA现象根因。建议另行在授权Reader任务中复核快速站内导航、平滑滚动与卸载保存的组合。当前证据支持完整导航/重载的r1持久化，不作更宽泛保证。两个自动化定位曾因summary带“9节点”、课程链接含“未读完”图标名称而未匹配，均重新观察实际可访问名称后完成，未改产品以迎合选择器。

教师、中文教学编辑、真实目标学生试学、macOS实机和实体移动设备仍未完成。浏览器读完操作仅为进度测试，不代表学生掌握。
