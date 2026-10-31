# P17 生产浏览器验收

2026-10-31，Windows内置Chromium，隔离候选的`next start`生产服务，非开发模式。候选排除原用户4份修改与7份未跟踪；341份src/scripts/tests/curriculum及新增源码与最终工作区规范化换行后相同，原用户保护另做逐字节比较。没有将模拟视口称为实体设备或学生试学。

实际draft/private先用Webpack生产构建：3.2统一404、目录无阅读链接，DRAFT_GATE/DRAFT_HTTP_GATE/DRAFT_ROUTE_RESULTS及draft-404.png保留。之后只候选副本开放preview完成下列交互；浏览器与复制文件运行通过后，工作区才转pending-review/preview。

| 视口 | 真实检查 | 留存 |
| --- | --- | --- |
| 1440×1000 | else/elif在完整代码前已解释；九段顺序、三目标/两代码题；两题双提示/解答/rubric逐个展开；两路/三路Copy | desktop-1440.png、BROWSER_CHECKS |
| 768×1024 | 宽度变化后已展开答案保持；Drawer呈现三目标/两题，点击题二关闭面板、URL更新、标题聚焦 | tablet-768.png、hash/focus记录 |
| 390×844 | if/elif/else同层、体内四空格；主例再次Copy与桌面逐字符相同；两题已展开内容无整页溢出 | mobile-390.png |
| 320×812 | 完整九节点文章目录展开，三档表锚点定位/聚焦；少等超三行读数正确；参考锚点自动展开verification | narrow-320.png |

四宽document.scrollWidth均不超过innerWidth，表/代码可局部滚动，不缩小整页字体。截图可不含浏览器滚动条，视口以DOM读数为准。两题展开后在尺寸变化中保留状态，未为每个尺寸重复截图全部长答案。

Copy验证使用真正的页面按钮和剪贴板。首次读到上一轮旧剪贴板源码时，校验发现不含当前else段，停止保存；重新观察按钮，在稳定的代码框重试后取得正确新内容。最终two_way与three_way两份分别保存到copied-two-way.py/copied-three-way.py，逐字符与已登记源码比较，再调用真实CPython执行。COPIED_CODE_RUNS保留源码/SHA、命令/cwd、预期/实际stdout/stderr和退出：两路5输出Within limit/Check finished，三路6输出At limit/Check finished。没有只从DOM提取字符串冒充复制。

导航与进度：通过3.1“下一节·3.2”进入，新页显示未读完，旧3.1仍已读完。用3.2顶部入口定位first-match，等滚动稳定后离开到课程页，再无hash重开；“回到上次位置”的href为#first-match。明确reload后仍为该href，点击能聚焦对应标题；新课没有继承完成。再通过“上一节·3.1”返回，旧r1完成状态保持。所有操作在隔离3007来源，未访问/注入/清空原用户3000来源存储。测试读完标记由普通UI建立，不是学生掌握证据；所有旧修订字符串的逐字节隔离由专项存储单测补足，不声称浏览器有所有用户的旧记录。

课程详情实际显示“本课程正在筹备”与26–36小时原事实。错误ML201归属、未制作3.3均在浏览器看到统一404；3.3–3.8全部地址另由生产专项HTTP验证。3.1旧锚点和正文保持原对象，P16历史断言继续通过。

纯教材检查阶段浏览器console error为空。目录跳转后读取hash/focus、复制后读取成功态、尺寸变化后再截图，避免把尚未完成的滚动/剪贴板状态写成已通过。唯一复制旧值已如实登记，未因此修改Reader、样式或用户文件。教师、中文编辑、学生试学和macOS实机均未完成。
