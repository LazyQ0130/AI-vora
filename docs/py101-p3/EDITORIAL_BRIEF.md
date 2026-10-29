# PY101 1.4课前编辑简报

2026-10-29，实际起点HEAD与origin/main均为b70eaab04b6be1f058a8c04ad59af17c7d790648。已fetch origin main；原有四份修改、附件及归属见BASELINE.json，不stash、不改写。现行标准为V1.0；V1.1仅建议稿。

```yaml
courseId: PY101
chapterId: PY101-C01
lessonId: PY101-C01-L04
audience: L1，已通过1.1–1.3操作，第一次接触项目环境
coreQuestion: 怎样为两个项目分别建环境，并从实际进程证明选对了项目Python？
prerequisites:
  - 1.1保存并运行.py：/learn/PY101/PY101-C01-L01#run-script
  - 1.2从cwd判断目标：/learn/PY101/PY101-C01-L02#same-name
  - 1.3保存状态、集成终端与解释器选择：/learn/PY101/PY101-C01-L03#select-interpreter
objectives:
  - 在两个独立项目内创建.venv，指出环境和基础Python的关系
  - 用各自环境解释器运行源码，取得路径/前缀/基础前缀/版本与输出证据
  - 辨认错误解释器，安全修复并保留前后真实记录
mainExample:
  scenario: 两个小项目以后可能需要不同的软件包，各自维护安装位置
  givens: python-projects/project-a与project-b，根目录main.py各一条print；相同基础Python
  expected: 两份环境prefix与executable不同，base_prefix与版本可相同；不安装第三方包或声称见到冲突
core:
  - 隔离需求→目录层级→venv创建→不激活直接调用→只读诊断→激活便利→VS Code选择→故障恢复
optional: []
assessmentMap:
  - objective: 1
    exerciseIds: [create-project-envs]
  - objective: 2
    exerciseIds: [create-project-envs]
  - objective: 3
    exerciseIds: [repair-wrong-env]
figures:
  - 零新增图片；目录树说明源码与环境并列，表格比较诊断字段
code:
  - 已知print短程序；整段提供observe_env.py，仅作观察工具，不考import/sys/变量/函数
references:
  - Python venv/sys和VS Code官方资料，访问与适用条件见SOURCE_FACTS.md
openQuestions:
  - 教师核查基础安装与venv边界，中文编辑核查四类路径负担，学生试学校准独立操作和提示使用
```

|目标|正文支点|核心任务与学生独立证据|提示/答案/rubric核查|
|---|---|---|---|
|1 创建两个环境|two-projects、create-envs|新练习位置、自选两项目和标记，创建命令/位置，源码在.venv外，关系解释|不以口述创建命令代替真实目录/执行|
|2 准确执行核验|direct-run、observe-env|运行前预测、两项目实际解释器/环境/基础位置/版本及stdout|提示二只列定位顺序，最终命令由学生选择|
|3 发现错误选择|recover-env|陌生workshop/report与tools/label布局；正确脚本由错误环境成功运行，再修复|排除保存、脚本、模块和版本差异；比较前后prefix而非只看输出|

核心范围仅venv与已有Python的关系、创建、直接调用、当前shell激活/退出、项目选择、恢复、可重建与忽略。Git只出现“.venv/写进忽略文件”的维护事实，不教提交流程。无依赖管理、Notebook、PATH/执行策略管理。PowerShell激活若受限，立即回到明确解释器路径，不绕过策略、不删旧环境。

编辑估计：阅读14–18、观察/比较6–10、独立代码操作20–30分钟，共40–58分钟；比蓝图30–50上限略高，原因是两个新环境、完整诊断及修复证据。不是学生实测。安装/权限/异常创建故障另计，不归入Python能力达标。

仅允许1.3 next-step最后状态段最小勘误；目标、核心题、解答、锚点、r1作用域保持。1.2已登记过时句不扩写。新课先draft/private，保存真实门禁后pending-review/preview；人工学科/中文审核和真实试学均待办。
