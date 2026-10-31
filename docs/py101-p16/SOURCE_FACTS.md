# 事实来源与复核

访问2026-10-31。Python官方版本路径3.14，网站本次返回3.14.10文档；实际作者解释器版本以PYTHON_RUNS为准，不把文档补丁号当运行版本。只独立改写事实，示例/题目为本项目原创教学代码；未复制官方整段示例/图片/文字，无第三方素材再分发。

| 事实 | 直接来源 | 具体核对与独立方法 | 结论/边界 |
| --- | --- | --- | --- |
| if选择执行语句块，else不是必需 | https://docs.python.org/3.14/tutorial/controlflow.html#if-statements | 官方if节与下行语句路径，作者保存5/7/6三版文件验证 | 已核；只采用单if，不搬入教程elif全集 |
| 条件为真执行suite，为假无匹配分支则跳过 | https://docs.python.org/3.14/reference/compound_stmts.html#if | 读取if语义与suite定义，独立按<=算三值预期 | 已核；块外后续在本课正常执行中继续 |
| 头部冒号、缩进决定语句分组 | https://docs.python.org/3.14/reference/compound_stmts.html | 头部以冒号结尾，后续缩进语句组成suite；两行块与单行移动对照 | 已核；本课只多行形式，不断言Python只允许这种写法 |
| 行首空白有语法意义 | https://docs.python.org/3.14/reference/lexical_analysis.html#indentation | 读取indentation段；保存后重读四空格、网页复制后核字节并重跑 | 官方事实已核，复制运行的结果见BROWSER_REPORT/PYTHON_RUNS |
| 四空格是本课统一写法 | https://docs.python.org/3.14/tutorial/controlflow.html#intermezzo-coding-style | 区分风格建议与语法；同一块保持一致，不混Tab/空格 | 不声称语法规定只能4格 |
| 比较的bool可用于条件，不等于系统讲解所有对象真值 | https://docs.python.org/3.14/library/stdtypes.html#truth-value-testing | 只核True/False条件意义，与数值比较节对照 | 不引入0/空串/列表真值 |
| <=包含相等，5/6/7对6为真/真/假 | https://docs.python.org/3.14/reference/expressions.html#comparisons | 从整数大小独立预解，作者真实三轮核对 | 不是把页面结果回读成预期 |
| 章节事实/项目 | curriculum/AI技术课程目录_V1.0.json；curriculum/AI技术课程体系_V1.0.md @3b06e11259d01f041ff9eb384b51d79626f6ebb5 | 比对章3/4/5与最终项目，六节r2实际先修 | 不改curriculum；列表依赖见决定表 |
| 状态/路由/版本 | src/content/models.ts；src/lib/course-engine.ts；src/lib/course-directory.ts | draft真实resolve/href与生产404，r2 scope前后全对象比较 | 技术证据不替代专业审核 |

尚待人工：教学顺序、目标任务效度、中文表述及最小列表桥接的负担。3.1无待核技术事实阻断；macOS命令依据现行教材与文档核对，未在macOS实机运行。
