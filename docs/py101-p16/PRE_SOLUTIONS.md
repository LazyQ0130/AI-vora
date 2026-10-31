# 开写前预解与第二轮复核基准

在正式Lesson注册前保存。方法：先按给定整数关系和语句块归属逐行推演；预期文本独立写入验证器，之后才启动Python。校验者为同一Codex工具辅助轮，非独立人工审稿。空行不改变本课块归属。

| 对象 | 事前推演 | 预期stdout（每个分号表示换行） |
| --- | --- | --- |
| 无if count5/limit6 | 5<=6真，两个print都执行 | True; Check finished |
| 单if 5 | 真，块内执行，退回块外继续 | Within limit; Check finished |
| 单if 7 | 假，跳过块内，块外继续 | Check finished |
| 单if 6 | <=含相等，所以同真路径 | Within limit; Check finished |
| 两语句块5 | 同缩进的Within limit与Prepare labels都受控 | Within limit; Prepare labels; Check finished |
| 两语句块7 | 两条都跳过 | Check finished |
| 第二条退回块外、count7 | 第一条跳过，第二条及结束执行 | Prepare labels; Check finished |
| 题二错误packed8/capacity6 | 条件假，Checking batch跳过，错误退到块外的Pack allowed仍显示 | Pack allowed; Check finished |
| 题二修复packed8 | 两条都属if，假时均跳过 | Check finished |
| 题二修复packed4 | 真，两条受控提示及结束 | Checking batch; Pack allowed; Check finished |
| 题一另情境：资料架books9/capacity12 | 9<=12真；12相等仍真；15高于则假 | 9/12均Books fit; Shelf check finished，15仅Shelf check finished |
| 陌生最低标准：height16/minimum18 | >=低值假，18等值真，21高值真 | 16仅Measurement finished；18/21均Height reached; Measurement finished |

无受控SyntaxError/IndentationError正文块，不伪造这两类运行证据。题二只含一处**可运行逻辑错**，不是缺少if语句块的无效源码：Checking batch已经为if提供合法主体，只有Pack allowed的归属不符合题意。修复只加这行四空格，比较本身保持。

重新求解轮：不从页面文字取预期，按5≤6、6≤6、7>6和各自缩进重新走路径；参考题数据换为9/12/15与最低标准16/18/21。全部源码须落盘、重读核SHA后启动新进程，记录命令/cwd/stdout/stderr/退出/PID；运行结果在PYTHON_RUNS.json，失败保留并修正，不改预期迎合错误输出。
