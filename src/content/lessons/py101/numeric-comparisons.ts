import { lessonSchema, type ContentBlock } from "../../models";
import { comparisonCode, comparisonBlockNames, type ComparisonKey } from "../../resources/python-comparisons";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const output = (filename: string, code: string): ContentBlock => ({ type: "code", language: "text", filename, code });
const sample = (key: ComparisonKey): ContentBlock => ({ type: "code", language: "python", filename: comparisonBlockNames[key], code: comparisonCode[key] });
const lines = (key: ComparisonKey) => comparisonCode[key].split("\n").map((line,i) => `第${i+1}行：${line}`).join("；");

// 课前简报、独立预解、官方事实与保存文件实跑：docs/py101-p11。沿用现有Reader，无新下载。
export const pythonNumericComparisonsLesson = lessonSchema.parse({
  id: "PY101-C02-L04", courseId: "PY101", chapterId: "PY101-C02", title: "让比较表达式给出真假结果",
  contentVersion: 1, optionalLesson: false,
  subtitle: "最多能放6件，刚好6件算不算满足？先写判断，再用三个边界值核对。",
  prerequisites: "已完成第一章和2.1–2.3：会用变量保存整数，使用print，认识True/False与bool，理解右侧表达式求值再赋值，能预测、保存并从终端完整运行.py。沿用现有Python 3和编辑器，不装库；手机可读，代码操作需要电脑。",
  prerequisiteLinks: [
    { title: "2.1 读取与更新", href: "/learn/PY101/PY101-C02-L01#read-and-update", note: "回顾=赋值和读取当前值。" },
    { title: "2.2 真假状态", href: "/learn/PY101/PY101-C02-L02#ready-state", note: "回顾True、False与字符串的差别。" },
    { title: "2.2 观察类型", href: "/learn/PY101/PY101-C02-L02#inspect-type", note: "需要时复习type的观察用途。" },
    { title: "2.3 先求右侧结果", href: "/learn/PY101/PY101-C02-L03#expression-to-value", note: "把已有数值表达式经验接到比较结果。" },
    { title: "1.3 保存与重跑", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "核对保存状态与实际运行文件。" },
  ],
  objectives: [
    "根据新的数量规则选择数值比较运算符，在自己创建的.py中取得真实True/False并解释判断含义",
    "区分赋值=与相等比较==，正确使用相等和不等比较，先预测再核对实际布尔结果",
    "固定限制值，手动改成低于、等于、高于的三个实际值，保存重跑并说明比较是否包含边界",
  ],
  assessmentMap: [{ objective: 1, exerciseIds: ["compare-and-explain", "test-boundary-values"] }, { objective: 2, exerciseIds: ["compare-and-explain"] }, { objective: 3, exerciseIds: ["test-boundary-values"] }],
  learningTime: { reading: [10,15], practice: [6,10], coding: [12,18], basis: "editorial-estimate" },
  sections: [
    { id: "most-six", title: "刚好装到上限，也算满足吗？", navGroup: "meaning", navLabel: "规则与判断", blocks: [
      p("一个收纳盒最多允许放6件物品，现在放了5件。先用一句话判断：现在是否满足“最多6件”？如果再放1件，恰好6件呢？“最多”包括刚好达到上限的情况，超过6件才不满足这条规定。"),
      p("把实际件数交给count，把最大件数交给limit。两个值都是整数，也都以“件”为单位，可以直接比较。这里的边界就是限制值6；接下来要让Python给出能核对的真假结果。"),
    ] },
    { id: "compare-limit", title: "把“最多”写成一个比较式", navGroup: "meaning", navLabel: "规则与判断", blocks: [
      p("Python用<表示小于：左边严格小于右边时才为真，恰好相等不算。<=表示小于或等于，既包括小于，也包括相等。<=是两个字符连续写成的一个比较运算符，中间不拆开。"),
      p("count <= limit把实际数量放左边、限制值放右边，判断实际数量是否小于或等于限制。像这样用比较运算符连接两个值的写法，叫比较表达式。本节比较普通整数，结果是2.2认识的布尔值True或False。先写下5件与最多6件的预测，再输入下方完整程序。"),
      sample("basic"),
      p("在自己的练习文件夹新建capacity_check.py，行首不加缩进，源码放在.venv外。保存后用pwd和Windows的dir确认文件，沿用已核验的解释器运行第一条命令；macOS用pwd、ls确认后运行第二条。此前一直用py的Windows环境可保持py。后面的新文件只替换命令中的文件名，每次都保存并从头运行整份.py。"),
      output("Windows · PowerShell · 文件所在目录", "python capacity_check.py"), output("macOS · 终端 · 文件所在目录", "python3 capacity_check.py"), output("首次比较 · 预期输出", "True"),
      p("True回答的是“5是否小于或等于6”，与本题“最多6件”一致。比较只取得这个判断；程序还没有根据结果选择行动。先能写出并解释真假结果，就可以完成本节任务。"),
    ] },
    { id: "keep-result", title: "比较的结果也能交给一个名称", navGroup: "assignment", navLabel: "赋值与比较", blocks: [
      p("2.3中，右边先算出数量，再由=保存结果。比较也可以这样做：右侧count <= limit先得到True，=再让within_limit对应这个布尔值，随后print读取它。名称表示“在限制之内”，保存的是这一次的真假结果。"),
      p("在capacity_check.py原三行末尾追加下面两行，保留该文件前面的count和limit赋值。先预测新增输出，再保存完整运行；它依赖前两项赋值，不能放进空文件直接执行。改数值后也要完整重跑，让比较那一行再次执行。"),
      sample("saveResult"), output("新增一行 · 接在首次True之后", "True"),
    ] },
    { id: "equal-or-different", title: "=保存值，==判断是否相等", navGroup: "assignment", navLabel: "赋值与比较", blocks: [
      p("若想问“是不是刚好达到6件”，用==比较左右两个值是否相等。它是一个比较运算符，得到True或False，不是执行两次赋值。!=则判断两值是否不相等。符号都连续写；=仍负责给名称赋值，不能代替==来问相不相等。"),
      p("在capacity_check.py末尾继续加这两行。先根据该文件仍为5和6的当前值分别预测，再保存从头运行。新增两行输出各在回答什么？"),
      sample("equalNot"), output("追加的两行 · 接在两个True之后", "False\nTrue"),
      p("5与6不相等，所以==得到False，!=得到True。这两次比较没有把count改成6；它仍保存5。区别可以再用一份合法的小程序观察：先给count赋5并比较，再重新赋6并比较。先预测两行，再保存为assignment_or_comparison.py完整运行。"),
      sample("assignCompare"), output("赋值后再比较 · 预期输出", "False\nTrue"),
      p("第一条赋值让count对应5，所以和6相等的判断是假；后一次赋值让它对应6，再作相等判断就是真。两条print中的==取得判断，改变当前数值的是各自前面的=。本题只需这些合法操作来分清两者。"),
    ] },
    { id: "above-limit", title: "超过上限，与至少达到有什么不同？", navGroup: "meaning-two", navLabel: "超过与达到", blocks: [
      p("现在单独看7件与上限6件。>表示大于，左边严格超过右边时为真；>=表示大于或等于，表示“至少达到”，也包括刚好等于。这两个问题与“最多”不同：超过上限时，至少达到上限也为真，但并不表示满足最多6件的规定。"),
      p("先预测下面三行，分别判断7是否超过6、是否至少达到6、是否仍满足最多6。另存为above_limit.py，保存并完整运行。"),
      sample("greater"), output("超过/至少达到/最多 · 预期输出", "True\nTrue\nFalse"),
      p("前两行都为True，因为7确实大于6，也满足大于或等于6。最后一行为False，因为本次已经超过最大件数。等于6时>和>=还会不会相同，稍后用边界实验核对。"),
    ] },
    { id: "main-example", title: "把三项判断放回同一份记录", navGroup: "boundary", navLabel: "边界验证", blocks: [
      p("回到最初5件、最多6件的条件。下面完整主例将不超过、刚好等于、不等于三项判断集中起来。先预测三行，并各写一句含义，再另存capacity_results.py保存运行。"),
      sample("main"), output("完整主例 · 三行预期输出", "True\nFalse\nTrue"),
      p("within_limit保存5不超过6的结果；第二行说明尚未刚好达到6，第三行说明两值不同。每一行都要和自己的判断问题对应，不能只把三个真假词背成固定答案。"),
    ] },
    { id: "boundary-runs", title: "固定上限，验证边界附近三个值", navGroup: "boundary", navLabel: "边界验证", blocks: [
      p("新建boundary_values.py，保持limit为6。下面三条print依次问严格小于、最多、恰好等于。先在笔记写count为5时的三行预测，再保存并完整运行下面的文件，保留源码、命令和真实输出。"),
      sample("boundaryLow"), output("低于边界 · 运行后核对", "True\nTrue\nFalse"),
      p("第二轮只把count的赋值改为6，limit和三条比较都不动。先写新预测，保存，用同一命令完整运行，保留本轮源码与输出。第三轮再只把count改为7，重新预测、保存和运行。三次运行是三份真实证据，一次截图或手抄表格不能代替。"),
      { type: "table", caption: "三轮运行后，按相同输出顺序核对", columns: ["count（件）", "count < limit", "count <= limit", "count == limit"], rows: [["5","True","True","False"],["6","False","True","True"],["7","False","False","False"]] },
      p("最值得看的是count恰好为6：<得到False，<=得到True。前者不包含相等，后者包含相等。若题目规定“最多6件”，6件满足；若规定“必须少于6件”，6件就不满足。符号本身不固定代表允许或禁止，要先读清实际规则。"),
      p("再把等值位置单独拿出来，同时核对已经解释过的六种比较。先预测，保存six_comparisons.py运行。第一条print只是已学的固定文字标签At capacity，后面六条才依次显示比较结果；引号只围住这段文字，不围住整数。"),
      sample("allAtCapacity"), output("等值位置 · 标签及六条预期结果", "At capacity\nFalse\nTrue\nFalse\nTrue\nTrue\nFalse"),
      { type: "table", caption: "同为6件时，不同规则问的是不同问题", columns: ["规则", "本例比较", "6件时"], rows: [["最多6件","count <= limit","True"],["少于6件","count < limit","False"],["至少6件","count >= limit","True"],["多于6件","count > limit","False"],["恰好6件","count == limit","True"],["不等于6件","count != limit","False"]] },
      p("这里每一式只比较左右两个普通整数。两题也先按这个范围操作，分别运行并解释结果；组合多个条件或根据真假改变执行路线，是之后的内容。"),
    ] },
    { id: "practice", title: "自己选规则，再验证含不含边界", navGroup: "practice", navLabel: "独立练习", blocks: [
      p("先合上参考答案，自建两份短.py。正式成果保存在本地，网页输入框只是临时思考区。每轮留源码、命令、预测和真实输出，用简短文字说明规则即可。"),
      { type: "exercise", id: "compare-and-explain", title: "写出自己的三项数量判断", kind: "代码",
        prompt: "另选与正文不同的容量情境，例如收纳架，自行确定合理的整数上限和实际数量，单位相同。不要照抄正文5/6整组数据或count、limit、within_limit这些变量名。创建新的.py，自选合法且有意义的名称保存两个量，写出实际值小于或等于上限、是否恰好等于上限、是否不等于上限三项比较。运行前分别预测True/False，保存并实际运行，逐项将真实结果对应到规则。交本人源码、变量/单位、命令、三项预测与实际结果，再简短说明=、==、!=各自做什么；至少结合一条真实赋值和一条真实相等比较说明。可以直接显示比较，也可先保存布尔结果再显示，不使用if或输入函数。",
        hints: ["先用自己的话问：实际数量有没有超过上限，是否恰好到达，两个值是否不同？两个数量的单位一致吗？", "检查左边实际量和右边上限是否读到你保存的值，再逐项核对比较含义。赋值用于保存，判断相等和不等各有符号；仍由你选名称、数值、最终代码与预测。"],
        solution: [
          `例如改用图书推车，现装9册、容量12册，新建book_cart.py，六行分别为：${lines("ownCompare")}。每条语句各写一行，“第几行”和分隔文字不输入源码。`,
          "loaded_books是实际册数，cart_capacity是最多册数，两者单位都是册；fits_cart接住本次小于或等于的布尔结果。先预测True、False、True，再保存运行python book_cart.py（macOS用python3，已核验的py也可），保留本人实际三行结果核对。",
          "9没有超过12，所以第一项为真；9没有刚好达到12，所以相等比较为假；两个值不同，所以不等比较为真。若换成自己选择的数据，必须按自己真实值重新解释，不把这组输出当所有情境的答案。",
          "前两行的=分别给名称提供整数，第三行的=保存右侧比较结果；第五行的==只问两值是否相等，最后一行的!=问是否不同。==是一个比较运算符，不是赋值两次。",
          "常错包括把实际值/上限位置颠倒、用赋值代替比较、只打印预写True/False，或改了文件未保存。沿源码核对数量和规则，再真实重跑。接受其他新情境、合理上限、合法名称及等价正确写法；不能只交符号表或复制参考输出。",
        ],
        rubric: [
          "本人新.py含自选容量情境、新整数与合法名称，实际量/上限单位相同，真实写出<=、==、!=三项比较并显示结果，而非只打印答案常量。",
          "运行前有三项预测，实际命令/源码/完整三项结果对应；逐项解释是在判断最多、恰好还是不同，并核对预测差异。",
          "结合本人赋值与相等/不等比较说明=、==、!=的不同作用，变量读取拼写一致，实际操作可复现；Quiz、文字方案或读完标记不能代替代码。",
        ],
      },
      { type: "exercise", id: "test-boundary-values", title: "上限不变，独立运行三种边界", kind: "代码",
        prompt: "另建新.py，自选一种“最多可装若干件”的新情境和正整数上限，不用正文上限6。自己选合法名称，固定上限，在同一个文件写出实际量<上限、实际量<=上限两项判断，再选>或>=加一项验证，并说明它问的是超过还是至少达到。先把实际量设为低于上限，预测三项、保存并真实运行；第二轮只改实际量使它恰好等于上限，再预测、保存、完整运行；第三轮只改实际量使它高于上限，再完整重复。交三轮具体值、对应源码、命令、运行前预测和真实输出，上限及比较式保持不变。说明相等时<与<=为何不同，以及“最多”和“必须少于”分别是否包含边界。不用循环自动测试，不只抄三行真假表。",
        hints: ["先在纸上标出低于、恰好等于、高于三个位置，各选一个实际量。上限是否始终是同一个数？相等位置最能区分哪些规则？", "逐项看符号是否带等号，额外判断问的是超过还是至少达到。把证据分成三次预测、保存和运行，每次只改实际量，仍由你填数据、代码与真实结果。"],
        solution: [
          `例如展板最多放10幅画，先放9幅。新建display_boundary.py，五行分别为：${lines("ownBoundaryLow")}。每条语句单独一行，数量单位都是幅，第三项>=问是否至少达到上限，不代表是否仍允许放入。`,
          "第一轮9低于10，先预测True、True、False，保存后运行python display_boundary.py（macOS用python3），留本人真实输出。第一项严格小于为真，第二项最多为真，第三项至少达到为假。",
          `第二轮只改实际量为10，五行依次为：${lines("ownBoundaryEqual")}。先预测False、True、True，再保存并用同一命令完整运行。相等不满足严格小于，但满足小于或等于，也满足至少达到。`,
          `第三轮只改实际量为11，五行依次为：${lines("ownBoundaryHigh")}。先预测False、False、True，再保存完整运行。已经超过最多10幅；>=仍为True，因为至少达到10也包含更大值，并不只表示刚好装满。`,
          "最多10幅包含10，必须少于10幅排除10；三个实际值不同，上限和三项规则都没改变。若额外选>，三轮那一项应是False、False、True，相等时不包含边界。接受其他新上限、三个合理整数、合法名称与正确的额外判断。",
          "常错是第二轮连上限也改了、三轮仍读旧文件、未完整重跑、只交最终高于一轮或把>=说成刚好相等。逐轮核对保存源码、值与命令，保留真实差异和说明，不用一张参考表冒充三次运行。",
        ],
        rubric: [
          "本人固定同一新上限，三个实际整数确实分别低于、等于、高于，上限/比较式在三轮保持，只改实际量；源码均不使用未教控制流程。",
          "三轮都保留保存源码、实际命令、事先三项预测与真实完整输出，<、<=及额外>或>=与本轮值对应，不把一次运行冒充三轮。",
          "能结合相等一轮解释<排除边界而<=包含边界，说明最多/少于的实际规则，并正确解释额外比较是超过或至少达到。合理替代名和新整数可达标，抄表或网页读完不算操作证据。",
        ],
      },
    ] },
    { id: "next-step", title: "先读规则，再用边界检查真假", navGroup: "finish", navLabel: "回顾与后续", blocks: [
      { type: "summary", points: ["本课的普通整数比较得到True或False，结果回答的是所写出的数量关系。", "=保存值，==判断相等，!=判断不同；严格小于/大于与含等号的比较在相等位置有区别。", "固定规则与上限，低于、等于、高于三轮先预测、保存并完整运行，再核对含不含边界。"] },
      p("保留本人两份.py及短记录，能换一个上限重新验证、解释每个真假结果，才有独立代码证据。网页读完不代表已经会选符号，比较结果本身也没有替程序选择行动。"),
      p("接下来规划2.5「取得用户输入，再转成需要的数值」，目前没有可读正文，2.6也仍在规划。按课程顺序还需完成输入输出与控制流程等中间内容，再进入第5章函数试读；阅读器的下一可读导航不表示直接跳学建议。整门PY101仍在筹备。"),
    ] },
  ], resources: [],
  references: [
    { title: "Python比较表达式", href: "https://docs.python.org/3.14/reference/expressions.html#comparisons", note: "核对比较符号及普通数值结果。" },
    { title: "值比较", href: "https://docs.python.org/3/reference/expressions.html#value-comparisons", note: "本课只使用同单位普通整数，其他比较规则延后。" },
    { title: "赋值语句", href: "https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements", note: "核对取得右侧结果再绑定名称。" },
    { title: "布尔类型", href: "https://docs.python.org/3.14/library/stdtypes.html#boolean-type-bool", note: "核对True、False与bool，衔接2.2。" },
  ],
});
