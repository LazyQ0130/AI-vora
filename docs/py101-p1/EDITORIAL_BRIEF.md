# PY101 1.2课前编辑简报与目标映射

2026-10-29（Asia/Shanghai），基线 `1fd65b923ee4a535fac140dd28d0fceae1a19ae9`。fetch后HEAD/main/origin/main一致；原4个跟踪修改和未跟踪附件见BASELINE_STATUS.txt。只制作PY101-C01-L02 r1，不改六节蓝图，不生成1.3。

```yaml
courseId: PY101
chapterId: PY101-C01
lessonId: PY101-C01-L02
audience: 完成1.1但尚不理解相对路径如何定位的零基础学生
coreQuestion: 给定当前目录和命令，怎样知道实际运行的是哪份文件，并准确运行想要的那一份？
prerequisites:
  - 能打开终端，使用1.1确定的python、py或python3
  - 能保存.py、改print、cd、pwd、dir或ls；补修只链接1.1真实锚点
objectives:
  - 根据当前工作目录和相对路径指出实际目标文件，并用运行结果核对判断
  - 从两个不同工作目录准确执行同一目标脚本，记录路径、预测与实际输出
  - 识别同名文件或空格传参导致的问题，说明原因并验证修复
mainExample:
  sequence: 先path-lab/alpha/run.py，再加beta/run.py，最后加my scripts/run.py
  expected: Alpha A1、Beta B2、Space S3；缺失目标无正常输出
core:
  - 当前目录是起点；逐段走相对路径；点与两点；同名不同文件
  - 绝对路径跨目录执行；引号把带空格路径作为一个参数；运行不替父终端切目录
optional:
  - 不设置进阶区；内部验证脚本不进入学生教程
assessmentMap:
  - objective: 1
    exerciseIds: [trace-target]
  - objective: 2
    exerciseIds: [same-target-two-starts]
  - objective: 3
    exerciseIds: [trace-target, same-target-two-starts]
figures:
  - 零图；目录树和操作/预期表足以定位文件；窄屏代码局部滚动
code:
  - 仅print，受支持Python 3.x，无第三方依赖
references:
  - Python命令行、Microsoft路径/引用规则、zsh官方手册；见SOURCES.md
openQuestions:
  - macOS命令经官方规则核对，尚无macOS实机
  - 无人补讲能否独立按两点返回上级，仍待试学
```

| 正式目标 | 正文支点section.id | 核心题 | 学生独立证据 | 提示与反馈边界 |
| --- | --- | --- | --- | --- |
| 1 从目录/相对路径判断目标 | one-file、relative-route、same-name | trace-target | 新east/west布局的三条命令，运行前写完整目标/失败预测，实跑比对 | 一级找起点；二级逐段记候选；不提前指出east或west答案 |
| 2 两个起点运行同一文件 | absolute-target、space-argument、script-and-cwd | same-target-two-starts | 两个真实pwd、执行命令、目标完整位置、预测与实际输出，解释路径为何仍指向同一文件 | 接受相对/绝对路径或先cd；记录切换后的实际执行目录，不能声称两个相同执行目录是两个起点的直接运行 |
| 3 同名与空格故障恢复 | same-name、space-argument、check-path | 两题 | 题一指出不同同名文件；题二有未加引号的失败及加引号后的成功，学生自选第二行标记 | 引号只分组参数、不改名；源码标记只是交叉核对，必须结合pwd/路径/清单 |

先预测后运行，核心题记录用短表，不要求环境诊断长报告。Quiz只检验「运行脚本是否会自动cd」；不承担正式目标。

## 与相邻课的边界

1.1的版本检查、保存方法和安装不再重讲，只提供`#save-script`、`#run-script`补修。当前目录首次回顾一句，随后用新布局研究定位。1.3将讲编辑器/IDE、项目文件夹、解释器选择与集成终端，本课只保留既有编辑工具。不讲sys.path、import、包、venv、os、pathlib、subprocess或完整系统PATH。

本节不提供下载：学生沿用1.1的文件创建能力，分步保存三个单行主例和新题文件；目录结构是学习证据的一部分。源码集中在`resources/python-paths.ts`供正文和开发验证共享，不新增资源系统或依赖。仍执行prepare:downloads并检查原32个下载文件不变。

时间：阅读10–15、练习6–10、代码实践15–25分钟（编辑估计，暂未试学校准）。故障恢复另预留5–15分钟，不重新安装软件；与蓝图中25–40分钟的初拟相比，现按两道真实操作与记录分项估为31–50分钟，蓝图历史不改写、不改变课程26–36小时事实。
