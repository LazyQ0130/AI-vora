import { lessonSchema, type ContentBlock } from "../../models";
import { valueTypeCode, valueTypeBlockNames, type ValueTypeKey } from "../../resources/python-value-types";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const text = (filename: string, code: string): ContentBlock => ({ type: "code", filename, code, language: "text" });
const sample = (key: ValueTypeKey): ContentBlock => ({ type: "code", filename: valueTypeBlockNames[key], code: valueTypeCode[key], language: "python" });

// 课前简报、预解、官方事实及真实运行：docs/py101-p9/。无新下载，学生自行建.py。
export const pythonBasicValueTypesLesson = lessonSchema.parse({
  id: "PY101-C02-L02", courseId: "PY101", chapterId: "PY101-C02", title: "分清文字、整数、小数和真假值",
  contentVersion: 2, optionalLesson: false,
  subtitle: "两个值都显示3，怎样知道一个是数量、另一个是文字？先预测，再用type取得证据。",
  prerequisites: "已完成第一章与2.1：能选合法名称、赋值和重新赋值，区分名称与引号文字，使用print，保存并从终端完整运行.py。沿用已有Python 3和编辑器，无需安装库；手机可读，代码操作需要电脑。",
  prerequisiteLinks: [
    { title: "2.1 名称与当前值", href: "/learn/PY101/PY101-C02-L01#name-and-value", note: "复习赋值、绑定和名称读取。" },
    { title: "2.1 名称与引号内文字", href: "/learn/PY101/PY101-C02-L01#literal-or-name", note: "复习固定字符串与名称读取的差别。" },
    { title: "2.1 保存并运行完整脚本", href: "/learn/PY101/PY101-C02-L01#predict-run", note: "补齐预测、保存及实际执行。" },
    { title: "1.3 保存与重跑", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "核对保存状态和准确执行目标。" },
  ],
  objectives: [
    "按文字标记、完整件数、测量值和真假状态的用途，独立选择Python字面量、写入变量并说明理由",
    "在真实.py中用type取得str、int、float、bool的类型证据，解释为什么相同显示不代表相同类型",
    "保持名称不变，预测并验证整数与数字文本的重新绑定，换新数值重跑并解释当前值与类型的关系",
  ],
  assessmentMap: [{ objective: 1, exerciseIds: ["write-four-values"] }, { objective: 2, exerciseIds: ["write-four-values", "same-display-different-type"] }, { objective: 3, exerciseIds: ["same-display-different-type"] }],
  learningTime: { reading: [12,18], practice: [6,10], coding: [12,18], basis: "editorial-estimate" },
  sections: [
    { id: "same-display", title: "两个值都显示3，就一样吗？", navGroup: "values", navLabel: "先看值", blocks: [
      p("整理物品时，一份记录要保存物品数量，另一份记录要保存标签上印的文字。数量是3，标签文字恰好也是“3”。用2.1学过的赋值，可以分别交给两个名称。它们在屏幕上会有什么不同？先在本地笔记写下下面两个print的预测。"),
      sample("sameDisplay"),
      p("新建same_display.py，保存四行源码，在文件所在目录用下方命令整份运行。沿用已验证的Python；先预测两次普通显示是否不同。"),
      text("Windows · PowerShell · 文件所在目录", "python same_display.py"),
      text("macOS · 终端 · 文件所在目录", "python3 same_display.py"),
      text("普通输出 · 运行后核对", "3\n3"),
      p("两行确实都显示3。第一份值3没有引号，是整数；第二份值\"3\"有配对引号，是字符串，保存的是文字。数字字符放进字符串后仍然是文字，不会因为外观看起来像数量就自动变成整数。"),
      p("类型描述值属于哪种数据类别。整数的类型名是int，字符串的类型名是str。print把值显示为文字，引号本身不显示，所以这两次普通输出没有把原来的类型差别呈现出来。我们稍后会用一个观察工具核对，先再认识两种常用的值。"),
    ] },
    { id: "add-measurement", title: "测量值怎样写进程序？", navGroup: "values", navLabel: "先看值", blocks: [
      p("同一批物品还要记录单件质量，单位约定为千克，数值为1.5。把下面两行另存为measurement.py，先预测，再把运行命令中的文件名换成它，保存并完整执行。"),
      sample("measurement"), text("测量例 · 预期输出", "1.5"),
      p("1.5这种带小数点的数值写法在这里得到float类型，通常称为浮点数；如果写成\"1.5\"，得到的仍是str文字。程序中数值不加引号，单位由记录说明，不把kg直接接在数值后面。"),
      p("float有表示精度的限制，不能保证任意十进制小数都能精确保存。本课先学习辨认和观察这种类型，暂时不做精度运算。int可以表示完整件数，float适合本例中的测量记录，两者的用途要结合你保存的内容判断。"),
    ] },
    { id: "ready-state", title: "准备好了，是状态还是文字？", navGroup: "values", navLabel: "先看值", blocks: [
      p("除了数量和质量，还可以记录“是否已经准备好”。True表示真，False表示假，这两个值属于bool类型，也叫布尔值。Python中必须按True、False的大小写写，开头大写，其余小写；它们本身不加引号。"),
      p("下面让is_ready记录已准备好，让is_waiting记录当前没有在等待。ready_text则只保存标签上写的True这个单词。先预测三条普通输出，再保存为ready_state.py并完整运行。"),
      sample("booleanValues"), text("状态与文字 · 预期输出", "True\nTrue\nFalse"),
      p("前两行看起来相同：True是真假状态值，\"True\"是带引号的字符串。第三行False也是bool值。名字里的is只是帮助人读懂用途，并不替Python决定类型；值实际怎样写才是接下来要核对的依据。"),
    ] },
    { id: "inspect-type", title: "用type看当前值属于哪一类", navGroup: "inspect", navLabel: "观察类型", blocks: [
      p("type是Python自带的类型观察工具。把一个值或已有名称放在它的括号中，它会取得这个值的类型。这里使用一个参数，也就是括号中交给它的一份值；观察不会把原值转换成另一类型。自己选变量名时，先把print和type这两个名字留给现成工具。"),
      p("回到same_display.py，在原四行后追加下方观察语句。先从内层看：item_count读到3，type取得它的类型，外层print再显示这个结果。"),
      p("两层括号分别配对。先预测新增一行，再保存从头运行；本次没有把3转换成另一类型。"),
      sample("firstType"), text("新增类型输出 · 接在两行3之后", "<class 'int'>"),
      p("<class 'int'>是Python显示“这是int类型”的一种形式。连同尖括号、单引号一起看，这是刚才程序的输出，不是要复制到.py中的新语句；本课不需要学习class定义。"),
      p("现在另建inspect_pair.py，使用原来的3和\"3\"。先写两次类型预测，再保存并运行下面的完整小程序。"),
      sample("pairTypes"), text("两份值的类型 · 预期输出", "<class 'int'>\n<class 'str'>"),
      p("两次普通显示都是3，type却分别给int和str。如果你先前认为显示相同就类型相同，混淆的是“屏幕文字”和“原值类别”。"),
      p("在inspect_pair.py里把两份值对应换成7和文字7，先预测，再重跑两次type核对；只改数值，不引入转换。"),
      p("再回到ready_state.py，在原有代码末尾加上这三行。它们读取该文件前面已经赋值的三个名称，先预测各自类型，再保存并从头运行整个文件。"),
      sample("booleanTypes"), text("追加的三条类型输出 · 接在原三条普通输出后", "<class 'bool'>\n<class 'str'>\n<class 'bool'>"),
      p("True和False在这里都观察为bool，带引号的\"True\"观察为str。若本来想写状态却得到str，先检查是否把True或False放进了引号；若报NameError且提到true或false，再核对字面量大小写和实际代码，不把这种拼写问题当成缺包。"),
    ] },
    { id: "four-types", title: "把四种值和观察结果放在一起", navGroup: "inspect", navLabel: "观察类型", blocks: [
      p("把前面的观察组合成four_values.py：前四行赋值，中间四行显示值，最后四行显示类型。空行只是分开这三组，方便阅读。先预测八行输出，再保存，从终端完整运行它。"),
      sample("main"), text("完整主例 · 八行预期输出", "3\n3\n1.5\nTrue\n<class 'int'>\n<class 'str'>\n<class 'float'>\n<class 'bool'>"),
      p("将真实结果和预测逐行比较。item_mass对应的1.5为float，is_ready对应的True为bool；前两行普通显示相同，末尾的类型记录却能区分整数与数字文本。下面这张表只收拢已经观察过的四种写法，独立练习还要换成你自己的值。"),
      { type: "table", caption: "四种基本值的写法与本课用途", columns: ["类型", "例子", "本课主要用途"], rows: [
        ["str", '\"Box A\"', "文字、标记"], ["int", "3", "完整件数"], ["float", "1.5", "测量数值"], ["bool", "True或False", "真假状态"],
      ] },
    ] },
    { id: "same-name-new-type", title: "名字没换，当前值的类型可以换", navGroup: "rebind", navLabel: "同名与类型", blocks: [
      p("2.1中，你给同一名称换过另一段任务文字。这次把batch_count先交给整数8，再改为对应数字文本\"8\"。先预测下面四行输出：哪两行显示的文字相同，哪两行给出不同类型？名称有没有换？写好再保存为changing_type.py并完整运行。"),
      sample("rebind"), text("同名重新赋值 · 预期输出", "8\n<class 'int'>\n8\n<class 'str'>"),
      p("名称一直是batch_count。第一次读取时，它对应整数8；第二次赋值后，它对应字符串\"8\"。类型来自当前读到的值，没有永久固定在变量名上。这次赋值让同一名称改为对应另一份值，并没有把原来那个整数本身改成字符串。"),
      p("所以只看名称叫不叫count，或者普通输出有没有数字字符，都不足以判断类型。先看本次实际执行的赋值，再用type观察当前值，就能核对自己的判断。"),
    ] },
    { id: "practice", title: "换成自己的值，留下类型证据", navGroup: "practice", navLabel: "独立练习", blocks: [
      p("先独立写程序，再按需展开提示。基本交付是本人源码和本题真实运行结果；同一会话的环境、文件位置和命令只记一次，后面可引用编号。预测可口述或记一行；边界、改值和恢复题按题干保留必要对照。"),
      { type: "exercise", id: "write-four-values", title: "自己建立四类值", kind: "代码",
        prompt: "新建.py，自选新情境，为文字标记、完整件数、测量值与真假状态选择合法名称和新值。先口头预测显示及类型，自己写赋值、print和type观察，保存运行。交本人源码和完整真实结果；命令引用会话卡。现场逐项对照类型，并简述用途，测量注明单位；有预测差异记一行修正即可，无须另抄四项长预测表。",
        hints: ["先看你选的值怎样写：有没有引号，是完整整数、带小数点的数值，还是真假状态？要保存的是文字还是数量？", "先组织四份赋值，再逐项显示值和类型；每次type读取的名称要与赋值一致。保持两层括号配对，仍由你填入情境、名字、新值和预测，再保存运行。"],
        solution: [
  "例如改用绘画用品情境，新建drawing_kit.py。下面每个“第几行”都各写一行，分隔说明不输入源码；你自己的情境和值应另选。",
  "先保存四份值：第1行：kit_label = \"Sketch kit\"；第2行：pencil_count = 6；第3行：pencil_length_cm = 17.5；第4行：is_packed = False。标签是文字用str，6支铅笔是完整件数用int，17.5厘米长度是测量值用float，尚未装好用False表示bool状态。",
  "接着显示四份值：第5行：print(kit_label)；第6行：print(pencil_count)；第7行：print(pencil_length_cm)；第8行：print(is_packed)。再观察四个类型：第9行：print(type(kit_label))；第10行：print(type(pencil_count))；第11行：print(type(pencil_length_cm))；第12行：print(type(is_packed))。名称先赋值再读取，print与type的括号分别配对。",
  "先预测八行：Sketch kit、6、17.5、False、<class 'str'>、<class 'int'>、<class 'float'>、<class 'bool'>。保存后运行python drawing_kit.py（macOS用python3，已核验的py也可），交本人真实结果与对照，而非只抄这组预期。",
  "常错是将6写成\"6\"、将False写成\"False\"，它们能运行却会得到str；写成false而此前没有该名称会NameError；漏一边引号可能SyntaxError。若测量写成17，观察为int；17.0则为float。根据实际用途和type结果修正，接受不同合法名称、单引号、中文标签或其他新的合理值。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "新情境、四个合法名称与四种新值符合文字/件数/测量/真假用途。",
  "真实显示和type结果确认str/int/float/bool，与事前口头预测核对；差异有修正。",
  "单位及True/False、引号正确，理由可现场说明，命令一次共用，源码运行不可省。"
],
      },
      { type: "exercise", id: "same-display-different-type", title: "相同显示，不同类型", kind: "代码",
        prompt: "另建.py，选不为3或8的新非负完整件数和合法名称。先赋整数并显示值/type，再将同名赋对应数字文本并显示值/type。预测四行后实跑；再换另一组对应整数/文本，预测、保存、完整重跑。交一份源码加两处改值、两轮简短预测和真实输出，命令记一次；解释显示相同为何类型不同、名称为何不能决定类型。不用转换或运算。",
        hints: ["沿实际执行顺序看同一个名字：第一次对应的值带引号吗？后一次呢？分别预测普通显示与类型观察。", "为每次赋值配上显示值和显示类型两步，保证两个阶段读取同一名称；换新数量时检查整数和数字文本是否仍对应，再由你保存重跑并核对。"],
        solution: [
  "例如新建crate_types.py，选crate_total和完整件数12。六行依次为：第1行：crate_total = 12；第2行：print(crate_total)；第3行：print(type(crate_total))；第4行：crate_total = \"12\"；第5行：print(crate_total)；第6行：print(type(crate_total))。两阶段保持同名，整数不加引号，数字文本使用配对引号。",
  "先预测四行12、<class 'int'>、12、<class 'str'>，再运行python crate_types.py（macOS用python3）。普通显示相同，因为文字12打印时不显示包住它的引号；类型分别来自整数和字符串。",
  "第二轮仍用crate_total，换27和\"27\"，六行依次为：第1行：crate_total = 27；第2行：print(crate_total)；第3行：print(type(crate_total))；第4行：crate_total = \"27\"；第5行：print(crate_total)；第6行：print(type(crate_total))。先预测27/int/27/str（类型的完整显示形式同上），保存并完整运行，交本人真实四行结果。",
  "名称没有改变，后一次赋值让它对应另一类型的值；type读取本次当前值，而不是从crate_total的拼写猜类型。接受其他新整数和合法名称，数字文本用单引号或双引号都可。",
  "常错是两个阶段换了不同名称、只打印值未观察类型、把字符串再次写成无引号数字，或改新数量后没保存重跑。若只改一阶段，普通显示会不同，先对照题意与实际源码修正；不要引入转换来绕过两种字面量写法。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "同名两阶段分别为整数/对应字符串，均有真实值和type显示，自选新数据。",
  "两组数量均先预测再完整运行，源码加差异与两轮输出对应，命令不重复誊写。",
  "结合输出说明同显异型及当前值决定type，解释可现场或短句，不要求长报告。"
],
      },
    ] },
    { id: "next-step", title: "先确认值的类型，再准备使用它", navGroup: "finish", navLabel: "回顾与后续", blocks: [
      { type: "summary", points: ["给文字、完整件数、测量值和真假状态选择合适的字面量，分别观察str、int、float、bool。", "普通print可能让不同类型看起来相同；读取名称，取得type结果，再显示它，可以核对类型。", "同一名称可以先后对应不同类型的值。预测、保存和完整重跑，检查每一次读取发生时对应什么。"] },
      p("保留自己的两份程序及类型结果。名字保持不变而当前值变化时，再读一次type，就能核对本次类型来自哪里。"),
      p("下一节2.3把这些数值写成计算表达式。先分清数量与数字文本，才能检查算式和单位是否符合实际问题。第5章函数还需要表达式与控制流程基础。"),
    ] },
  ], resources: [],
  references: [
    { title: "Python内置类型", href: "https://docs.python.org/3.14/library/stdtypes.html", note: "核对字符串、整数、浮点数和布尔值的基本意义。" },
    { title: "type单参数观察", href: "https://docs.python.org/3.14/library/functions.html#type", note: "核对取得值类型的行为，本课不涉及三参数形式。" },
    { title: "Python入门", href: "https://docs.python.org/3/tutorial/introduction.html", note: "数值、字符串及赋值的短例。" },
    { title: "数据模型中的值与类型", href: "https://docs.python.org/3.14/reference/datamodel.html#objects-values-and-types", note: "核对类型与值的关系，不要求学习对象机制。" },
    { title: "浮点数的表示限制", href: "https://docs.python.org/3.14/tutorial/floatingpoint.html", note: "核对精度边界，详细原理留后续按需学习。" },
  ],
});
