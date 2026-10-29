# 两类真实浏览器验收

2026-10-29。Jupyter本地浏览器与Aivora生产教材是两类独立证据。前者见[JUPYTER_VALIDATION.md](JUPYTER_VALIDATION.md)，后者结构化记录为BROWSER_RESULTS.json；不互相冒充。

## A. 真实Jupyter

Notebook7.6.3本地服务localhost:8888，保留token保护。真实新建、Markdown/Code、命名、内核选择界面、sys.executable、顺序输出、改文本不执行仍旧值、重启倒序NameError、恢复与Restart and Run All均实际操作；保存文件、关闭后重开、再次重启全跑并保存；关闭Notebook会话，Running内核行0。补验File → Shut Down显示Server stopped、启动终端退出0，所有本轮服务/内核停止。详见GUI JSON/AX、磁盘脱敏副本和4张jupyter-*.jpg；这些是实际界面，不是Aivora内置执行器。GUI默认视口较窄，未声称另测Jupyter四档布局。

## B. Aivora生产教材

地址http://127.0.0.1:3005/learn/PY101/PY101-C01-L05，最终79页生产构建。不是next dev或静态HTML检查。

|项目|实际操作和结果|
|---|---|
|桌面1440×1000|标题、3目标、2题、待审核试读和分项估时可见；最终文档宽1425|
|平板768×1024|正文宽753，章节抽屉显示10章和1.6筹备槽，1.6链接数量0|
|手机390×844|正文宽375；打开本节导航，点击故障题跳到#exercise-recover-cell-order，抽屉关闭|
|320×844|初次长下载标签造成337px整页溢出；按钮改为文件名、用途留描述后重构建，最终宽305、答案溢出项0；最终补充后的短观察、重开要求与三项details均可见/展开|
|长命令横滚|Windows启动块可视254/内容417，实际按右方向键滚动至scrollLeft120；macOS块254/332；均overflow-x:auto，不改反斜杠/引号或折行源码|
|复制粘贴|实际点击并等待复制反馈，Ctrl+V至练习框；Windows逐字符为& ".\.venv\Scripts\python.exe" -m jupyter notebook，macOS为./.venv/bin/python -m jupyter notebook；均匹配，核对后清空本次输入|
|下载|分别实际点击两份Notebook下载，读取真实下载文件，格式4、3个Code格、空输出/null计数；代码与同源资源一致，格式及干净运行另由真实内核校验|
|练习/Quiz|两题两级提示、解答与rubric实际展开；Quiz错误选择显示“再想一想”，改正确显示“理解正确”|
|目录/相邻课|安装与启动锚点正确；1.5上一节进入1.4，再由下一节回1.5；1.5的技术下一节按现行机制跳5.1，正文保留前序基础提醒|
|进度与重载|通过旧课真实导航产生1.4记录，在返回1.5后取对照；手动标记1.5读完、刷新等待hydration，恢复已读；旧1.4原始存储字符串不变，变化键[]；新scope=PY101-C01-L05:r1|
|404/整课|实际打开ML201归属L05和PY101-L06，均404标题；HTTP检查104/104另证状态码。PY101课程页仍筹备、10章、26–36小时|

截图browser-desktop/tablet/mobile/narrow.jpg均为最终成稿生产页面；临时视口覆盖完成后已reset，试读页作为交付标签保留。第一次剪贴板即时读取为旧值，等待“已复制”反馈后重试再核对真实粘贴，未将旧值记为通过。重构建刷新后一次summary点击定位失效，重新观察closed状态后成功；最终刷新等待持久化已读状态完成hydration再操作。

DOM/CDP求值只读宽度、内容、details状态和现有进度；没有注入代码修改页面、设置/清空localStorage或伪造进度。实际相邻导航会更新访问课的阅读位置，对照在这些操作结束后采集，不把有意旧课访问误报为1.5覆盖。视口模拟不等于实体手机或学生试学；网页标记只证明阅读交互，不证明学生独立完成本地两题。
