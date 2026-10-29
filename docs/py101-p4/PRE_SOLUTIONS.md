# 起草前独立预解

以下为2026-10-29起草前推演，不是实测。真实GUI、内核与命令证据另存，不把计划输出充当运行日志。

1. Markdown说明格运行后渲染文字；赋值格marker = "Draft A"运行后没有普通输出，内核已记住名字；随后print(marker)输出Draft A。
2. 把赋值格改为marker = "Ready B"但不运行，再运行显示格，仍输出Draft A。修改文本、保存文件与执行是不同动作。
3. 再运行赋值格和显示格，输出Ready B；此前显示不是自动刷新。
4. 重启内核后，原名消失；先运行print(marker)会出现NameError，正常输出不产生。控制内核环境、文件和代码语法正确，仅改变顺序。
5. 按上方赋值、下方显示执行，恢复Ready B。文档最终保存Ready B源码、说明和只读内核诊断；从重启内核按文档顺序全部运行应成功。
6. 保存.ipynb可能保留旧输出，但不把运行时名字保存为新内核状态。关闭标签可能重连旧会话；重新打开后仍明确重启，并按文档从头执行。
7. 练习一预解：新建own-plan.ipynb，Markdown自述，自选如plan_text = "Sketch D8"及print(plan_text)分格；预测、诊断目标.venv、实际顺序输出、保存、重开并重启全部运行。学生须换名字/文本，交付真实文件，不交参考输出代替操作。
8. 练习二：新的物流场景，delivery_note = "Packed C7"，print(delivery_note)。从干净内核先运行后格应NameError；识别提供名字的代码，恢复可按文档顺序运行的布局，再重启全跑得到Packed C7，保存前后执行证据。亦接受等价布局调整，前提是干净状态文档顺序完整运行，不能靠补跑后截图掩盖默认次序错误。

候选命令：项目根中Windows使用& ".\.venv\Scripts\python.exe" -m pip --version、-m pip install notebook、-m jupyter notebook；macOS对应./.venv/bin/python。确认入口是否成立；若需环境Scripts/jupyter-notebook.exe或bin/jupyter-notebook则按实测记替代，不假装候选全成功。不注册用户级kernelspec，先用环境内默认ipykernel并实测sys.executable。

计划实际验证联网安装、版本、loopback/token默认保护、GUI新建/运行/改文本不执行/重启错误/重启全跑/保存重开/停止会话与服务。浏览器只关闭页面不作为停服证明。macOS无机器时仅官方核验。服务器地址、路径与token不写入可下载Notebook；公开诊断路径脱敏，原始秘密仅在仓库外临时运行目录。

成稿目标复核后的补充推演：物流题恢复Packed C7后，仅将赋值文本改成Packed New E6但不执行，再跑显示格应仍为Packed C7；执行新赋值和显示格才为Packed New E6。保存最终文档，重新读文件并重启全跑，应重现新标记。另一自创题Sketch D8也应经保存/重新读文件/干净执行核验。这是后续补充预期，实际结果另见最新内核JSON，不冒称原始预解已覆盖所有后加步骤。
