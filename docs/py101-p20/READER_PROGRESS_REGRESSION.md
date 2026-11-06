# Reader与学习记录回归

最终Node全套417/417；Reader生命周期15项、既有learning-progress6项、阅读面板5项合计26项。另3项P20内容/出版/精确兼容检查。测试不是只查新函数存在：宿主执行实际Reader源码，操纵真实hook效果顺序、注入几何、事件、时钟与原存储模块，核对实际setItem结果。

覆盖：保存short-circuit后非零初始几何；挂载不覆盖；SPA离开与同课重开；延迟未到的pagehide/卸载；已完成debounce后的过渡几何；重复pagehide+清理只写一次；锚点经过中间段或立即离开；组件重新激活；跨课连续切换；普通键盘/触摸/指针与滚轮入口；无输入的hover/布局滚动不写；真实读完按钮；UI帧未执行前的scrollend/pagehide/unmount。

INJECTED_STORAGE_REGRESSION是**Node注入存储**证据，运行源码为run-injected-storage.mjs，可从仓库根以node --import tsx重放。82份旧v2修订记录加1份旧v1，共83份原始字符串，在新3.4/r1通过实际Reader保存后SHA完全一致；新key仅aivora:learning:v2:PY101:PY101-C03-L04:r1。它不是浏览器真实localStorage，也不声称包含真实学生数据。

旧第一、二章r1/r2、3.1–3.3/r1、第五章与AI000/MA101/ML等当前及历史修订由夹具逐key保护；既有测试继续确认v1仅适用原ML样章、合法v2优先、坏/未来数据拒绝、迁移幂等不删旧值、权限失败的会话回退。新r1/r2不继承完成，completed保持粘性、percent保持高水位，section仍可随合法阅读移动。

底层learning-progress.ts与use-learning-progress.ts最终逐字等同基线（仅Git换行规范化比较）。没有改合并策略、数据结构、key、迁移规则或通知规则。不会以新section清除completed，也不会降低既有percent；没有clear/removeItem/重置/批量迁移。

真实浏览器证据另列：before/fixed-storage-writes为临时透明包装器记录的实际写入，含原始前后字符串和时间；fixed诊断对应首版已修原覆盖机制。最终版无包装，以完整生产矩阵中的可见入口、实际滚动与reload证明行为，并由实际组件注入存储测试补足写入顺序。不能将这两类证据混称。

SPA进入时UI可能短暂显示过渡几何对应的比例；该瞬间不是存储快照，不再自动写入。浏览器后退恢复底部时UI可显示当前位置100%，而顶部重开仍读自己的已保存比例，不能据单个瞬态数字推断跨课继承或持久化覆盖。最终旧课完成与新课未完成均在正常UI中核验。
