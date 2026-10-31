# P17 官方事实与来源

访问日期2026-10-31。官方URL版本路径为3.14，本次返回3.14.10文档；本机解释器以真实运行记录为准，二者不混称。正文为独立中文讲解及原创短例，无官方大段翻译/拼接，无图片或第三方代码再分发。

| 事实 | 来源与核对位置 | 独立方法/复用 | 结论 |
| --- | --- | --- | --- |
| if/elif依序求值，首个真分支执行，余下不再求值；都假才走else | https://docs.python.org/3.14/reference/compound_stmts.html#if ，8.1 | 按整数关系预解；输出对照和作者trace两轮实际行记录 | 已核；不要把“==数学上真”说成本轮实际已检查 |
| else是同一选择链的一部分且无自己的条件；elif有条件 | 同上if语法及https://docs.python.org/3.14/tutorial/controlflow.html#if-statements | 逐行审阅同源两路/三路代码；不搬入教程其他控制结构 | 已核；不等于异常处理/自动重试 |
| 同层子句头以冒号结尾，各自控制缩进语句组 | https://docs.python.org/3.14/reference/compound_stmts.html | 核suite与clause说明，完整源码与复制落盘重读 | 已核；多行写法是本课统一形式 |
| 行首空白决定语句分组 | https://docs.python.org/3.14/reference/lexical_analysis.html#indentation ，2.1.8 | if/elif/else行首对齐、体内4空格；网页Copy后实际执行 | 官方已核，浏览器实证完成后见报告；4空格为本课规范非唯一语法数值 |
| 普通整数<与==区分少于/相等；<=含相等 | https://docs.python.org/3.14/reference/expressions.html#comparisons | 从5<6、6==6、7>6预解，不从stdout回填 | 已核，先修2.4/r2可访问 |
| 两个独立if分别检查 | if语义与两条语句的顺序；3.1现稿 | 同一等值数据执行两个if与选择链 | 已核；独立事实可以用多个if，不能泛化“总应elif” |
| 课程章名/范围/项目 | curriculum两份V1.0 @47a8b740d166fe5dcd2241fb2178891872ec5cf8 | 核PY101第三章、第四/五章后置内容、原26–36小时 | 不改课程体系或P16蓝图 |
| 当前先修与进度/发布门禁 | 3.1/r1、2.4/2.6/r2源码；models/course-engine/course-directory/learning-progress | resolve真实锚点、全旧对象摘要、新旧键及真实生产404 | PREREQUISITE_AUDIT/技术结果支持相应契约 |

尚待专业人工：两级新语法的负担、分类题迁移距离、中文与提示效度。没有虚构教师、学生、签署或通过率。
