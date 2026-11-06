# 修复后：最终版生产同路径回归

最终版指同步接收有效scroll事件点、UI继续使用requestAnimationFrame的版本；没有临时存储诊断。Webpack90页、next start/3010，运行前重载取得新构建，最终源码摘要由REVIEW_BINDING绑定。final-reader-rows与final-reader-cases为最终版，after-v1文件是保留的首版结果。

| 最终矩阵 | 次数 | 返回/完整reload结果 |
| --- | --- | --- |
| A：3.3/r1，short-circuit稳定保存→SPA课程→课程稳定→返回 | 3次连续 | 三次均#short-circuit，重载亦同，无reverse-result或首段覆盖 |
| B：同课five-values | 1次 | #five-values保持 |
| B：同课reverse-result，直接hash进入后SPA往返 | 1次 | #reverse-result保持，证明非特定ID硬编码 |
| C：3.4/r1，order-matters同路径 | 3次连续 | 三次均#order-matters，重载亦同 |
| 普通真实滚轮：3.4 order-matters→stop-reason | 1次重验原失败输入 | 目标top175.6875、scrollY5572，入口已#stop-reason；返回/重载保持，比例52→65 |
| 快速锚点后离开 | 3.4一次、3.3一次 | 分别179ms与285ms到课程就绪，目标follow-states/short-circuit均保持到reload |
| reduced-motion立即滚动 | 3.3一次 | CDP实测媒体条件为true，five-values往返/reload保持；之后清除覆盖 |

原路径与3.4最终各三次、普通滚轮一次，是第二版制定的固定重验，全部记录，没有挑选最后绿色。首版真实普通滚轮失败导致代码修改，因此最终重验有新变化依据；不是无改动反复尝试。

其他最终记录覆盖3.2↔3.3、3.3↔3.4、后退/前进、完整文档离开/无hash重开、恢复按钮与H2焦点、手机Drawer与直接hash重载。旧3.2为100%/已读完；3.3为自己的74%/未完成；3.4为自己的65%/未完成。后续Copy/展开参考会继续改变测试阅读位置与最高比例，不反向修改已完成的核心时序证据。

首版前两次原路径曾因测试工具把顶部严格限定scrollY<1而超时，实际均为约4.667像素且入口正确；第二次还保留了旧闭包断言。原始失败行与修订说明保留，修正工具为顶部32像素内，不改Reader。最终版全部采用修正后的观察条件，三个完整样本没有该超时。

结论：已知P1在本次固定生产矩阵关闭，普通滚动新增失败也已修复。此结论覆盖本次Windows Chromium与模拟视口，不能替代macOS、实体触屏、真人试学或人工内容审核。
