# P13官方事实核验

实际访问2026-10-30，官方3.14页眉3.14.10，本机命令Python3.14.2、Node24.16.0、PowerShell7.6.5；网页补丁不冒充安装版本。library/functions实际重定向builtins/functions。仅原创中文概括事实，不复制官方长篇材料。

| 事实 | 官方来源 | 本课边界/核对 |
| --- | --- | --- |
| f或F前缀在引号之前，{}替换字段的表达式运行时求值；外部字符为文字 | [f-string教程](https://docs.python.org/3.14/tutorial/inputoutput.html#formatted-string-literals)、[词法规范](https://docs.python.org/3.14/reference/lexical_analysis.html#f-strings) | 只用已绑定简单名称；普通字符串不会自动替换；不教完整语法/格式指定/嵌套 |
| print默认将显示内容送文本输出并加换行 | [print](https://docs.python.org/3.14/library/functions.html#print) | 一条print一行；f-string先组成文字，普通print仍合法 |
| input提示无自动换行，读取一行返回str；int/float转换有文本要求 | [input](https://docs.python.org/3.14/library/functions.html#input)、[int](https://docs.python.org/3.14/library/functions.html#int)、[float](https://docs.python.org/3.14/library/functions.html#float) | 简短复用2.5，分步保存文本和转换结果，自动stdin不补回显 |
| 名称读取绑定值，未定义可NameError；普通数值比较依值关系 | [值比较与名称](https://docs.python.org/3.14/reference/expressions.html#value-comparisons) | <=包含等值，结果仅回答代码实际比较的问题，不自动执行分支 |
| float普通显示不保证任意十进制数精确 | [浮点边界](https://docs.python.org/3.14/tutorial/floatingpoint.html) | 本例用易核数，无.2f/容差算法达标要求，不美化真实日志 |

curriculum两正式V1.0及P7蓝图决定章名、先修、26–36小时等事实；现行2.1–2.5及资源、P11/P12报告界定已学范围。第三章为分支、循环、推导式与常见控制流程，第四章容器、第五章函数，不能将技术导航当零基础直接跳学建议。

沿用现有models/engine/directory/publication/progress与精确兼容登记，代码前读本地Next16.4.3 build→start部署指南。macOS仅命令/通用语义核对，未实机。教师/中文编辑/学生试学与技术检查各自留证，无人工证据不升发布状态。
