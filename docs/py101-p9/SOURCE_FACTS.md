# P9官方事实核验

实际访问2026-10-30。任务指定/3/的内置类型、type、教程、数据模型页当前标题3.15.2；/3.14/版本化资料标题3.14.10。本机解释器实际版本为Windows CPython3.14.2，未升级，不把网页补丁版当作运行版本。

| 核验点 | 来源 | 具体结论/本课用途 |
| --- | --- | --- |
| str、int、float、bool基本意义 | [内置类型](https://docs.python.org/3.14/library/stdtypes.html)、[官方入门](https://docs.python.org/3/tutorial/introduction.html) | 字符串表示文字，整数/浮点数有不同数值类型，bool用于True/False状态；正文只教学基本字面写法，不复制完整类型分类/运算表 |
| print显示与类型不同 | [内置类型的字符串表示说明](https://docs.python.org/3.14/library/stdtypes.html)、[print](https://docs.python.org/3.14/library/functions.html#print) | print将值显示为文字，不能由相同显示反推同一类型；3/"3"与True/"True"用真实解释器复核 |
| type单参数 | [type](https://docs.python.org/3.14/library/functions.html#type)、[数据模型](https://docs.python.org/3.14/reference/datamodel.html#objects-values-and-types) | 取得当前值的类型；不是把值转换成另一类型。本课只解释读取→内层type→外层print，不教三参数建类/类机制 |
| True/False、类型关系边界 | [布尔类型](https://docs.python.org/3.14/library/stdtypes.html#boolean-type-bool)、[数据模型](https://docs.python.org/3.14/reference/datamodel.html#the-standard-type-hierarchy) | True和False是两个布尔值，文字形式带引号则str；bool与int有类型关系，正文不声称毫无关系，也不提前教继承/数值行为 |
| 名称可重新绑定不同类型的值 | [赋值语句](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements)、[数据模型](https://docs.python.org/3.14/reference/datamodel.html#objects-values-and-types) | 赋值改变名称所对应的值，不是让旧对象原地更换类型。用同名8→"8"及独立新数值验证；不展开对象内存 |
| float精度边界 | [官方浮点限制](https://docs.python.org/3.14/tutorial/floatingpoint.html) | 一般不能精确存储任意十进制小数；正文保留一句准确边界，不引入0.1+0.2运算或精度算法 |
| 章名、课程事实、先修 | curriculum两正式文件、P7蓝图、2.1当前源码与P8审查（基线3d625d5） | 02章名称与原课程26–36小时不改；2.2只接续已教名称/值、赋值与print，import/sys等仍非自写先修 |
| 发布/修订/进度 | models、course-engine/directory、learning-progress、COURSE_AUTHORING | draft/private不可读；验收后preview；2.1仅末段状态勘误保r1，核心与进度scope需精确比较；无reviewEvidence不升人工状态 |

仅链接参考与原创中文概括，不翻译拼接外部教材或复用外部图片；本课短程序和情境为教学构造。<class 'int'>等具体stdout形式另由本机实跑确认，不凭记忆填入实测。文档事实与AI辅助起草/复核不构成人工审核或学生学习效果证据。macOS的python3脚本调用只按官方接口核对，无实机通过结论。
