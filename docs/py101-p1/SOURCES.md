# 官方技术资料核查

2026-10-29访问。只参考以下一手资料的接口事实；目录、短print样例、解释和习题为原创，无外部图片、长段文字或代码搬运。

| 来源 | 核对点、适用版本与结论 | 验证边界 |
| --- | --- | --- |
| https://docs.python.org/3/using/cmdline.html#interface-options | 本次页标记3.15.2；script参数可以是绝对或相对文件系统路径，读取后执行；本课只讨论.py文件 | 不把文档后面sys.path规则带入本课；开发机版本另记 |
| https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_path_syntax?view=powershell-7.5 | 完整路径含盘符与根分隔符；相对路径依据当前位置；.和..；同名文件由完整路径区分 | 避免把C:目录形式误作C:\绝对路径；只用普通文件系统路径 |
| https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules?view=powershell-7.5 | 带空格的参数需引用；英文引号用于把路径作为一个参数传入 | 不扩展变量插值、转义全集；原样路径不含特殊符号 |
| https://zsh.sourceforge.io/Doc/Release/Shell-Grammar.html#Quoting | zsh官方引用规则；macOS示例用双引号分组带空格路径 | 文档核对不等于macOS实机；本机不使用Git Bash伪称macOS |
| https://support.apple.com/guide/terminal/welcome/mac | 搜索结果可见官方入口，本次页面打开返回429 | 具体「Specify files and folders」也返回429，不宣称全文已读取；其事实改以zsh官方手册与Python通用命令规则核对 |
| docs/py101-p0/CHAPTER_1_BLUEPRINT.md、first-run.ts @ 1fd65b923ee4a535fac140dd28d0fceae1a19ae9 | 1.2稳定ID/标题/顺序、先修；1.1已教保存、pwd、dir/ls、cd、print | 旧稿完整保留；不把其中当时「1.2尚无正文」的历史状态改写为本轮内容 |

许可与复用：以上均链接参考并原创转述，未引用安装截图、系统图标、外部教材图或长段文本。Python文档使用PSF许可；Microsoft文档与zsh手册不因可在线访问就被当作任意再分发素材。本课不需要再分发它们。AI回答不是事实来源。

本机只能提供Windows/PowerShell实测；macOS的python3、正斜杠、绝对路径及引用规则经过文档核对，但没有macOS终端运行证据。路径定位原理与跨平台命令的适用范围在交付报告分别说明。
