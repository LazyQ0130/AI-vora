# 跨课预检：执行前预测

2026-10-31。先登记下列教学构造数据与手算，随后才保存文件执行。作者预检和组织者参考均不属于学生作品，不能由这些结果推断独立迁移成功。

材料箱清点：文字Cable set M，整数4段，单段2.5米，固定限18米，准备状态True。类型分别str/int/float/bool；总4×2.5=10.0米，10<=18为True；随后同名文字改Cable set N，后续print读取新值。

交互版先收标签、段数文本、单段米数文本，再分步int/float。原段数/长度是str，转换后依次int/float。固定18米：Coil A/4/2.5→10.0/True；Coil B/3/4.5→13.5/True；Coil C/6/3.0→18.0/True（含等值）；Coil D/4/5.0→20.0/False。False只回答总长不超过18米不成立，没有拒绝动作，也不表示材料全部不可用。

受控副本输入Coil bad/4.5/2.5：第4行int不接受小数文本4.5，ValueError、退出1，stdout只有已显示的三个无换行提示，没有类型或摘要print。重新启动同一副本输入Coil recovered/4/2.25→9.0米/True、退出0，恢复是新进程。

组织者参考使用另一个活动材料情境，固定上限7.5米。B1 Festival trim/5/1.5/False：普通显示如各字面量，类型str/int/float/bool。B2同文件手动改单段长度1.25、1.5、2.0，段数固定5，三轮总6.25、7.5、10.0米，对应True、True、False。B3换为input后，Stage Blue/5/1.25→6.25米/True；Stage Gold/5/1.5→7.5米/True，输出活动材料名、段数、总米数和不超过7.5米的问题。

input提示属于stdout，无自动换行。重定向stdin不产生键盘回显，因此三提示会紧邻后面的第一条print；不为美化日志补回显。程序源码只用已教名称、字面量、赋值、type/print、乘法、<=、input、int/float、简单名称f-string。执行器的文件/进程/JSON工具不要求学生编写。
