# 代码先修审计与P4决定

2026-10-29，检查现行first-run、script-paths、editor-rerun、project-environments、notebook-cell-order及其python-*资源；基线对象/文件摘要保存在BASELINE.json。历史正文不是根据课名推断。

|内容|真实先修位置|本轮可要求的能力|
|---|---|---|
|print、引号里的字符串|1.1 run-script及独立题；1.2/1.3保存重跑|已教，可独立改短文字并运行|
|最小名称赋值、print(名称)|1.5 first-cells，先解释后预测/执行，随后两题|已教最小实验，可复用；不是完整变量课程|
|import sys|1.4 observe-env；1.5 kernel-check|仅观察工具，复制后运行，不要求独立编写import|
|sys.executable/prefix/base_prefix/version.split()[0]|1.4现成environmentProbe|仅观察；解释路径/版本字段，点号、调用、下标语法尚未系统教|
|内核保存名字、编辑/保存不执行、重启/Run All|1.5 stale-state/restart-order/clean-run|已教，可实际控制与解释|
|NameError|1.5 restart-order|已教当前内核未定义名称这一情境；未教异常处理|
|Shell命令与Python源码|1.1终端/解释器，1.2路径，1.3运行入口，1.4显式环境命令|已教，分别指定编辑器/终端/Notebook；本轮最小新增退出状态观察先解释再用|
|函数/循环/条件/文件API/os/pathlib/subprocess/字典/JSON|未正式教授|不得成为本轮学生核心要求；作者验证工具可用|

P4原文位置：notebook-cell-order.ts / first-cells，在两格代码之后、首次预测运行及独立练习之前：

> 这里只临时认识一种新写法：marker是当前运行内核暂时记住的名字，等号让它对应右边的文字。print(marker)显示这个名字此刻对应的内容，引号里的Draft A仍是已学过的字符串。完整变量、类型和赋值规则在后续章节学习。

结论：名字、赋值、字符串、读取均已有足够的最小解释，不增加P4教学段落。P5第一次复用时一句话回顾；观察工具说明用途、位置、观察字段及不要求独立编写的语法。只允许1.5最后过时状态段勘误；核心考核、锚点及r1进度保持。
