# P20根因与最小修复

结论针对已观察到的覆盖机制，不把localStorage或某个未观测的框架内部回调当作推测性根因。正式基线Reader在挂载和每个scroll/resize/toggle时计算UI的progress/active；另一个effect把所有这些几何值写到latest，并安排450ms保存。离开时清理函数无条件flush latest（只排除0%首段）。它没有区分真实阅读动作、锚点滚动中的中间段，以及路由/自动滚动引起的过渡位置。

## 真实浏览器写入证据

未改Reader逻辑，临时透明包装原存储适配器：仍由应用原来的setItem执行，console记录其前后getItem原始字符串、key、时间、URL、scrollY、标题与调用栈。没有脚本种进度或clear/removeItem。包装补丁见TEMP_STORAGE_DIAGNOSTIC.patch，最终已从源码移除。

before-storage-writes记录：09:52:57.038 UTC，3.3/r1正常写入section=short-circuit、percent74、completed=false；09:53:09.491，URL已为/courses/PY101、标题已为课程、scrollY2431.333，旧Reader的清理保存将同一key从short-circuit改为reverse-result，percent和completed不变。调用栈落到该Reader bundle的flush/清理分支。回到3.3和完整reload后仍读reverse-result。此为实际浏览器localStorage写入，不是内存适配器模拟。

所以错误不在解析/合并丢键：存储按收到的section正常保存。实际坏值来自Reader把过渡几何提升为有效书签，并由清理flush持久化。没有逐帧证明是哪一次上游滚动（链接滚入视图、路由滚动或布局）最早改变latest；这些不是本轮关闭该覆盖机制所需的假定。

另外，首次产生恢复入口会增加标题区高度；挂载或中间锚点几何可以与最终阅读意图不同。未包装的三个核心样本均先确认short-circuit已保存；返回出现reverse-result，部分随后又被首段separate-checks覆盖。所有真实读数保留，不只挑一个错误ID或一次绿色。

## 先失败的确定性测试

tests/helpers/reader-lifecycle执行真实Reader TSX编译结果，注入最小React hooks、DOM几何、事件、时钟和既有createProgressStore；没有另写一个Reader。原逻辑5项中4项失败：挂载过渡值覆盖、pagehide+清理重复保存、延迟完成后路由几何覆盖、平滑锚点中间段覆盖；完成/比例原语义那项通过。初次宿主mock缺少details行为已修并单列原失败日志，后续4项均为实际期望不符。此类数据明确是Node注入存储，不冒称浏览器原始记录。

## 修复

新增一个小的Reader进度会话辅助器，仍调用原learningProgressStore。它只接受真实阅读输入之后的滚动点，或明确锚点的所属合法section；UI仍持续跟踪几何。锚点记录逻辑目标而非平滑动画经过的中间段，因此快速离开也保留这次明确意图。普通滚轮、触摸、阅读键和主指针/拖动继续驱动自动保存，沿用450ms debounce，并在scrollend/pagehide/离开/清理时flush已接受点。

挂载/路由/resize自身不提名书签。跨路由链接点击及popstate先关闭本次输入窗口；几何采样还检查当前pathname。清理不再重新读取离开中的DOM，只flush待保存的有效点；dirty清除、计时器取消、dispose和重新activate覆盖React重新激活。每个会话固定自己的scope，旧实例不会把新页点保存到旧课。

底层learning-progress与use-learning-progress最终与基线一致，版本键、v1、坏数据拒绝、percent高水位、completed粘性和存储失败会话回退规则不改。手动读完走同一会话的完成保存，取消旧待写入，普通滚动不能撤销。没有sleep、段落ID硬编码、全局停止scroll监听或永久关闭自动保存。

fixed-storage-writes用同一透明包装器验证：明确锚点从旧坏值改回short-circuit后，SPA离开/返回和reload没有再次产生错误写入。之后移除诊断，用无包装的最终生产构建执行完整预定矩阵，结果另见READER_REPRO_AFTER与BROWSER_REPORT。

## 首版修复的新增失败与第二版

首版已通过原路径及3.4各三次往返，但普通CDP真实滚轮将3.4从order-matters滚至stop-reason（目标top175.6875、scrollY5572），UI比例已65%，恢复入口却仍order-matters。after-v1-reader-rows的after-E34-real-wheel-FAILED原样保留，不能算通过。

新加三项确定性测试均在首版失败：scroll已发生，但UI requestAnimationFrame尚未运行时，scrollend/pagehide/unmount先flush，会把阅读窗口关闭，使等待中的采样丢失。首版不能据原路径绿色直接放行。

第二版将符合阅读输入和当前路由的scroll事件同步采样并交会话接收，视觉setState仍放在requestAnimationFrame；resize/toggle/挂载仅更新视觉。清理依然不采样离开中的DOM，因此可以提交已接收的最后一点，不必等视觉帧，没有增加等待时间。三项新测试由失败变通过，Reader/存储/面板合计26项通过。新代码重建后，原P1与3.4各固定重跑三次、同一滚轮案例重验一次；首版结果和失败全部保留。
