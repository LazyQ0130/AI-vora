# P7 事实来源与独立核对

访问/校验日期2026-10-30。官方版本化Python页面当前标题为3.14.10；本机实跑为Windows CPython **3.14.2**，二者不混称。下列资料仅链接参考、概括语义；没有翻译拼接长文或复用外部图片/数据，新增中文说明与蓝图短例为本轮教学构造。AI回答不是独立事实来源。

| 对象/事实 | 官方或仓库来源 | 独立核对与范围 |
| --- | --- | --- |
| 第二章章名、总章数/学时、最终项目 | curriculum/AI技术课程目录_V1.0.json与AI技术课程体系_V1.0.md，基线e12a194 | 保持02“变量、基本类型、表达式与输入输出”、10章、26–36小时与原项目；不据节级编辑估时改原事实 |
| 第一章已教与仅观察 | 六节现行Lesson及P6 PREREQUISITE_TRACE/CROSS_LESSON_AUDIT | 1.5最小赋值并非完整变量课；import/sys仍为现成诊断，未当作学生能写模块 |
| 名称字符、大小写及保留词 | [Python3.14词法：名称与关键字](https://docs.python.org/3.14/reference/lexical_analysis.html#identifiers) | 确认数字不作首字符、名称区分大小写、for/class为关键字；下划线开头及部分非ASCII名称也可合法。本课英文字母建议非合法全集，未扩写Unicode/软关键字规则 |
| 名称绑定与读取 | [赋值语句](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements)、[表达式中的名称](https://docs.python.org/3.14/reference/expressions.html#identifiers-names) | 赋值可重新绑定，未绑定读取为NameError。2.1主例/反例实际实跑；没有把变量说成永远固定类型的盒子 |
| 数值、四则与括号 | [Python入门：计算器](https://docs.python.org/3.14/tutorial/introduction.html#using-python-as-a-calculator) | 独立手算2.3的16/24/4.0，再用真实Python核对；本章后续不依赖可选//、%、** |
| 比较表达式 | [值比较](https://docs.python.org/3.14/reference/expressions.html#value-comparisons) | 整数边界5/6/7与limit6逐次执行；与赋值区别，未提前使用if或布尔组合控制流 |
| input、int、float、type | [内置功能](https://docs.python.org/3.14/library/functions.html) | input返回str且提示写stdout；给定整数字符串转换与小数转换后计算，错误格式int('4.5')实际ValueError。type输出仅识别类型，不要求class定义 |
| 最小f-string | [格式化字符串字面量](https://docs.python.org/3.14/tutorial/inputoutput.html#formatted-string-literals) | 2.6只插入已有名称；真实输入计算/输出6.0及边界10.0，未把复杂格式语言列核心 |
| 内容版本/进度/发布 | docs/COURSE_AUTHORING.md、PRODUCTION_WORKFLOW与当前models/learning-progress | 补有效输入说明但原题/目标/达标不变，精确对象比较支持r1；无reviewEvidence、无第二章注册 |

实际执行记录：NAME_RUNS.json覆盖9个合法/非法/大小写情景；BLUEPRINT_RUNS.json从Markdown提取9段例子并执行，另5个恢复/边界变体。预期先由输入与语义推得，再核对退出状态、stdout和错误类型；未用回读答案文字替代运行。

重定向stdin不会像真人终端那样回显键盘输入，因此自动记录中提示可能连在同一stdout行；记录同时保留stdin与stdout，不据此改写学生看到的交互说明。示例的其他版本/平台行为未实测；macOS仍需真机验证。技术成功不证明学生独立选名或学习难度已验证。
