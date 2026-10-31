# 起草前独立预解

保存于Lesson/Publication注册前。按整数关系、实际执行顺序和代码块归属推演；随后另轮核验仍是同一Codex工具辅助，不称独立人工审稿。预期写进验证器后才启动真实文件，exit0不等于符合题意。

| 对象 | 事前判断 | 预期stdout（箭头分隔行） |
| --- | --- | --- |
| 3.1单if，5/6 | 条件真，受控提醒及块外继续 | Within limit → Check finished |
| 3.1单if，7/6 | 条件假，只有块外 | Check finished |
| 两路<=，5/6与6/6 | 条件真，只if块 | Within limit → Check finished |
| 两路<=，7/6 | 条件假，只else块 | Over limit → Check finished |
| 三路<、==、else，5/6 | 首项真，其余不检查 | Room left → Check finished |
| 同上6/6 | 首项假、第二真 | At limit → Check finished |
| 同上7/6 | 两项都假，else | Over limit → Check finished |
| 重叠链<=、==，6/6，无收尾print | 首项真，第二比较未执行 | Within limit |
| 上例只修首项<，6/6 | 首项假、第二比较执行且真 | At limit |
| 两个独立if（<=与==），6/6 | 两项分别检查且均真 | Within limit → At limit → Check finished |
| 同上7/6 | 两项分别假，仍有收尾 | Check finished |
| 题二起始，kits10/shelf_limit10 | 两个独立判断都真，违反唯一分类要求 | Within shelf limit → At shelf limit → Shelf check finished |
| 题二修复，kits8/10/13 | <、==、余下三档依次命中 | Below shelf limit / At shelf limit / Over shelf limit，各接Shelf check finished |
| 题一两路，people11/17、seats14 | <=真/假，两种提示 | Enough seats / Not enough seats，各接Seat check finished |
| 题一三路，people11/14/17、seats14 | 少/等/超三档 | Spare seats / All seats taken / Need more seats，各接Seat check finished |
| 陌生门票先判断>，tickets17/20/23、gate_limit20 | 先超限，再等值，余下少于 | Room at gate / Gate full / Too many tickets，各接Gate check finished |

前三组主例三轮必须真实保存/运行，学生不能用未学循环代替。正文不要求SyntaxError/IndentationError实验，也不人为制造来凑数。

作者执行行预解（非学生语法）：重叠短例第1/2行赋值，第4行if <=，第5行print；应执行行[1,2,4,5]，第6行elif ==不执行。只把首项改为<后，等值应执行[1,2,4,6,7]。使用标准库`python -m trace --trace`运行真实保存文件核对，不往学生代码塞函数/容器/副作用哨兵。

题二仅把第二个if换elif且保留首项<=，等值仍先被首项选走，属于未完成修复。正确修复须让低/等/高范围与互斥结构对应；不能删除第二条print或写死答案。未知新数据的规则仍相同，由从题意重新求解核对。
