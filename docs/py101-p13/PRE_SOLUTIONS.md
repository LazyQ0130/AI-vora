# 起草前独立预解

2026-10-30，本轮新程序真实执行之前，按输入/表达式/数量单位独立推演。预期不是从stdout回填，实际记录另存。

| 操作或输入 | 先行预期 |
| --- | --- |
| total_mass6.0、within_limitTrue裸print | 两行6.0、True，技术上正常，含义/单位需补充 |
| 普通"Total kg: {total_mass}" | 原样Total kg: {total_mass}，合法且不替换，不是SyntaxError |
| f"Total kg: {total_mass}" | 运行时读取已绑定6.0，得到Total kg: 6.0 |
| 已知Parcel/count4/total6.0多行 | Item: Parcel、Count: 4、Total kg: 6.0 |
| 中文说明 | 总质量（千克）：6.0；不要求换成6.00 |
| 输入Parcel/4/1.5 | 三原值str；int4、float1.5，4件×1.5千克/件=6.0千克；<=10为True，完整print四行Item/Count/Total kg/Within 10 kg |
| Crate B/4/2.5 | 总10.0千克，含等值<=为True |
| Crate C/4/3.0 | 总12.0千克，<=为False，只表示此判断未满足，无拒绝动作 |
| 陌生Bundle D/2/2.25 | 总4.5千克，True |
| 拼错替换名称total_mas | 第2行NameError，无print结果，预计退出1；恢复为total_mass后6.0/退出0 |
| 件数文本4.5 | int转换ValueError，非正常结果，不自动变成4；合法修复输入后新进程才恢复 |

主例自动stdin Parcel\n4\n1.5\n，预期stdout原样为Item: Count: Mass kg: Item: Parcel\nCount: 4\nTotal kg: 6.0\nWithin 10 kg: True\n。前三段无换行input提示不含键盘回显；后四行为print，不人为改成漂亮终端画面。只接三输入的阶段stdout只有Item: Count: Mass kg: ；累计计算版同输入接6.0\nTrue\n。

题一参考：横幅Banner A/6/0.75，6片×0.75米/片=4.5米；Banner B/10/0.5=5.0米。print显示Material、Pieces、Total m，对应文字str、转换整数及总float。陌生Cable C/3/1.25=3.75米。两组实际输入在同源码新进程，不能改源数值伪装交互。

题二参考：固定length_limit12米，花坛围边Garden A/3/3、Garden B/3/4、Garden C/3/5，三轮总9.0/12.0/15.0米，Within 12 m分别True/True/False；三组低/等/高，源码与上限不动。陌生Garden D/4/3=12.0、True。若规则是严格少于，则等值不满足，但本题规定最多，用<=。

花括号内只放已定义简单名称，比较先赋within_limit，不将运算藏进替换位置。缺f保留字面文本，错名称依旧报NameError；两者原因不同。英文/中文单位文字都合法。所有成功要求退出0/空stderr/完整stdout，受控NameError和输入格式失败单独验证，不能接受其他异常；未知源码、stdin或错结果必须拒绝。
