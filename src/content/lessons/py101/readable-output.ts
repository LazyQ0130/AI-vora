import {lessonSchema,type ContentBlock}from"../../models";
import {readableCode,readableBlockNames,type ReadableKey}from"../../resources/python-readable-output";
const p=(text:string):ContentBlock=>({type:"paragraph",text});
const output=(filename:string,code:string):ContentBlock=>({type:"code",language:"text",filename,code});
const sample=(key:ReadableKey):ContentBlock=>({type:"code",language:"python",filename:readableBlockNames[key],code:readableCode[key]});

// 课前简报/独立预解/事实/真实运行证据：docs/py101-p13。复用现有Reader，无新下载。
export const pythonReadableOutputLesson=lessonSchema.parse({
 id:"PY101-C02-L06",courseId:"PY101",chapterId:"PY101-C02",title:"把输入和计算整理成清楚的输出",contentVersion:1,optionalLesson:false,
 subtitle:"6.0是什么，True又回答了什么？把已算好的值放进说明文字，再用真实输入检验边界。",
 prerequisites:"已完成第一章与2.1–2.5：会保存、终端完整运行.py，理解变量、str/int/float/bool、乘法与单位、<=比较及input后明确int/float转换。沿用已有Python 3和编辑器，不安装库；手机可读，代码与终端输入需要电脑。",
 prerequisiteLinks:[
  {title:"2.1 名称与当前值",href:"/learn/PY101/PY101-C02-L01#name-and-value",note:"复习读取名称需要本次已绑定值。"},
  {title:"2.3 计算与单位",href:"/learn/PY101/PY101-C02-L03#expression-to-value",note:"表达式回答的数量关系也要正确。"},
  {title:"2.4 相等边界",href:"/learn/PY101/PY101-C02-L04#boundary-runs",note:"<=包含刚好等于限制的情况。"},
  {title:"2.5 分步输入与转换",href:"/learn/PY101/PY101-C02-L05#main-example",note:"提示、键入回显、print结果分开记录。"},
  {title:"1.3 保存与重跑",href:"/learn/PY101/PY101-C01-L03#save-rerun",note:"确认终端运行的是已保存文件。"},
 ],
 objectives:[
  "把已绑定名称的值插入简单f-string，输出有实际含义和单位的文字，并区分普通字符串与格式化字符串",
  "在自己创建的.py中组合输入、明确转换、数值计算、布尔比较与清楚输出，说明每一步的值来自哪里",
  "为同一程序预测并真实运行新输入，验证低于、恰好等于、高于限制的结果与单位，解释真假判断的实际范围",
 ],
 assessmentMap:[{objective:1,exerciseIds:["write-clear-summary"]},{objective:2,exerciseIds:["write-clear-summary","verify-summary-boundary"]},{objective:3,exerciseIds:["verify-summary-boundary"]}],
 learningTime:{reading:[12,18],practice:[8,12],coding:[22,32],basis:"editorial-estimate"},
 sections:[
  {id:"bare-results",title:"数字算对了，别人能看懂吗？",navGroup:"meaning",navLabel:"输出含义",blocks:[
   p("程序算出总质量6.0千克，又判断出它不超过10千克。下面都是已经学过的赋值和print。先预测两行，再另存bare_results.py完整运行，看看只收到结果的人能知道多少信息。"),
   sample("plain"),output("裸值 · 预期两行","6.0\nTrue"),
   p("这两行可以是正确结果，但6.0没写单位，也没说是单件还是总量；True没写出判断问题。希望让使用者看到下面的说明。先指出增加了哪些信息："),
   output("想要的显示 · 总质量与所判断的问题","Total kg: 6.0\nWithin 10 kg: True"),
   p("Total kg表示总质量（千克），Within 10 kg在本例问是否不超过10千克。接下来先把一个已知值与说明放到同一行，之后再把输入和计算接回来。普通print仍可显示结果；本课增加的是让值与含义一起呈现的方法。"),
  ]},
  {id:"first-format",title:"f前缀告诉Python：这里要放入当前值",navGroup:"format",navLabel:"文字与名称",blocks:[
   p('f-string（格式化字符串）在开头引号前写f。成对英文引号仍界定整段文字，Total kg: 是说明；{total_mass}这一对花括号标出插入位置。运行到这条字符串时，Python读取total_mass当前对应的值，组成文字，再由print显示。f紧挨开头引号，花括号内先只用已经赋值的简单名称。'),
   p("另建insert_mass.py，先预测下面一行显示什么，再保存运行。Windows在文件所在目录用python insert_mass.py，macOS用python3 insert_mass.py；一直使用已核验py的Windows环境可保持py。用pwd及dir（macOS用ls）核对目录；源码在.venv外、行首不缩进。命令写终端，不写进.py或Python的>>>。后面新文件替换同一命令的文件名并保存重跑。"),
   sample("insert"),output("f-string · 预期print结果","Total kg: 6.0"),
   p("对照另存literal_mass.py：去掉开头f，仍是合法Python普通字符串。先预测花括号会消失还是原样显示，再运行核对。"),
   sample("literal"),output("普通字符串 · 预期print结果","Total kg: {total_mass}"),
   p("普通字符串没有请求插入值，所以花括号和名称原样显示；它没有发生语法错误。对比两份源码和真实结果，指出哪个f在起作用，不能认为所有引号里的花括号都会自动替换。"),
  ]},
  {id:"labels-and-units",title:"每一行都说清名称、数量或单位",navGroup:"format",navLabel:"文字与名称",blocks:[
   p("再把三个已知值分别放进说明。item_name是物品名称，count是件数，total_mass是总千克数；三个花括号各读取自己的名称。先预测三行，再保存known_summary.py运行："),
   sample("labels"),output("已知值摘要 · 预期print结果","Item: Parcel\nCount: 4\nTotal kg: 6.0"),
   p("每条print单独一行。Count在本例数的是件，Total kg明确总质量单位，不要在数值赋值后直接写kg；单位属于输出说明。中文说明同样合法，另存chinese_mass.py，先预测再运行下面两行："),
   sample("chinese"),output("中文单位 · 预期print结果","总质量（千克）：6.0"),
   p("英文标签不是唯一正确形式，关键是让别人分清每个值的含义。6.0是本次float普通显示，不是故障，本节也不要求补成6.00。float有表示精度边界，若自己的其他合法输入显示较长小数，保留真实结果并核对，不为排版改类型或伪造日志。"),
  ]},
  {id:"receive-values",title:"先收三项输入，暂时只观察提示",navGroup:"assembly",navLabel:"逐步组装",blocks:[
   p("现在把已知值换成本次使用者输入。物品名、完整件数、单件质量是三项不同的数据，先按2.5分别保存原文字。另建receive_parcel.py，保存下方完整三行；先预测会出现几次等待，再启动。"),
   sample("receive"),
   p("Item: 出现输入Parcel、Enter；Count: 出现输入4、Enter；Mass kg: 出现输入1.5、Enter。每项各占一行输入，不把三个值合成一行，也不在数值后附加单位。这版没有print，收齐三项后结束，尚不会显示计算结果。"),
   {type:"table",caption:"三份原输入的角色",columns:["名称","本次输入内容","此时的值类型/含义"],rows:[["item_name","Parcel","str，物品名称"],["count_text","4","str，待转换的件数文本"],["mass_text","1.5","str，待转换的单件千克数文本"]]},
   p("input提示属于程序stdout但无自动换行，终端通常回显你键入的字符；它们都不是print结果。自动stdin输入没有同样的键盘回显，这版捕获stdout只有下面三个连续提示。标注的示意、终端流和原始stdout要分开。"),
   output("自动stdin捕获 · 无print、无键盘回显","Item: Count: Mass kg: "),
  ]},
  {id:"calculate-check",title:"把件数和单件质量变成总量，再比较",navGroup:"assembly",navLabel:"逐步组装",blocks:[
   p("接下来int(count_text)得到整数件数count，float(mass_text)得到单件质量mass；原来的两个_text仍是字符串。count * mass用件数乘千克/件，得到总千克数，先保存为total_mass。"),
   p("本例规定总质量最多10千克，恰好10也满足。total_mass <= 10复用2.4的比较，先把True或False保存为within_limit。它只回答这个总质量问题，还没有执行批准或拒绝等行动。"),
   p("另存calculate_parcel.py，保存下面完整累计版。先手算Parcel/4/1.5，再依次输入运行；末尾两条print暂时核对总量和比较，仍用普通裸值显示。"),
   sample("calculate"),output("Parcel / 4 / 1.5 · 仅print结果","6.0\nTrue"),
   p("4件×1.5千克/件为6.0千克，6.0<=10为True。若此处与预测不同，先核对实际键入、转换后的名称和乘法；正确之后再整理文字，不靠改输出标签掩盖计算错误。"),
  ]},
  {id:"main-example",title:"最后接上四行可读摘要",navGroup:"summary",navLabel:"完整摘要",blocks:[
   p("输入、转换、总量与比较都已观察，再用四条f-string替换末尾裸值输出。第1条读item_name，显示物品；第2条读整数count，显示件数；第3条读total_mass并写总千克数；第4条读within_limit，并明确它问是否不超过10千克。比较先保存，不藏进花括号。"),
   p("新建parcel_summary.py，先写Parcel/4/1.5的四行预测，再保存完整主例。下面空行只是分组，每次从头执行。"),
   sample("main"),output("Windows · PowerShell · 文件所在目录","python parcel_summary.py"),output("macOS · 终端 · 文件所在目录","python3 parcel_summary.py"),
   output("Parcel / 4 / 1.5 · 仅四条print结果","Item: Parcel\nCount: 4\nTotal kg: 6.0\nWithin 10 kg: True"),
   p("这四行不是终端全部内容；input提示与键盘回显另行标记。自动stdin提供三行数据时，原始stdout的提示会紧邻第一条print，实际捕获形式如下，末尾有换行，不能补造三行回显："),
   output("自动stdin stdout · 提示与print连续","Item: Count: Mass kg: Item: Parcel\nCount: 4\nTotal kg: 6.0\nWithin 10 kg: True\n"),
  ]},
  {id:"boundary-runs",title:"源码不变，换低于、等于和高于上限的数据",navGroup:"summary",navLabel:"完整摘要",blocks:[
   p("保留parcel_summary.py原样。第一轮Parcel/4/1.5已经是低于10；先保留自己的输入、预测与真实四行结果。第二轮先预测Crate B/4/2.5，重新执行同一命令，依次键入。手算4×2.5=10.0千克，最后一行该是真还是假？"),
   p("第三轮再先预测Crate C/4/3.0，完整重新启动并输入，手算总12.0千克。保留三轮命令、输入、源码和实际四行摘要，再按表核对，不用一次输出或抄表代替三次运行。"),
   {type:"table",caption:"完成三轮后核对总质量与同一比较",columns:["物品/件数/单件千克","总千克数","Within 10 kg"],rows:[["Parcel / 4 / 1.5","6.0","True"],["Crate B / 4 / 2.5","10.0","True"],["Crate C / 4 / 3.0","12.0","False"]]},
   p("等于10.0时<=仍为True，因为最多包括等值；超过时False。这个真假只报告本次总质量是否不超过10千克，没有检查包装或运输条件，也没有自动执行拒绝。输出说明必须对应实际比较，不能把它改写成“所有条件下都安全”。"),
  ]},
  {id:"practice",title:"自己选择情境，交出可读结果与边界证据",navGroup:"practice",navLabel:"独立练习",blocks:[
   p("先合上参考，自建短.py，正式源码和真实运行保存在本地。网页框只是临时笔记；每轮先预测，命令/提示/输入回显/print分开标记，用简短说明解释数据流即可。"),
   {type:"exercise",id:"write-clear-summary",title:"自己的可读计算摘要",kind:"代码",
    prompt:"另选与正文不同的测量情境，例如材料件数和单件长度，自选合法名称和清楚提示，创建新.py。input取得文字标签、整数数量文本、小数测量文本，分别用int/float明确转换，再用乘法求有实际意义的总量。用简单f-string显示标签、件数和总量，写清各项含义与单位。先预测两组不同的新合法输入，保存同一源码后分别从终端实际输入运行，保留命令、两组输入/预测/print结果及数据流说明；不能照抄正文物品和整组数字。指出一条f-string去掉f后为何会不同，可另存副本观察。英文或中文输出均可，不用if、循环、函数或格式指定。",
    hints:["哪一项应保留为文字，哪两项要成为数值？单件测量乘件数后是什么单位？读者能从每行知道这是哪个量吗？","按输入、分步转换、计算、说明文字中的名称组织。花括号中先只放已经赋值的名称；自己确定主题、新数据和两轮预测。"],
    solution:["参考横幅材料，每片长度以米计。页尾material_summary.py给出完整路径，先独立完成再展开。第1–3行收材料名/片数文本/单片米数；第4–5行转成pieces整数和length浮点；第6行两者相乘存总米数。",
     "第7–9行分别显示材料名、片数、Total m总米数。Banner A/6/0.75先预测Material: Banner A、Pieces: 6、Total m: 4.5，保存运行python material_summary.py（macOS用python3）。同源码第二轮Banner B/10/0.5先预测总5.0米，再实际重新启动输入。",
     "前者6片×0.75米/片=4.5米，后者10片×0.5米/片=5.0米。f-string只读取已经取得的名称，不会替你转换或重算输入。去掉最后一条f会显示文字{total_length}；补回f才能插入当前总值。",
     "常错是花括号内错拼名称、少f、用原文本计算、把单片质量/长度当总量或遗漏单位。按输入→转换→总量→文字逐项核对。接受其他新情境/名称、中文标签、成对单引号或先保存中间结果，但需真实两轮和清楚单位；参考预测不是本人运行证据。"],
    rubric:["本人新.py真实取得三输入并分步int/float转换，使用转换后数量求总量，名称/提示/情境由本人设计。","简单f-string插入正确已绑定名称，标签/件数/总量及单位让别人可辨；能区分少f的普通字符串。","两组新合法输入均有本人事先预测、同一保存源码、真实命令与输出，关系/单位和数据流解释可核对，抄参考或读完标记不足。"]},
   {type:"exercise",id:"verify-summary-boundary",title:"验证摘要边界，并解释真假回答了什么",kind:"代码",
    prompt:"自选与物品质量主例不同的测量限制情境，例如材料总长度最多若干米。可复用题一结构，但保留题一/题二阶段源码与实际修改记录。真实input取得名称、正整数件数、小数单件测量，明确int/float转换并算总量；自己固定一个合理上限，用总量<=上限保存布尔结果，再用f-string显示名称、件数、总量/单位和明确的比较问题及真假。先选低于、恰好等于、高于上限三组合法输入，各先预测再完整运行同一源码，保留三组命令/输入/实际摘要和固定上限。选整数、0.5或0.25等易手算数据，让等值确实达到。解释等值为何True、超限False只表示此比较不满足而没有执行拒绝。不把一次运行重复计数，不用if/循环/复杂精度算法。",
    hints:["分清单件测量、总量和限制。应该拿哪一项与上限比较，输出里的真假文字又在问哪个问题？","先确定能恰好达到的边界，再在同一固定上限下安排低/等/高三组输入，先预测再逐轮执行。保留你决定的数据、比较名称和完整代码。"],
    solution:["参考花坛围边，最多12米。页尾garden_boundary.py先收批次、段数和每段米数，转strips整数与strip_length浮点；length_limit固定12，total_length=strips * strip_length，within_limit保存总长<=上限。四条f-string分别显示批次、段数、总米数和Within 12 m问题。",
     "同一文件Garden A/3/3先预测总9.0米/True，再运行python garden_boundary.py（macOS用python3）；Garden B/3/4先预测12.0米/True，重新输入运行；Garden C/3/5先预测15.0米/False，再完整重跑。每轮名称和段数也要和实际摘要对应，保留全部四行。",
     "等值12.0满足最多12，<=包含相等；15.0超过所以False。True不证明其他条件都满足，False也没让程序拒绝输入，这段没有分支动作。输出Within {length_limit} m中的两个插入位置分别读取限制和真假值，花括号都只是简单名称。",
     "常错是改了上限、比较单段而非总量、实际没到等值、三轮只抄参考或将False写成已拒绝。按实际输入重算，保留固定源码、预测和命令。接受其他合理新上限/数据/名称/中文问题；若复用题一，必须能看出新增比较与第三轮证据，不把题一一次运行算成三轮。"],
    rubric:["本人真实输入/转换/计算，单件与总量关系、单位和固定上限正确，比较确实使用总量<=上限。","三组新数据分别低/等/高，各有预测、同一源码、真实命令与完整可读输出，上限不随轮次改变。","等值True/超限False正确，文字明确比较对象和单位，解释其范围及没有自动拒绝动作。","简单f-string与已学语法完成；若复用题一有阶段源码/修改记录和独立三轮，固定表或一次截图不能替代。"]},
  ]},
  {id:"reference-programs",title:"做完再核对：完整参考与名称错拼副本",navGroup:"reference",navLabel:"参考核对",tier:"verification",blocks:[
   p("先完成两题再展开参考，另存新文件保留原作。前两份完整程序的行义、预测与命令在各题解答中，不将列表文字当连写源码。"),sample("ownSummary"),sample("ownBoundary"),
   p("若想核对名称问题，在自己的field_copy.py副本先预测下面程序：花括号里的total_mas少一个s，本次没有绑定。按2.1检查名称，实际运行保留第2行NameError、相关回溯和退出状态；它与少f的合法字面输出原因不同。"),sample("nameError"),
   p("保留错误后，将同一副本只修为total_mass，先预测再保存完整重跑下面修复版，应显示Total kg: 6.0且正常结束。无需核心题故意造错，也不加入异常捕获。"),sample("nameRepair"),
  ]},
  {id:"chapter-end",title:"第二章收束：能说明结果，也知道还没学什么",navGroup:"finish",navLabel:"章末衔接",blocks:[
   {type:"summary",points:["保存与更新变量，辨认基本类型，写有单位的数值表达式和比较。","从终端取得文字，明确int/float转换，再计算和保存判断。","用简单f-string把名称、数量、单位和比较问题一起显示，用真实低/等/高输入核对。"]},
   p("保留本人代码和短记录，能现场换一组新数据、预测并解释每行含义，才有这些操作的证据。网页读完或作者测试通过不等于学生已能独立完成。"),
   p("第二章六节的技术制作已齐，教材仍待人工教学审核，整门PY101继续筹备。课程体系下一章是「分支、循环、推导式与常见控制流程」，当前尚无正式节级规划或可读正文。本章还没有教授分支、循环、容器、函数或CSV数据工具。第5章虽有旧试读，仍需第三、第四章等中间先修；技术导航跳到第5章不是零基础直接学习建议。"),
  ]},
 ],resources:[],references:[
  {title:"f-string教程",href:"https://docs.python.org/3.14/tutorial/inputoutput.html#formatted-string-literals",note:"先解释前缀与替换字段。"},
  {title:"f-string词法规则",href:"https://docs.python.org/3.14/reference/lexical_analysis.html#f-strings",note:"本课只用已绑定简单名称。"},
  {title:"print与input",href:"https://docs.python.org/3.14/library/functions.html#print",note:"提示、终端回显和print分开。"},
  {title:"int/float转换",href:"https://docs.python.org/3.14/library/functions.html#int",note:"输入文本明确转换再计算。"},
  {title:"数值比较",href:"https://docs.python.org/3.14/reference/expressions.html#value-comparisons",note:"结果只对应实际数量关系。"},
 ],
});
