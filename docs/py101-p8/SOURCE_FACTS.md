# 官方事实核验

实际访问2026-10-30（Asia/Shanghai）。先访问任务指定的 /3/ 五页，返回标题3.15.2；再核对 /3.14/ 版本化资料，返回标题3.14.10。本机实测是Windows CPython **3.14.2**，文档补丁版不冒充运行版本。页面只作链接和语义概括，不复制外部教材段落/图片；中文讲解与任务短例为教学构造。

| 核验点 | 官方/仓库来源 | 核验结论及边界 |
| --- | --- | --- |
| 名称绑定、重新赋值 | [Python3.14赋值语句](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements) | 名称目标被绑定到右侧求值结果，已绑定可重新绑定；本课仅最小字符串情形，不讲可变对象/引用计数 |
| 名称读取、未绑定错误 | [表达式中的名称](https://docs.python.org/3/reference/expressions.html#identifiers-names)、[执行模型](https://docs.python.org/3.14/reference/executionmodel.html#resolution-of-names) | 读取取得所绑定对象；找不到名称会NameError；本课是顶层脚本受控先读情景，不将所有NameError归同一根因 |
| 合法标识符、大小写、保留词 | [Python3.14词法](https://docs.python.org/3.14/reference/lexical_analysis.html#identifiers) | 字母/下划线可起头、数字不作首字符、大小写敏感、关键字不能作普通名称；部分非ASCII字符也合法。正文英语命名路线只是便捷建议，for/class是反例，另建议避开print以保留显示工具 |
| 字符串与赋值观察 | [官方入门](https://docs.python.org/3/tutorial/introduction.html) | 配对引号描述文字；赋值本身无普通显示，print输出；名称与字面量不同 |
| 错误类型与回溯 | [错误与异常](https://docs.python.org/3/tutorial/errors.html) | 回溯定位文件/行，末行给异常类型及描述；路径、细节/箭头可随版本变化，本课不教try/except |
| 从文件执行、新脚本过程 | [命令行接口](https://docs.python.org/3.14/using/cmdline.html#interface-options)、[脚本代码块](https://docs.python.org/3.14/reference/executionmodel.html#structure-of-a-program) | 解释器读取指定文件；无控制流的本课语句按先后执行。常规终端每次启动新脚本进程不继承另一进程的名称绑定；此结论结合进程边界与独立运行验证，不泛化为所有Python执行方式均无状态 |
| 正式章名、学时/课程事实 | curriculum两文件，基线e6c3c08 | 02变量、基本类型、表达式与输入输出；10章；26–36小时；课程planned，未据本课估时改体系 |
| 已教范围与6节路线 | 第一章六份现稿、P6追踪/审核、P7蓝图及P6-02修订 | 1.5仅最小赋值和内核状态，P7补最小选名条件；2.1进入普通脚本独立使用，模块/诊断工具不是自写先修 |
| 工程/版本 | models、course-engine、learning-progress、COURSE_AUTHORING、Next本地deploying/testing文档 | draft/private无可读路由；技术证据后可preview；仅状态过渡勘误保1.6/r1，精确比较；2.1新r1独立进度 |

名称/更新/错误的实际运行、Windows解释器和文件保存/路径核验另存本轮运行记录。macOS的python3脚本调用按官方接口核对，未有实机验证。事实核验与AI辅助复核不替代教师/编辑/学生试学。
