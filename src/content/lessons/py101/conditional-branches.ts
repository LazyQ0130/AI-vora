import { lessonSchema, type ContentBlock } from "../../models";
import { branchCode, branchBlockNames, type BranchKey } from "../../resources/python-conditional-branches";

const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const output = (filename: string, code: string): ContentBlock => ({ type: "code", language: "text", filename, code });
const sample = (key: BranchKey): ContentBlock => ({ type: "code", language: "python", filename: branchBlockNames[key], code: branchCode[key] });

// 简报/官方事实/预解、保存文件实跑与出版门禁：docs/py101-p17。沿用Reader，无新增图或下载。
export const pythonConditionalBranchesLesson = lessonSchema.parse({
  id: "PY101-C03-L02", courseId: "PY101", chapterId: "PY101-C03", title: "条件不满足时怎么办",
  contentVersion: 1, optionalLesson: false,
  subtitle: "从条件不满足时的另一种提醒，走到少于、等于、超过三档分类，每次只选择对应的一条路。",
  prerequisites: "已完成3.1：会用简单if、冒号和四空格缩进，区分块内外，条件假时跳过后继续执行；能保存并从终端完整运行.py。第二章现行r2已教变量、整数/布尔值与数值比较。沿用Python 3和编辑器，不装库；手机可读，代码操作需要电脑。",
  prerequisiteLinks: [
    { title: "3.1 用if控制提醒", href: "/learn/PY101/PY101-C03-L01#first-if", note: "复习条件与受控语句。" },
    { title: "3.1 块外继续执行", href: "/learn/PY101/PY101-C03-L01#block-boundary", note: "条件假只跳过if块。" },
    { title: "2.4 相等边界", href: "/learn/PY101/PY101-C02-L04#boundary-runs", note: "<与<=在等值位置有区别。" },
    { title: "1.3 保存与重跑", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "每次改值保存后执行完整文件。" },
  ],
  objectives: [
    "在自己创建的.py中用if/else根据简单数量条件选择两种提示之一，解释真假路径和块外继续执行",
    "用if/elif/else实现低于、等于、高于限制的三档分类，先预测再实际运行三组数据，解释为何只执行第一条匹配分支",
    "实际复现两个独立if在重叠条件下的重复分类提示，说明执行关系并修成规则明确的互斥三档选择",
  ],
  assessmentMap: [
    { objective: 1, exerciseIds: ["choose-one-message"] },
    { objective: 2, exerciseIds: ["choose-one-message", "repair-overlapping-choice"] },
    { objective: 3, exerciseIds: ["repair-overlapping-choice"] },
  ],
  learningTime: { reading: [12, 18], practice: [8, 12], coding: [20, 30], basis: "editorial-estimate" },
  sections: [
    { id: "single-if", title: "超过限制时，能否也给一条提醒？", navGroup: "two", navLabel: "两路选择", blocks: [
      p("上一节用一个if检查活动材料：5件不超过6件时显示Within limit，然后显示Check finished。先预测下面的完整程序，再另存previous_if.py运行，回看已有的选择能力。"),
      sample("previous"),
      output("Windows · PowerShell · 文件所在目录", "python previous_if.py"),
      output("macOS · 终端 · 文件所在目录", "python3 previous_if.py"),
      p("沿用已核验的解释器；后面新文件只替换命令里的文件名。现在只把count改成7，先预测再保存重跑。这一轮只有Check finished：if块被跳过，程序没有给超限情况单独的提醒。"),
      p("新需求是：不超过限制时显示Within limit（限制内），超过时显示Over limit（超过限制）。每次只显示对应的一条数量提示，两种情况下都要保留检查结束的提示。"),
    ] },
    { id: "two-ways", title: "else接住条件不满足的那条路", navGroup: "two", navLabel: "两路选择", blocks: [
      p("else是接在if后面的关键字，用来安排条件为假时的动作。if先检查比较；为真执行if块，为假执行else块。两个块属于同一个if/else选择结构，在本例一次正常执行中只会选其中一个，这叫两条互斥路径。"),
      p("else:这一行不另写条件，与if左侧对齐，末尾仍有冒号。两个块内的print各缩进4个空格。最后一条Check finished退回行首，位于整个选择结构之外，执行完所选块后继续到这里。"),
      p("新建two_way_check.py，恢复count为5。先预测哪一条数量提示会出现、结束提示会不会出现，再保存下面完整源码，从文件所在目录运行。"),
      sample("twoWay"),
      output("count为5 · 运行后核对", "Within limit\nCheck finished"),
      p("5 <= 6为True，执行if块并跳过else块。只把count改为7，预测后保存，从头再运行同一文件，核对下面的假路径："),
      output("count为7 · 运行后核对", "Over limit\nCheck finished"),
      p("再只改为6，先预测并实跑。<=包含相等，所以仍是Within limit和Check finished。选择取决于这次条件的真假；else处理假路径，不会捕获任意Python错误，也不会自动重新输入或再运行一遍。"),
    ] },
    { id: "three-ways", title: "要单独说明刚好达到限制，增加elif", navGroup: "three", navLabel: "三档分类", blocks: [
      p("两路能区分“不超过”和“超过”，但5件与6件都会收到同一句话。现在要分得更细：少于限制时说还有余量，等于时说刚好达到，超过时说超限。先把这三个数量关系各说清楚，再安排分支。"),
      p("elif用于在前一项没有满足时继续提出另一个条件。它后面要写比较表达式，行末加冒号。if、elif、else都在同一层，各自内部的语句缩进4个空格；下面把整个结构称为一条选择链。"),
      p("Python按顺序检查条件：第一项真就执行对应块，结束这条链的选择，不再检查后面的elif或执行else；第一项假才继续检查elif。前面都假时才执行else。下面先看count为6的完整写法，下一段再按三个值分别运行。"),
      sample("threeWay"),
      p("这里把第一项改成count < limit，专门处理少于；elif的count == limit专门处理等于。普通整数既不少于也不等于，就属于超过，交给else。在本例中三档覆盖全部情况，每次恰好选一档。"),
    ] },
    { id: "three-runs", title: "固定限制，亲自跑完少、等、超三档", navGroup: "three", navLabel: "三档分类", blocks: [
      p("保存为three_way_check.py。第一轮先把count设为5，口头或记一行预测，再保存并从头运行；第二轮只改为6，第三轮只改为7。每轮都先预测、保存、再执行，上限6和三个分支保持不变。"),
      { type: "table", caption: "完成三轮后，核对唯一分类与块外结束", columns: ["count（件）", "本轮实际检查", "输出顺序"], rows: [
        ["5", "<为True，后面的==不再检查", "Room left → Check finished"],
        ["6", "<为False，再检查==为True", "At limit → Check finished"],
        ["7", "<为False，==也为False，进入else", "Over limit → Check finished"],
      ] },
      p("Room left表示还有余量，At limit表示刚好达到限制。等于6时，第一项严格小于不满足，才轮到相等判断。三轮的结束提示都在整条链之外；选择分类后，普通后续语句仍继续执行。"),
      p("三轮保留一份源码加改值、预测和真实输出的短表即可，同一会话的解释器、目录和命令只记一次。一般预测可口述，核心题需要的关键结果按题干留存。"),
    ] },
    { id: "first-match", title: "一个比较能成立，不代表这次会检查它", navGroup: "order", navLabel: "顺序与独立判断", blocks: [
      p("下面单独观察一次选择过程，副本没有写结束提示。count仍为6，但第一项换成<=，其余分支保持。先预测会显示一条还是两条数量提示，再另存overlap_choice.py保存运行。"),
      sample("overlap"),
      output("等值数据 · 当前实际结果", "Within limit"),
      p("6 <= 6已经为True，因此执行第一块后结束这条链的选择。6 == 6作为单独的比较也成立，但这次程序没有继续执行到elif的比较。要分清“这个比较可能为真”和“本轮实际检查了它”。"),
      p("如果你预测所有成立的elif都要执行，就把elif当成了另一个独立判断。只将第一项的<=换成<，保持count、limit和其他行不变。先预测，再保存同一副本并重跑下面的完整修正版："),
      sample("orderRepair"),
      output("只修第一项后 · 等值结果", "At limit"),
      p("第一项现在只接住少于，等值才能继续到第二项。原来先命中第一项的结果符合Python规则，却不符合把等值单列的要求；分类范围和顺序都要跟任务一致。"),
    ] },
    { id: "independent-checks", title: "两个独立if会各检查一次", navGroup: "order", navLabel: "顺序与独立判断", blocks: [
      p("换一个完整副本independent_checks.py：同样是等值6，第二条写的是if。先预测数量提示有几条，再保存运行。"),
      sample("independent"),
      output("两个独立判断 · 实际核对", "Within limit\nAt limit\nCheck finished"),
      p("这里有两条独立if。第一条检查结束后，Python继续检查第二条；本次<=与==分别得到True，所以两条提醒都出现。这与一条选择链中“第一条真后不再检查后项”不同。"),
      p("若任务是同时记录“不超过限制”和“刚好达到”两个事实，独立if可以合适；若只允许一个数量分类，就需要互斥选择。决定用哪种结构，要看任务是否允许多个结果，不是见到多个if就一律替换为elif。"),
    ] },
    { id: "practice", title: "独立分类，再修复重复提示", navGroup: "practice", navLabel: "独立练习", blocks: [
      p("先独立完成，再按需展开两级提示。源码可保留一份加阶段差异，结果用短表；相同会话信息引用一次，不另写长环境报告。"),
      { type: "exercise", id: "choose-one-message", title: "让一批材料只得到一个明确的数量状态", kind: "代码",
        prompt: "自选与正文不同的容量、名额或库存情境，新建.py，独立选择有意义的名称、新固定限制和提示，不复用count/limit及6件例子。先写if/else两路，用满足、不满足两组新值各先预测再保存实跑，保留关键输出。随后改成if/elif/else的少于、等于、超过三档，块外保留结束提示。固定限制，低/等/高三组各先预测唯一分类，再保存从头运行；每轮应只有一条分类及结束提示。交本人完整源码加阶段差异、两路阶段两组结果、三档阶段三组预测/真实输出，用短句解释等值归属、elif的作用及为何第一条真后不再检查后项。命令可引用会话卡，不把前一阶段输出冒充后一阶段运行。",
        hints: ["先用自然语言写出三种规则，看看相等会不会被前一条规则提前接住。两路与三档分别需要回答什么问题？", "检查if、elif、else是否同层，各块是否缩进；按顺序跟踪每个测试值会先遇到哪条成立条件。自己的名称、限制、比较、提示和完整代码仍由你决定。"],
        solution: [
          "例如座位检查，seats固定14，people先为11。页尾两份seat_check.py分别给两路与三档参考；自己的题目应另选。两路条件people <= seats，满足显示Enough seats，否则Not enough seats，块外Seat check finished。",
          "两路阶段先预测11人时Enough seats、Seat check finished，保存运行python seat_check.py（macOS用python3）；只改people为17，先预测Not enough seats、Seat check finished，再保存实跑。两组分别覆盖真、假，比较与限制不变。",
          "三档阶段第一项用people < seats对应Spare seats，elif用people == seats对应All seats taken，else对应Need more seats。14人应单独显示刚好坐满，第一项若仍用<=，就会提前把这一档选走。",
          "对三档稿重新分别运行11、14、17：先预测Spare seats / All seats taken / Need more seats，再各保存从头执行，每条分类后都接Seat check finished。两路和三档属于不同稿件阶段，不能只换记录标题。",
          "elif在第一项未满足时才继续检查等值，首个真分支执行后就结束本条链的选择。接受其他新情境、中文提示及先检查超过再判断等值的正确顺序，只要三档互斥且含义清楚。",
          "常错是首项<=遮住等值、把else再加条件、几个关键字不对齐，或将结束提示缩入某个分支。按实际源码和三轮输出定位，再保存重跑；参考结果不是本人运行证据。",
        ],
        rubric: [
          "本人新程序有合理新情境/名称/固定限制，if/else两路确实产生不同提示，真/假两轮有预测与真实结果。",
          "改成if/elif/else后，低/等/高三轮均实际保存运行，每轮仅一条分类，等值正确，限制和规则保持。",
          "块外结束提示各轮保留；能结合源码解释elif只在前项假时检查、首个真分支结束选择。源码加差异与短表足够。",
        ],
      },
      p("下一题给一批10套材料、货架上限10套。目标是每批只显示少于、刚好达到、超过三档中的一个，再显示Shelf check finished。把下面起始稿保存为repair_choice.py，先预测等值输出，再真实运行。"),
      sample("fault"),
      { type: "exercise", id: "repair-overlapping-choice", title: "为什么同一批材料收到了两条分类提示？", kind: "代码",
        prompt: "从上面的repair_choice.py开始，先预测并实际复现两条数量提示，保留修前源码与关键输出。指出它有几条独立if，为什么本次两项都能执行。自行修成少于、等于、高于货架上限的互斥三档结构，提示要分别说明这三档，保留块外结束语句。固定上限10，用kits为8、10、13各先预测再保存完整运行；核对每轮只有一条分类。交本人修复源码及必要差异、修前结果与修后三组预测/真实输出，用短句解释为什么只选一档。不能只删print或写死当前答案；只换第二个关键字后也要检查第一条件是否仍遮住等值。",
        hints: ["原稿到底有几条if？在等值数据下，它们的比较分别是真是假，第一条完成后会不会继续检查第二条？", "按少于、等于、高于重新核对范围与顺序，再选择能保证唯一分类的结构。判断相等是否已被前项接住，保留普通收尾；最终修复和三轮运行由你完成。"],
        solution: [
          "10 <= 10与10 == 10分别为True。原稿是两个独立if，实际输出Within shelf limit、At shelf limit、Shelf check finished，数量提示重复。两条描述可以同时是事实，但没有满足本题唯一分类要求。",
          "一种修复是首项kits < shelf_limit显示Below shelf limit，elif kits == shelf_limit显示At shelf limit，else显示Over shelf limit，最后的Shelf check finished仍在块外。完整repair_choice.py参考在页尾，先保留本人修复再核对。",
          "第一轮kits为8，先预测Below shelf limit、Shelf check finished，保存运行python repair_choice.py（macOS用python3）。只改为10，先预测At shelf limit、Shelf check finished，再保存运行；只改13再预测并实跑Over shelf limit、Shelf check finished。",
          "若只把第二个if换成elif而留下第一项<=，10仍先命中第一块，等值分类不会被选中。修复要同时对照互斥结构与三档含义，不是只替换一个单词。少于先命中便不再检查等值；少于不满足才继续；均不满足才是超过。",
          "可以采用先判断超过、再判断等于、else处理少于的顺序，但提示必须对应真实范围，且三种数据都需本人实际运行。不能删掉某条提示以掩盖缺少分类，也不引入逻辑组合、循环或嵌套来代替当前选择链。",
          "常错是保留独立if却声称已互斥、上限随数据改变，或只核对修后等值一轮。保留修前关键结果和修后三轮短表，用自己的执行路径说明差别。",
        ],
        rubric: [
          "实际复现修前重复输出，能指出两条独立if分别检查、等值时均真。",
          "本人修复为含义正确的互斥三档，未只删print或硬编码答案；能解释首项范围与顺序，等值不被错误遮住。",
          "固定上限，低/等/高三轮先预测再实跑，分类各一条、块外结束保持；修前后源码和结果可对应，无超纲结构。",
        ],
      },
    ] },
    { id: "reference-programs", title: "做完再核对：阶段稿与修复参考", navGroup: "reference", navLabel: "参考核对", tier: "verification", blocks: [
      p("下面依次为题一两路、题一三档和题二三档修复。每次复制另存参考，保留本人原作；相同文件名代表不同阶段，不能把两份程序追加在一起。各题解答已经说明改值、预测与每条语句的用途。"),
      sample("ownTwo"), sample("ownThree"), sample("fixed"),
    ] },
    { id: "next-step", title: "按任务选择独立判断或唯一分类", navGroup: "finish", navLabel: "回顾与后续", blocks: [
      { type: "summary", points: ["if/else按同一个条件的真假选择一块；else与if同层，else后不另写条件。", "if/elif/else按顺序检查，首个真分支执行后不再检查后项；分类范围和顺序共同决定等值走哪一档。", "多个独立if会分别判断，可以同时执行；唯一分类要用明确的互斥设计，再用低、等、高真实数据验证。"] },
      p("保留自己的两阶段分类与修复记录。接下来让一条条件同时考虑数量下限和库存上限，或表达几项要求满足任意一项；下一节再学习怎样把比较结果组合起来。"),
    ] },
  ], resources: [],
  references: [
    { title: "Python if语句语义", href: "https://docs.python.org/3.14/reference/compound_stmts.html#if", note: "依次求值、首个真分支及else的条件。" },
    { title: "if与elif教程", href: "https://docs.python.org/3.14/tutorial/controlflow.html#if-statements", note: "核对多个分支的基本写法。" },
    { title: "缩进规则", href: "https://docs.python.org/3.14/reference/lexical_analysis.html#indentation", note: "同层子句与缩进语句组。" },
    { title: "数值比较", href: "https://docs.python.org/3.14/reference/expressions.html#comparisons", note: "本课仅使用普通整数的单比较。" },
  ],
});
