# 起草前独立预解

2026-10-29；先定预期，再由validate-py101-editor.ts断言实际输出。运行日志另存，本文是编辑预解，非运行记录。

1. 磁盘main.py一行Draft A1 → 退出0、stdout一行Draft A1。
2. 编辑缓冲区改为Ready B2与Saved copy而不保存，独立终端读同一路径磁盘文件 → 仍为Draft A1。保存后同一路径 → 两行Ready B2、Saved copy。若自动保存已生效则无法复现，不能伪称未保存；应跳过该状态或在自己的练习窗口临时控制自动保存并恢复。本轮不修改用户设置。
3. notes.py → Notes N4；other/main.py → Other folder C3。相同文件名不证明相同对象。
4. 从other运行main.py读到Other folder C3；从other用正确的上级路径运行root main.py读到Ready B2、Saved copy；从任意cwd用其绝对路径同样成功。
5. 从不存在目标的空文件夹按main.py相对名称执行 → 非0、无正常stdout；改为精确绝对路径 → 0与两行目标输出。
6. 练习一独立例：message.py原为Plan: read、Step: start；改为Plan: practice P8、Step: save，加Check: rerun → 三行同顺序。学生须自己选主题/标记，抄此例不足达标。
7. 练习二已明确两份文件都保存、同一解释器、编辑root main.py、终端cwd other、运行main.py → 唯一故障为执行了另一份同名文件。修复位置或脚本参数均可，须保留证据并再跑。
8. 只读诊断python -c命令返回实际解释器绝对位置与版本；这是观察工具，不将import/sys变成考点。若编辑器选择与终端解析路径不同先核查，不安装多个Python制造错配。

人工复核待办：用新手语言复核“缓冲区/磁盘”解释、提示二是否仍留独立判断、终端复制含提示符时的误操作、macOS菜单与命令替换、真实新手用时及恢复成功证据。
