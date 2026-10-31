# P19 生产浏览器验收

2026-10-31，Windows的ChatGPT内置浏览器，隔离生产`next start`来源端口3009，Webpack构建；不是开发模式，也不代表macOS或实体手机实机。原3000来源不触碰，原Reader/进度修改不带入隔离候选。候选临时设pending-review/preview供教材交互检查；发现P1后恢复与正式源码相同的draft/private，重新生产构建并实测404。本报告不能作为全量通过或开放试读依据。

## 四种宽度与真实操作

| 视口 | 主要验收 | 证据 |
| --- | --- | --- |
| 1440×1000 | 三目标；两道开放题各提示1/2、参考答案与rubric；完整主例/预期/四行状态；verification展开；6个Python块 | desktop-1440.png、BROWSER_CHECKS、DOM_SOURCE_MATCH |
| 768×1024 | 目录抽屉、目标/练习入口；点击题二后关闭抽屉，hash为#exercise-repair-state-update，焦点H3 | tablet-768.png |
| 390×844 | while冒号、体内4空格、两行先后与换行；文档宽375≤390 | mobile-390.png |
| 320×812 | 9个目录标题；点击逐轮表后hash为#follow-states，焦点H2；表格与长代码局部横滑，文档宽305≤320 | narrow-320.png |

桌面/平板/手机/窄屏截图均实际查看。代码DOM核对保留行首空格，Prism空行占位仅在比较时按空行规范化；6/6对应同源完整程序。320px时标签参考代码clientWidth229、scrollWidth296，实际横向滚轮后scrollLeft=67.333，再返回左端；不是仅据CSS推断可横滑。状态表包括最后False行，局部宽表可横滑，页面没有整体横向溢出。检查中的控制台没有额外错误，之后主动404属于预期请求。

## 实际Copy、落盘与运行

点击主例Copy后初次读取仍是P18旧剪贴板文字，校验没有放行。重新点击已稳定的主例Copy，才得到本课packed0/target3程序；题二参考Copy取得packed2/target5修后稿。两份由真实剪贴板写成copied-while-main.py、copied-while-repaired.py，保留实际字节，无末尾LF；不是从DOM伪装复制。

COPIED_CODE_RUNS保存源码/SHA、实际命令、cwd、PID、10秒上限和独立预期。两份分别输出`1/2/3/Packing finished`、`3/4/5/Packing finished`，stderr空、exit0，冒号、4空格、换行可执行。与同源资源除允许的终末换行外一致；主例与修复参考是不同初始数据，不能用同一次复制代替两份。

## 导航、Publication与进度

临时preview生产页实际从3.3页尾点击到3.4，目录显示第三章四节，PY101仍筹备。错误课程ML201归属与3.5未来页实际浏览器404；HTTP另覆盖AI000错误归属及3.5–3.8全部404。初始private/临时preview/最终private分别10/10专项HTTP，三个阶段全局路由均114/114。

最终正式Publication保持draft/private。最终Webpack89页，生产访问`/learn/PY101/PY101-C03-L04`显示统一404，截图final-private-404.png；FINAL_PRIVATE_HTTP_GATE记录同状态。3.4未开放，正式相邻导航不会链接到它。临时preview90页上的相邻导航成功只证明候选拓扑，不混同当前公开行为。

仅用正常UI在隔离来源创建旧2.4/r2、3.1/r1、3.2/r1完成标记，后续检查仍为已读完；新3.4显示未读完。3.4稳定完整导航保存#order-matters并在返回/重载保留。所有旧版本键字符串隔离由存储模块单测另证；未通过浏览器写脚本、清空或迁移真实用户进度。

## P18恢复问题：实际阻断

共5个有界场景，执行前方案与追加理由均保留。3.3/3.4稳定完整文档导航恢复正确；3.3/3.4点击锚点立即SPA往返的此次样本未复现错误。不能用这些成功推翻P18记录。

追加且仅追加P18原路径：3.3锚点稳定到#short-circuit后，经SPA回课程、课程页就绪后返回，恢复入口变为#reverse-result；页面稳定后仍错，完整reload后仍错。列**P1持久化恢复行为阻断**。完整阶段、UTC时间、hash/scrollY/目标top/焦点/入口见READER_BOOKMARK_ROWS和READER_BOOKMARK_REPRO。

page只读评估未暴露localStorage，raw CDP的DOMStorage读取也不受支持；没有绕过或写入。原始序列化记录未取得，不能称已定位内部覆盖代码、所有版本数据丢失或确定根因。但重载后错误入口保留已足以否定该流程通过。3.4稳定后SPA未另加样本，不推定安全。P19没有授权修Reader，代码保持原状，交接独立修复范围；正式3.4暂不从draft/private放行。

临时视口已恢复，临时验收标签页关闭。没有伪造专业审稿、学生试学、macOS或实体设备结果。
