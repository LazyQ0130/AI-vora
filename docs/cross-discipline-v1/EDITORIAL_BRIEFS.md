# 跨学科三篇样章编辑简报

2026-10-26。基线为 `acefc4b` 的实际注册教材。修改前的取证与计划见 [问题清单](AUDIT_BEFORE.md) 和 [改前全文](BEFORE.json)；本文件按编辑规范第12节将其结构化归档，并补齐实施后的实际练习ID和映射，不冒充旧版课程写作时已有的简报，也不是学生试学结果。规范全文继续只有 [V1.0](../COURSE_EDITORIAL_STANDARD_V1.md) 一份。

## 数学：MA101 2.1

```yaml
courseId: MA101
chapterId: MA101-C02
lessonId: MA101-C02-L03
audience: L1，初次接触位移向量，知道方向与整数加减
coreQuestion: 换一组起终点，能否算出整体变化并判断两个位移相等？
prerequisites:
  - 东西南北、数格子与整数加减；原自查保留
  - 不把尚未制作的本地算术章节写成补修正文
objectives:
  - 判断标量或向量并说明依据
  - 区分整体位移与路线、路程
  - 通过平移和两个方向的变化判断位移相等
mainExample:
  scenario: 沿用教学构造的配送位移，不新增故事
  givens: 东/北为正，坐标单位米，正文u=(3,2)
  expected: 新题A和B均为(2,3)，C为(-2,-3)
core:
  - 原有问题、箭头、坐标、平移、零位移及熟例自查保留
  - 新题前解释终点数减起点数及“分量”在本题的具体含义
  - 不要求数乘记号、长度公式或勾股计算
optional:
  - 原route-record挑战保留
assessmentMap:
  - objective: 1
    exerciseIds: [quantity-choice]
  - objective: 2
    exerciseIds: [quantity-choice, same-displacement]
  - objective: 3
    exerciseIds: [same-displacement, displacement-transfer]
figures:
  - 保留原等比例SVG，起终点(0,0)到(3,2)、(1,1)到(4,3)
code:
  - 不适用，数学核心不新增Python
references:
  - 现有课程事实及OpenStax平面向量定义；新题由整数坐标差独立核对
openQuestions:
  - 学生是否会抄终点、反向相减或忽略方向，待真实作答观察
  - 核心任务增加，r2独立记录；旧r1不删除也不当新版完成
```

## Python：PY101 5.1

```yaml
courseId: PY101
chapterId: PY101-C05
lessonId: PY101-C05-L01
audience: L1，已能运行Python、会变量与乘法，第一次学函数
coreQuestion: 怎样把一次数值计算保存成可接受不同输入的函数？
prerequisites:
  - 本机Python3.10+，无第三方库，变量赋值和数值乘法
  - 本地环境/变量课尚未制作，使用真实Python官方补修链接
objectives:
  - 按执行顺序解释定义与调用
  - 独立写接收数值并返回计算结果的单参数函数
mainExample:
  scenario: 把3、4、7乘2，不增加业务情节
  givens: 普通三行输入/处理/显示，继而定义double，再展示完整调用
  expected: 普通版输出6，单独定义无输出，完整调用输出6
core:
  - 解释def、名字、括号、冒号、缩进、形参/实参、return、接收变量和print
  - 保留define-double熟例；新增分钟换秒的独立实现和先预测再运行
  - 按学科条件修正共享工厂的错误数学先修说明
optional:
  - defaults旧锚点和链接保留为可选衔接
  - 原完整代码、断言与下载继续在verification
assessmentMap:
  - objective: 1
    exerciseIds: [define-double]
  - objective: 2
    exerciseIds: [minutes-to-seconds]
figures:
  - 原3到value到6到result的流程图，图注只解释实际流程
code:
  - 两个渐进片段在本机单独运行，原function_basics核心与下载同源不变
  - 新任务2分钟为120秒、0.5分钟为30秒、0分钟为0秒
references:
  - Python3.14官方定义函数、解释器及数值教程，2026-10-26核对，仅链接参考
openQuestions:
  - 真实学生能否在空白处写新函数、区分只定义与调用，尚待试学
  - 目标与核心任务改变，r2隔离原r1完成；时间仍为待校准编辑估计
```

## 机器学习：ML201 4.3

```yaml
courseId: ML201
chapterId: ML201-C04
lessonId: ML201-C04-L04
audience: L2，第一次把已学模型、MSE与两个梯度连成一次完整更新
coreQuestion: 怎样用同一组旧误差同步更新两个参数，再重新计算损失？
prerequisites:
  - 3.2模型、3.3平均损失与列表配对、4.2梯度公式，均有真实正文回链
  - 代码沿用3.3已解释的zip、推导式、sum和len，不误称5.1教过这些语法
objectives:
  - 逐样本计算误差、平方与梯度贡献
  - 同步更新并重算损失
  - 用反例定位归一化与顺序更新错误
mainExample:
  scenario: 沿用同系列合成传感器数据的两个点
  givens: x=[1,2]，y=[3,5]，无量纲，w=b=0，学习率0.1，完整平均MSE
  expected: dw=-13，db=-8，新w=1.3，新b=0.8，新MSE=1.685
core:
  - 保留逐样本表、公式、图和错误反例
  - 对照手算量解释errors、old_loss、dw/db、同步赋值、new_errors/new_loss
  - 核心代码只保留原计算链与输出，先按手算预测输出
optional:
  - 原断言、对照循环和浮点容差移到verification，完整代码与核心同源
assessmentMap:
  - objective: 1
    exerciseIds: [hand-update]
  - objective: 2
    exerciseIds: [hand-update]
  - objective: 3
    exerciseIds: [sequential, repeat-data]
figures:
  - 原两点(1,3)/(2,5)、旧线0、新线1.3x+0.8，保留桌面/手机图
code:
  - Python3.10+标准库，本地one_update.py；完整检查为同一核心加原断言
  - 新目标[2,4]首步w=1、b=0.6、MSE=1.06；复制数据均值不变
references:
  - Google线性回归梯度下降、Python3.14配对及推导式官方说明，2026-10-26核对
openQuestions:
  - 人工检查手算到代码对应是否足够，真实学生是否会混用新旧误差
  - 核心目标、算法和任务不变，保留r1；不把训练损失降低当作泛化证据
```

## 事实来源与复用方式

| 来源 | 访问/版本与核对点 | 复用方式 |
| --- | --- | --- |
| `curriculum/`、现行蓝图、注册器和发布清单 | V1.0事实、基线acefc4b，核对MA/PY/ML层级、先修、课时和显示编号 | 只沿用现有事实，不改课程数量 |
| [OpenStax 平面向量](https://openstax.org/books/calculus-volume-3/pages/2-1-vectors-in-the-plane) | 2026-10-26已核对自由向量相等与反向；新坐标另算 | 只参考链接与数学规则，未复制文字或配图 |
| [Python3.14 函数](https://docs.python.org/3.14/tutorial/controlflow.html#defining-functions)、[解释器](https://docs.python.org/3.14/tutorial/interpreter.html)、[数值](https://docs.python.org/3.14/tutorial/introduction.html#numbers) | 2026-10-26，核对定义/调用/返回、缩进及本地运行；实测解释器版本另见测试证据 | 使用仓库原函数与新写的单位换算例子，不复制教程源码 |
| [Python3.14 zip](https://docs.python.org/3.14/library/functions.html#zip)、[列表推导式](https://docs.python.org/3.14/tutorial/datastructures.html#list-comprehensions) | 2026-10-26，核对配对和逐项计算；回查本地3.3确已解释 | 只链接，不要求学生在本课重学整套语法 |
| [Google 梯度下降](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent) | 2026-10-26，核对完整平均MSE下的两个偏导与更新；本课数值独立精确求解 | 不复制外部正文、图、代码或数据；保留原合成案例 |

本轮无第三方素材再分发。将来若复用原文、代码、图片或数据，仍须单独核查许可，不能从“可公开阅读”推断可商业再用。
