# 起草前预解（不等于实测）

2026-10-30。先按题设从上到下追踪名称对应关系，再起草教材；作者Codex辅助推演，非独立人工审稿。实际执行另见PYTHON_RUNS。

1. 主例：第一行使task_name对应Pack notebooks；第二行读取，输出Pack notebooks；第三行改为Check labels；第四行读取，输出Check labels。后来的绑定不能改写已经输出的第一行。
2. 只把第三行改为Sort envelopes：第一次读取前的赋值不变，仍Pack notebooks；第二次读取为Sort envelopes。完整保存并重跑，不只执行选区。
3. 名称/字符串：task_name赋Ready后，print("task_name")输出task_name；print(task_name)输出Ready。引号界定固定文字；不带引号处读取已绑定名称。
4. firstRead：新进程第一行print(dispatch_label)，此前无该绑定，NameError；stdout为空，非零退出；第二行虽已在文件中但尚未执行。错误完整路径/箭头等不预定。
5. 修复：先执行dispatch_label = "Packed T7"再print(dispatch_label)，从头预期Packed T7、无stderr、0。可把读取移后或赋值移前；不能把读取替换成固定字符串来通过目标3。
6. keep-and-update参考路径：新文件gallery_plan.py，自选情境布展，名称display_note，文字Hang posters→Place signs；第一次两行如上。只将第二次赋值改为Open doors；第二次输出Hang posters、Open doors。display_note以字母开头/含下划线且非保留词，两次读取拼写一致。接受其他合法名称、中文文字、配对单引号。源码/命令/两次预测/两次实际结果与一句因果解释必须对应。
7. repair-first-read参考路径：独立保存repair_label.py，先复现题设错误、记录末行及相关代码，检查两条语句依赖，再调整顺序并完整重跑；新进程不会继承另一个Notebook内核的旧名称。
8. 命名边界预期：label2、_label、任务均可作为此类赋值目标；my plan、1plan、for、class不合法（SyntaxError）。task_name赋值后读Task_name，是另一个未定义名称，本例NameError；缺引号且把Ready当名称读也会NameError；缺单边引号为SyntaxError。并非所有NameError都由同一顺序错误造成。

参考路径只采用字符串赋值与print；学生需独立选情境、文字、名字和修复动作。预解中作者执行器的复杂语法不进入学生正文。第二轮将重新从源码推导并与真实解释器结果核对。
