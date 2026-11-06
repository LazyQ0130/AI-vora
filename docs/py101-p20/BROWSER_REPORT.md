# P20生产浏览器验收

2026-11-06，Windows内置Chromium、独立3010来源、Webpack/next start生产构建。原3000及P18/P19测试来源不操作，原用户localStorage不读取/写入/清空。模拟视口不等于实体设备。

修前固定三次原路径均错；透明存储诊断直接观察离开时同一3.3/r1 key的short-circuit→reverse-result，返回/reload仍错。首版修复通过原路径却在普通滚轮失败；该真实失败和随后三项失败测试均保留。最终版同步接收有效scroll事件，保留视觉帧调度，重新生产构建后固定复验。

最终矩阵：3.3/#short-circuit及3.4/#order-matters各三次连续稳定保存→SPA课程页稳定→返回→完整reload，全部保持；同课five-values与reverse-result各一次；普通真实滚轮将3.4书签从order-matters推进stop-reason并在返回/reload保持；179ms/285ms快速离开、reduced-motion立即滚动、浏览器后退/前进、3.2↔3.3↔3.4、完整文档和无hash重开均通过。详见final-reader-rows/cases。最终版没有隐藏的失败样本，首版和测试工具断言修订单列保留。

正常UI建立的旧3.2/r1完成记录在最终版仍100%/已读完；3.3和3.4各自比例与section归属正确且未继承完成。没有把瞬态geometry UI比例称为原始存储；原始存储证据与Node夹具的边界见READER_PROGRESS_REGRESSION。

| 视口 | 核对 | 证据 |
| --- | --- | --- |
| 1440×1000 | 可读3.4标题、待人工审核、3目标/2题、相邻导航、恢复入口、完整代码；两题各3个details与rubric展开 | desktop-preview-1440.png |
| 768×1024 | 标题/分项时间/导航/恢复入口，无整页横向溢出 | tablet-768.png |
| 390×844 | Drawer文章9节点；点击order-matters关闭面板、hash正确、H2真实聚焦；重载仍目标；4空格和换行保留 | mobile-390.png |
| 320×812 | 导航局部横滑、正文与输出局部区域承载，文档宽305≤320 | narrow-320.png |

四图均实际查看，BROWSER_CHECKS记录实测宽度。完整表与代码布局沿用旧样式，没有重写Reader视觉或增加装饰组件。

## Copy与源码

真实点击packing_loop.py Copy，首次剪贴板仍旧读数，校验拒绝，仅保存长度/SHA而不存无关内容；重试一次取得正确0/3程序。修后新数据参考一次取得正确2/5程序。两份原样落盘copied-while-main.py、copied-while-repaired.py，未从DOM代替复制。两次成功后真实CPython3.14.2执行，10秒上限、stderr空、exit0，分别1/2/3/结束与3/4/5/结束，逐字匹配同源完整程序，见COPIED_CODE_RUNS。

另外DOM_CODE_ROWS的6个Python块全部经严格文件名/源码白名单核对，DOM_SOURCE_MATCH 6/6。Prism空行占位仅比较时还原为空行，非空行四空格不动。两题提示/答案/rubric均可展开。

## 门禁与清理

最终生产3.4为200，旧3.1–3.3可读，3.5–3.8和两个错误归属404；全局114/114，专项10/10。浏览器实际看到了错误ML201归属和3.5的统一404，课程页仍“本课程正在筹备”。原private专项10/10证据在draft目录及P19保持。

临时透明存储包装器已移除，底层存储两个文件与基线相同；减弱动效媒体覆盖已清除、视口已reset、临时标签页关闭。隔离生产服务在交付结束后仅停止本轮进程。macOS实机、实体触屏及真人试学尚未完成，不用截图替代。
