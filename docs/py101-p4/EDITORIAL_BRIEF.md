# PY101 1.5课前编辑简报

2026-10-29，fetch后HEAD=origin/main=8f3fd1f814651828c548b8875a2121c4dda1328f。BASELINE.json保存51份现行Lesson、2624个原跟踪文件和7份原未跟踪文件摘要；四份原有修改不暂存。现行教学标准为V1.0，建议稿不替代它。

读者为已完成1.1–1.4本地操作、第一次接触Jupyter的L1学生。核心疑问：为什么旧输出还在、重启后单独运行一格却失败，怎样让保存的Notebook从干净内核按文档顺序重跑？前置链接为1.1#run-script、1.2#relative-route、1.3#save-rerun、1.4#observe-env，不重讲安装Python、路径和虚拟环境全流程。

|正式可观察目标|正文支点|核心题|学生独立证据|
|---|---|---|---|
|1 在指定环境启动本地Notebook，确认内核，创建文字/代码单元格并保存|local-start、first-cells、kernel-check|create-own-notebook|自选文件/名字/标记、Markdown、实际环境路径、顺序运行输出与.ipynb|
|2 预测并观察旧状态/乱序失败，解释原因并安全恢复|stale-state、restart-order|recover-cell-order|预测、真实执行顺序、NameError、原因、重启与恢复输出|
|3 保存并证明新内核能按文档顺序重跑|clean-run、save-stop|create-own-notebook和recover-cell-order|实际文件，重新打开/确认内核，明确重启后完整运行的结果，保存记录|

案例：first-notebook.ipynb，Markdown说明，marker="Draft A"和print(marker)分两格；改为Ready B但不执行得到Draft A，再执行两格得到Ready B；重启后先显示格得到NameError，按文档顺序恢复。现成import sys/print(sys.executable)单独一格，只复用路径观察，不考其语法。唯一临时新语法为最小名字赋值，不引入类型/作用域/循环/函数。

顺序为需求→项目环境安装与本地服务→创建/命名/Markdown→两格运行→三对象区分及内核核验→改文本与旧状态→重启乱序→从头运行与保存→关闭会话/停止服务→两道新题。术语在实际观察时引入，不先放菜单大全。安装仅目标环境pip install notebook，联网与异常等待另计；本轮开发环境放在仓库外全新临时项目，不安装到Node工程或用户已有环境。

两题分别自创不同名称和短文字；物流任务使用delivery_note与Packed C7，按题目给的环境/保存条件控制为单一顺序故障，题干不给修复顺序。提示一指观察对象，提示二指提供名字的格与干净核验，最终操作仍由学生做。参考答案含原因、常错、等价方案和可核验rubric。

技术选择：浏览器Jupyter Notebook为唯一主界面；具体版本/菜单以实际安装GUI为准。沿用Lesson/阅读器/发布/进度，状态代码以明确单元格执行计划验证，不误当独立脚本。若加下载，仅扩展既有prepare-downloads写出少量同源Notebook，输出空、execution_count=null、无路径/token；独立题仍须自己创建或修改。无站内执行器、配图、模型API或远程服务。

预计阅读12–18、观察练习6–10、Notebook操作20–30分钟，共38–58分钟，basis=editorial-estimate，安装与异常处理另计；待试学校准。专业审核关注内核身份/保存语义/顺序和安全停服；中文编辑关注文件、服务器、内核三层关系和新术语负担；目标试学观察预测、提示使用、重启证据和真实分项耗时。三类真人工作均未完成。

只允许1.4最后状态段最小勘误，核心/锚点/旧r1不变。1.2旧句不扩写；1.6不制作，整课PY101仍planned。

成稿目标复核补充：第二题加入一次很短的“改赋值文字但不执行”预测/观察，再要求重新打开、确认内核和干净全跑；让目标2的旧状态解释、目标3的重开核验都有独立题证据。仍控制为状态/顺序同一问题，不混入环境或缺包。38–58分钟估计保留待试学，未按字数变化机械调整。
