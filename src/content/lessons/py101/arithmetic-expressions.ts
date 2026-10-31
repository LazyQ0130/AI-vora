import { lessonSchema, type ContentBlock } from "../../models";
import { arithmeticCode, arithmeticBlockNames, type ArithmeticKey } from "../../resources/python-arithmetic";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const output = (filename: string, code: string): ContentBlock => ({ type: "code", language: "text", filename, code });
const sample = (key: ArithmeticKey): ContentBlock => ({ type: "code", language: "python", filename: arithmeticBlockNames[key], code: arithmeticCode[key] });

// 简报、运行前手算、官方事实与保存文件实跑见docs/py101-p10；无新增下载或阅读器组件。
export const pythonArithmeticExpressionsLesson = lessonSchema.parse({
  id: "PY101-C02-L03", courseId: "PY101", chapterId: "PY101-C02", title: "用表达式算出一个结果",
  contentVersion: 2, optionalLesson: false,
  subtitle: "从盒数、每盒件数和散件写出计算：先手算，再检查Python算出的数字是否符合题意。",
  prerequisites: "已完成第一章及2.1–2.2：能用合法名称保存int/float数值，用print和type观察，先预测再保存、从终端完整运行.py。沿用已有Python 3与编辑器，不安装新库；手机可读，代码操作需要电脑。",
  prerequisiteLinks: [
    { title: "2.1 赋值与名称读取", href: "/learn/PY101/PY101-C02-L01#name-and-value", note: "回顾名称怎样取得右边的值。" },
    { title: "2.1 预测与完整运行", href: "/learn/PY101/PY101-C02-L01#predict-run", note: "确认本次真正执行的是保存的整份脚本。" },
    { title: "2.2 数值与文字", href: "/learn/PY101/PY101-C02-L02#add-measurement", note: "数值不加引号，测量值与单位分清。" },
    { title: "2.2 类型观察", href: "/learn/PY101/PY101-C02-L02#inspect-type", note: "需要时复习print(type(名称))的内外两步。" },
    { title: "1.3 保存与重跑", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "输出没变化时检查保存状态和实际执行目标。" },
  ],
  objectives: [
    "从新的数量情境识别数值与单位，用变量和加减乘除写出有实际含义的计算，保存运行并核对",
    "预测乘除、加减与括号分组的结果，实际运行验证，并解释两种分组分别描述什么数量关系",
    "只改一个已知数量重新预测和完整运行，核对结果及单位，并排查修正一次与题意不符的表达式",
  ],
  assessmentMap: [{ objective: 1, exerciseIds: ["calculate-and-revise", "compare-grouping"] }, { objective: 2, exerciseIds: ["compare-grouping"] }, { objective: 3, exerciseIds: ["calculate-and-revise", "compare-grouping"] }],
  learningTime: { reading: [12,18], practice: [6,10], coding: [15,22], basis: "editorial-estimate" },
  sections: [
    { id: "quantities-and-units", title: "先弄清楚每个数字在数什么", navGroup: "relation", navLabel: "数量关系", blocks: [
      p("整理物品时，有4盒，每盒3件，另外散放4件。一共有多少件？先不用Python，在本地笔记写下手算过程和答案。你会先数盒里的物品，再把散件加进去，还是把所有数字直接相加？"),
      { type: "table", caption: "本例名称与数量的对应", columns: ["名称", "当前值", "含义与单位"], rows: [["box_count","4","盒数，单位盒"],["per_box","3","每盒件数，单位件/盒"],["spare","4","散放数量，单位件"],["total","待计算","总数量，单位件"]] },
      p("盒里的数量是4乘3，得到12件；再加4件散件，得到16件。盒数乘以每盒件数后，结果才和散件一样以“件”为单位，能够相加。接下来把这句关系写成Python，让修改后的数量也能按同一关系计算。"),
    ] },
    { id: "expression-to-value", title: "让右边先算出一个值", navGroup: "relation", navLabel: "数量关系", blocks: [
      p("Python用*表示乘法，对应手算中的乘号。例如box_count * per_box，就是用盒数乘每盒件数。两个数字或名称之间要明确写*，数学排版的×和省略乘号的写法不用于这里的Python源码。"),
      p("像box_count * per_box这样，由数值、名称和运算符组成、可以求出一个值的写法，称为数值表达式。先预测下方print会显示什么，再新建boxes.py，输入并保存这三行，行首不缩进，源码放在.venv外。"),
      sample("multiply"),
      p("在文件所在目录执行下方对应命令。沿用已核验的python/py或python3；后面每次换文件名后，仍先保存，再整份运行。"),
      output("Windows · PowerShell · 文件所在目录", "python boxes.py"), output("macOS · 终端 · 文件所在目录", "python3 boxes.py"), output("第一次观察 · 预期输出", "12"),
      p("现在加入散件。Python用+表示加法；box_count * per_box + spare表达“先求盒里件数，再加散件”。用下面完整五行替换boxes.py原来的三行，先写新预测，再保存运行。"),
      sample("total"), output("加入散件 · 预期输出", "16"),
      p("执行total这一行时，右边先读到4、3、4，按关系算出16，=再让total对应这个结果。*和+负责计算，=负责赋值，它们的角色不同。最后print(total)读取并显示16；给结果取名，后续还能接着使用它。"),
      p("这里输入的是2.2学过的数值，不把4写成\"4\"。带引号会变成字符串，不能期待它按本例的整数关系参与所有运算。单位保留在你的记录里，数值后面不直接接“盒”或“件”。"),
    ] },
    { id: "take-some-away", title: "取走两件后，怎样接着算？", navGroup: "relation", navLabel: "数量关系", blocks: [
      p("刚算出一共16件，现在取走2件，剩余应是总数减2，即14件。Python用-表示减法。remaining = total - 2先求出剩余数量，再让remaining保存结果。"),
      p("回到已保存五行的boxes.py，在末尾追加下面两行，保留前面的赋值和总数计算。先预测新增加的输出，再保存、完整重跑。这个片段依赖本次文件前面已经算出的total，不能放进空文件直接运行。"),
      sample("subtract"), output("新增一行输出 · 接在16之后", "14"),
      p("现在两条普通输出依次是16、14，分别表示总件数和取走后的剩余。取走数量也以“件”为单位；本例取走不超过总数。写自己的计算时，把数字的意义与是否合理一起核对。"),
    ] },
    { id: "order-and-grouping", title: "括号改变分组，也要检查单位", navGroup: "reasoning", navLabel: "分组与分配", blocks: [
      p("在这些数值计算中，乘法和除法优先于加法和减法。原式先写乘法，可能让人误以为总是从最左边逐项计算。另建order_boxes.py，把同一个加法写到前面作对照；先手算两行，再保存运行。"),
      sample("precedence"), output("优先级对照 · 预期输出", "16\n16"),
      p("第二式spare + box_count * per_box仍先求4乘3，再把散件4加上去，得到16。若不顾优先级，先把最左边两个4相加再乘3，就会算成24，已经换了分组。"),
      p("表达式中的一对括号可以明确分组，让括号里的加法先求值。下面print外面那对括号仍用于输出，里面那对括号把box_count + spare分成一组。先预测，再把这一行追加到boxes.py末尾，保存重跑；新增结果会接在原来的16、14之后。"),
      sample("grouping"), output("分组对照 · 新增输出", "24"),
      p("Python先把4和4相加得到8，再乘3，确实得到24。但原问题中box_count数的是盒，spare数的是件，把4盒和4件加成8盒，单位与含义不匹配。因此24是这段代码的计算结果，却不是原问题的总件数。能运行出数字，还要核对表达式是否写对了现实关系。"),
      p("换一个条件，括号式就可能有意义：原来4盒，又增加4盒，每盒同样是3件。added_boxes现在数新增的盒，能与原盒数相加。先预测，再将下面完整程序保存为more_boxes.py并运行。"),
      sample("moreBoxes"), output("同容量新增盒 · 预期输出", "24"),
      p("这里是8盒，每盒3件，共24件。两种情境数字恰好相同，spare和added_boxes的现实含义却不同。括号决定怎样计算，题目条件决定这份计算有没有意义。"),
    ] },
    { id: "divide-and-meaning", title: "重新平均分配，除法在算什么？", navGroup: "reasoning", navLabel: "分组与分配", blocks: [
      p("回到最初的16件。单独考虑一次重新分配：把全部16件重新平均放进原来的4盒，每盒分到多少件？Python用/表示除法，total / box_count就是总件数除以盒数。本例除数是正整数4，不能为零。"),
      p("在boxes.py末尾追加下面三行。它读取前面已经算出的total与box_count，average是新选的名称。先写平均数和类型预测，再保存、从头运行；type的内外两步沿用2.2。"),
      sample("division"), output("追加的两行输出 · 接在16、14、24之后", "4.0\n<class 'float'>"),
      p("4.0表示这次全部重新分配后平均每盒4件，不是说原来每盒有4件；原来每盒3件，另有4件散件。本次分配没有先取走两件，前面的remaining只是另一个问题的结果，total仍是16。"),
      p("本课使用Python自带的整数和浮点数做普通数值运算。/得到float结果，即使16和4都是int且数学上恰好整除，也显示为4.0；type观察为<class 'float'>。这不是计算出错，也不需要为了去掉.0引入类型转换。"),
      p("不能整除时也能有合理的除法。例如把7升水均分到2个相同容器，先手算每个容器多少升，再将下方完整程序保存为share_water.py运行。水量可以分成小数升，这次结果的单位为升/容器。"),
      sample("nonIntegral"), output("水量重新分配 · 预期输出", "3.5"),
    ] },
    { id: "same-level-order", title: "同一级的运算怎样分组？", navGroup: "reasoning", navLabel: "分组与分配", blocks: [
      p("*与/同级，+与-同级。这里的二元运算各连接左右两个数值；没有另加括号时，同级按左结合分组。"),
      p("12 / 3 * 2先求12除3，再乘2，得8.0。若预测2.0，就是先把3乘2当了整个除数；那对应12 / (3 * 2)，已改变分组。"),
      p("10 - 3 + 2先取走3再增加2，结果9；10 - (3 + 2)则合计取走5，结果5。预测下方四行，再保存same_level.py运行，对照两种分组。"),
      sample("leftGrouping"), output("同级分组 · 预期输出", "8.0\n2.0\n9\n5"),
      p("对照same_level.py的前两行：只给3 * 2加上括号，除数就由3变成6。重跑能检验你是否把“同级左结合”误读成“总先算乘法”。其他式子先看括号与运算层级。"),
    ] },
    { id: "put-it-together", title: "用同一份关系预测新数量", navGroup: "revise", navLabel: "改值验证", blocks: [
      p("现在已分别观察过总数、括号反例和重新分配。把下面完整主例另存为box_relations.py，先预测三行，保存运行，再为每行写下含义和单位。第二条特意保留错误的现实分组，用来检查自己是否只盯着数字。"),
      sample("main"), output("完整主例 · 三行预期输出", "16\n24\n4.0"),
      { type: "table", caption: "数字要和问题条件一起读", columns: ["显示", "这条表达式的含义", "本例中的判断"], rows: [["16","4盒内数量加4件散件","原问题总数，16件"],["24","先把盒数和散件数相加再乘每盒件数","单位错配，不能作原总数"],["4.0","全部16件重新平均分到4盒","本次分配的平均数，件/盒"]] },
      p("再建revise_boxes.py，只保留有正确现实含义的三个结果：原总数、取走2件后的剩余、全部总数重新分配的平均数。注意最后一项用total，而非取走后的remaining，这三个输出分别回答各自的问题。先手算，再保存运行下面完整程序。"),
      sample("revise"), output("改值前 · 预期输出", "16\n14\n4.0"),
      p("现在只把per_box的赋值由3改成5，其他行保持不变。先在笔记写三个新预测，说明每盒多2件会怎样影响4盒总数，再保存，用同一命令完整运行revise_boxes.py，对照两轮真实输出和单位。不要把新程序追加到旧程序末尾，也不要先照抄下面的核对结果。"),
      p("核对时，新总数应为24件，取走2件后余22件，全部24件重分4盒为6.0件/盒。若结果仍是旧数字，先查保存状态与执行文件；若保存正确但数值不符，就从数量、单位和表达式分组逐项查，而不只是把预测改成屏幕数字。"),
    ] },
    { id: "zero-divisor", title: "除数为零时，要读懂失败原因", navGroup: "revise", navLabel: "改值验证", blocks: [
      p("平均分配要有明确的非零除数。把8除以0无法得到这里的普通数值结果，下面是故意安排的失败例；你可以只读现象，不需要反复运行它。"),
      sample("zeroDivide"), output("错误末行 · 路径和回溯以实际环境为准", "ZeroDivisionError: division by zero"),
      p("这个例子没有正常数值输出，错误类型是ZeroDivisionError。遇到同类现象，核对当前除数的值与题目条件；核心练习选择明确的正整数盒数。此处先识别原因，不写try/except处理异常。"),
    ] },
    { id: "practice", title: "换一个情境，自己写并核对关系", navGroup: "practice", navLabel: "独立练习", blocks: [
      p("先独立写程序，再按需展开提示。基本交付是本人源码和本题真实运行结果；同一会话的环境、文件位置和命令只记一次，后面可引用编号。预测可口述或记一行；边界、改值和恢复题按题干保留必要对照。"),
      { type: "exercise", id: "calculate-and-revise", title: "独立计算，再只改一个数量", kind: "代码",
        prompt: "自选成组物品、散件及取走情境，选合理小正整数和合法名称，取走不超过总数。在新.py真实计算总数和剩余。先用一行手算两结果，保存运行；再只改一项已知量，重新手算、保存、完整重跑。交源码加该处差异、两轮预测/真实结果及单位，命令记一次。现场或一句话说明哪些结果为何变化，不必重复提交整份源码和环境表。",
        hints: ["先找组数、每组多少、散件和取走多少。组数与每组数量结合后得到的单位，是否能与散件相加、与取走数量相减？", "按变量和单位核对成组数量、总数、剩余三步，再为两次显示写预测。只改一项时检查其余赋值是否保持，并由你自己填写数值、表达式和实际结果。"],
        solution: [
  "例如改用挂绳整理：5袋，每袋6条，散放3条，取走4条。新建cords.py。以下“第几行”只是分隔说明，每条语句各写一行，不把分隔文字输入源码。",
  "先写四个已知量：第1行：bag_count = 5；第2行：per_bag = 6；第3行：loose = 3；第4行：taken = 4。bag_count单位袋，per_bag单位条/袋，loose和taken单位条。接着：第5行：total_cords = bag_count * per_bag + loose；第6行：remaining_cords = total_cords - taken；第7行：print(total_cords)；第8行：print(remaining_cords)。乘法求袋里的条数，加散条求总数，减取走条数求剩余。",
  "先手算5乘6得30条，加3得33条，再减4余29条。预测两行33、29，保存后运行python cords.py（macOS用python3，已核验的py也可），保留本人实际输出逐项核对。",
  "只把袋数改为7，其他赋值和关系不变，八行依次为：第1行：bag_count = 7；第2行：per_bag = 6；第3行：loose = 3；第4行：taken = 4；第5行：total_cords = bag_count * per_bag + loose；第6行：remaining_cords = total_cords - taken；第7行：print(total_cords)；第8行：print(remaining_cords)。先算7乘6加3为45条，减4余41条，再保存并完整运行，应看到45、41。多2袋，每袋6条，总数与剩余都增加12条，取走数量没有改变。",
  "常错是只改了某个print常量、漏散件、从每袋数量而非总数扣取走、改多项却声称只改一项，或未保存/执行错文件。先用单位和手算定位，再修改源码完整重跑；不能只抄参考输出。你自己的情境与数字应另选，合理的分步或等价计算同样接受。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "本人新情境/名称/数量及单位，成组加散件再取走关系正确，实际计算不打印答案常量。",
  "两轮有事前手算与完整真输出，只改一个量；源码一次加差异，命令一次可核对。",
  "数量有实际意义，能用单位解释结果变化并核对预测，不要求长篇报告。"
],
      },
      { type: "exercise", id: "compare-grouping", title: "括号式算得通，符合题意吗？", kind: "代码",
        prompt: "另建.py，选新贴纸盒数、每盒数（至少2）、散张数，均小正整数。先手算盒内总数加散张、以及盒数加散张后乘每盒数，两结果须不同；用变量写两式并实跑。指出原题适用式与单位错配，给另一式有意义的新条件。再用原题总数除以非零原盒数，预测并实跑平均值，解释float与整张均分条件。最后修复不合题意的那行，保存重跑。交源码加修复差异、一张预测/实际对照表及单位理由；命令只记一次，理由可现场说明。",
        hints: ["分别说出两个加号把什么数量加在一起：它们的单位相同吗？除法中的总数是否包含散件，这次分配的盒数有没有被你改变？", "核对散件到底按张数还是盒数记录，分别手算并运行两种分组，再设计另一个使括号分组成立的条件。找到不符合原问题的那行后自行修正和复跑，仍由你选择数据与最终表达式。"],
        solution: [
  "例如改用彩纸，3筒、每筒5张、散6张，新建paper_grouping.py。七行分别为：第1行：tube_count = 3；第2行：per_tube = 5；第3行：loose_sheets = 6；第4行：total_sheets = tube_count * per_tube + loose_sheets；第5行：print(total_sheets)；第6行：print((tube_count + loose_sheets) * per_tube)；第7行：print(total_sheets / tube_count)。tube_count单位筒、per_tube单位张/筒、loose_sheets单位张，total_sheets为原总张数。",
  "先预测：3乘5加6为21张；先3加6再乘5得到45；全部21张重新均分3筒，每筒7张，/显示7.0。保存后运行python paper_grouping.py（macOS用python3），保留本人三行真实输出。",
  "第二式把3筒和6张相加再当成9筒，单位错配，所以45不是原题总张数。若条件改成原3筒另增加6筒、每筒仍5张，括号式就有意义，会得到45张；改变的是题意，不能把原来散6张偷换成6筒而不说明。",
  "定位第6行，改成符合原散件关系的表达式；完整修复稿七行为：第1行：tube_count = 3；第2行：per_tube = 5；第3行：loose_sheets = 6；第4行：total_sheets = tube_count * per_tube + loose_sheets；第5行：print(total_sheets)；第6行：print(tube_count * per_tube + loose_sheets)；第7行：print(total_sheets / tube_count)。重新保存运行，应得21、21、7.0。两个计总输出现在一致，原总数和重分平均数不变。保留实际修复差异和新输出，不只写“有问题”。",
  "7.0为内置整数除法的float显示，不表示原来每筒已有7张；重新分配前原每筒是5张。若自己选的总数不能整张均分，所得小数只是平均数，不能宣称每筒实际放小数张；可重新选数据。常错还包括误用错误分组结果作总数、除以散件数、盒数为零，或只改答案而没重跑。接受不同合法名称、合理新情境及等价的正确表达式。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "本人新数据两分组结果不同，均有手算/实跑，源码和一次命令可对应。",
  "解释原题关系与盒/张错配，提出合理新条件；非零除法和float/平均意义正确。",
  "不合题意行确实修复并真实重跑；一张表和源码差异足够，不重复提交整份报告。"
],
      },
    ] },
    { id: "next-step", title: "结果有意义，计算才回答了问题", navGroup: "finish", navLabel: "回顾与后续", blocks: [
      { type: "summary", points: ["先写清数值和单位，再用+、-、*、/表达数量关系；右边先求值，=保存结果。", "乘除先于加减，括号明确分组，这几种同级二元运算按左结合；计算规则与现实单位都要核对。", "使用内置整数或浮点数做/除法得到float，除数非零。只改一个已知量后先预测、保存、完整重跑，检查结果仍在回答原问题。"] },
      p("保留两份程序、改动差异和真实结果。用自己的单位解释数字在数什么，再检查表达式；成功显示一个数还不足以证明题意正确。"),
      p("下一节2.4用比较表达式检查数量是否符合限制。计算先得到值，比较再回答一个明确问题。第5章函数仍需要输入输出与控制流程等基础。"),
    ] },
  ], resources: [],
  references: [
    { title: "Python计算器入门", href: "https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator", note: "核对四则、括号和除法的基本行为。" },
    { title: "运算优先级", href: "https://docs.python.org/3.14/reference/expressions.html#operator-precedence", note: "核对乘除/加减层级与本课同级左结合规则。" },
    { title: "二元算术运算", href: "https://docs.python.org/3.14/reference/expressions.html#binary-arithmetic-operations", note: "核对内置数值除法及零除数错误。" },
    { title: "赋值语句", href: "https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements", note: "核对先取得右侧结果再绑定名称。" },
    { title: "内置数值类型", href: "https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex", note: "本课只使用已学int/float，不展开其他数值系统。" },
  ],
});
