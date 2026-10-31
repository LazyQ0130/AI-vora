import { lessonSchema, type ContentBlock } from "../../models";
import { conditionalCode, conditionalBlockNames, type ConditionalKey } from "../../resources/python-conditional-execution";

const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const output = (filename: string, code: string): ContentBlock => ({ type: "code", language: "text", filename, code });
const sample = (key: ConditionalKey): ContentBlock => ({ type: "code", language: "python", filename: conditionalBlockNames[key], code: conditionalCode[key] });

// 开写前蓝图/简报/官方事实/独立预解及真实进程：docs/py101-p16。无新图或下载。
export const pythonConditionalExecutionLesson = lessonSchema.parse({
  id: "PY101-C03-L01", courseId: "PY101", chapterId: "PY101-C03", contentVersion: 1,
  title: "让程序根据条件决定是否执行", optionalLesson: false,
  subtitle: "比较已经能得到True或False。现在让一条提醒只在满足条件时出现，再用三个数量核对执行路径。",
  prerequisites: "已完成第一、二章：会赋值、print、整数比较和True/False，能保存并从终端完整运行.py。沿用现有Python 3与编辑器，无需安装库；手机可阅读，编写和运行需要电脑。本节先在源码改值，不增加输入操作。",
  prerequisiteLinks: [
    { title: "1.3 保存与重跑", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "确认已保存文件与实际执行目标。" },
    { title: "2.1 名称与值", href: "/learn/PY101/PY101-C02-L01#name-and-value", note: "复习赋值和读取。" },
    { title: "2.2 真假状态", href: "/learn/PY101/PY101-C02-L02#ready-state", note: "回顾True、False是布尔值。" },
    { title: "2.4 比较与边界", href: "/learn/PY101/PY101-C02-L04#boundary-runs", note: "<=包含等于限制的情况。" },
  ],
  objectives: [
    "在自己创建的.py中用已学比较和简单if控制一条提醒，解释条件为真时执行哪条语句",
    "正确使用冒号和缩进，区分if代码块内外的语句，预测假路径并修复一处逻辑性缩进错误",
    "保持规则与限制值不变，使用低于、等于、高于限制的三个新值先预测再实际运行，核对路径并解释等值边界",
  ],
  assessmentMap: [
    { objective: 1, exerciseIds: ["choose-when-to-print"] },
    { objective: 2, exerciseIds: ["repair-if-block"] },
    { objective: 3, exerciseIds: ["choose-when-to-print"] },
  ],
  learningTime: { reading: [12, 18], practice: [8, 12], coding: [20, 30], basis: "editorial-estimate" },
  sections: [
    { id: "boolean-first", title: "得到了True，程序就会选择动作吗？", navGroup: "condition", navLabel: "从判断到动作", blocks: [
      p("一批活动材料有5件，限制是最多6件。第二章已经会用count <= limit判断是否满足。先预测下面两行输出，再新建before_if.py，保存并从头运行。"),
      sample("before"),
      output("Windows · PowerShell · 文件所在目录", "python before_if.py"),
      output("macOS · 终端 · 文件所在目录", "python3 before_if.py"),
      output("运行后核对 · 两行输出", "True\nCheck finished"),
      p("第一行True来自5 <= 6的比较。第二条print仍然照常显示Check finished（检查结束）。把count改为7再保存重跑：比较变为False，结束提示仍会出现，因为两条print都按顺序执行。"),
      p("现在增加一个需求：只有数量不超过限制，才显示Within limit（数量在限制内）。无论这条提醒出现与否，检查结束的提示都要保留。需要让比较结果控制其中一条语句。"),
    ] },
    { id: "first-if", title: "用if选择是否执行一条提醒", navGroup: "condition", navLabel: "从判断到动作", blocks: [
      p("if是Python控制条件执行的关键字。它后面放条件，这里直接使用已学的count <= limit：条件为True，就执行受它控制的语句；为False，就跳过这一段。"),
      p("比较仍负责得到真假，if据此选择动作，不会替你计算或修改count。先回到count为5，预测新提醒和结束提示各会不会出现，再另存quantity_check.py："),
      sample("main"),
      p("if这一行末尾的英文冒号:表示接下来有一段受条件控制的代码。下一行print前面的空白叫缩进；本课统一用4个空格，让它比if向右一级。缩进决定归属，不能当作只为整齐而加的空白。"),
      p("输入时可让编辑器自动缩进，检查它实际使用4个空格；也可按4次空格键。同一块保持一致，避免混用Tab和空格。最后一条print退回行首，与if对齐，表示已经离开这段受控代码。"),
      p("保存后仍在文件所在目录运行，这次将命令中的文件名换成quantity_check.py。沿用已有解释器；若第一章已核验py或项目环境解释器，继续使用同一入口。"),
      output("count为5 · 运行后核对", "Within limit\nCheck finished"),
    ] },
    { id: "block-boundary", title: "跳过代码块后，程序接着往下走", navGroup: "path", navLabel: "路径与边界", blocks: [
      p("代码块是一组一起受控制的语句。主例的if块目前只有缩进的那条print。Python先执行两次赋值，再计算条件；5不超过6，所以走进块，显示Within limit，随后继续执行块外的结束提示。"),
      p("假如只把count改为7，7 <= 6得到False，执行路径就会绕过缩进的print，直接来到没有缩进的print。代码仍从上到下推进，只是其中一段没有执行。"),
      p("先预测这轮会有几行，再保存quantity_check.py并从头运行。实际应只剩下面一行："),
      output("count为7 · 假路径", "Check finished"),
      p("如果你预测完全没有输出，可能把“跳过if块”理解成“整个程序停止”。保持count为7，指认最后一条print没有缩进，再完整重跑，观察它仍执行。这里程序正常执行到块外，不是遇到了错误。"),
    ] },
    { id: "change-and-boundary", title: "刚好达到限制，还会显示提醒吗？", navGroup: "path", navLabel: "路径与边界", blocks: [
      p("接着只把count改成6，limit和比较式保持不变。运行前预测：6 <= 6是真是假？哪些print会执行？保存后用同一命令从头运行，再与前两轮一起核对。"),
      { type: "table", caption: "同一规则，只改变实际数量", columns: ["count（件）", "count <= limit（limit为6）", "实际输出顺序"], rows: [
        ["5", "True", "Within limit → Check finished"],
        ["6", "True", "Within limit → Check finished"],
        ["7", "False", "Check finished"],
      ] },
      p("恰好6件仍满足“最多6件”，所以<=为True，提醒会出现。若等值轮与你预测不同，先回看2.4的<=是否包含相等；这次新增的if只使用这个结果，没有改变比较规则。"),
      p("三次运行用同一份源码加改值记录即可。记下实际count、事前预测与真实输出；相同解释器、工作目录和命令可引用已有会话卡，不必每轮重抄环境信息。"),
    ] },
    { id: "two-lines", title: "同样缩进的两条语句，属于同一个块", navGroup: "block", navLabel: "缩进的归属", blocks: [
      p("如果数量合适时还要提醒准备标签，可以让两条print都向右缩进4个空格。另建two_messages.py，先预测count为5的输出，再保存运行："),
      sample("twoLines"),
      output("count为5 · 三行输出", "Within limit\nPrepare labels\nCheck finished"),
      p("两条缩进语句都属于这个if块，条件为真时按块内顺序执行。只把count改为7，先预测再保存重跑；这次两条都跳过，只显示Check finished。空行方便阅读，块是否结束要看后续语句退回哪一级缩进。"),
      p("保持条件为假，再另存moved_message.py，只把Prepare labels这一条退回行首，形成下面的完整对照。先预测：这次准备标签的提醒还受if控制吗？"),
      sample("movedLine"),
      output("退回行首后 · 运行核对", "Prepare labels\nCheck finished"),
      p("比较仍是假，Within limit仍跳过；Prepare labels已经在块外，所以照常执行。若你认为冒号下面所有代码都属于if，用这两次只差一条缩进的运行核对：归属来自缩进位置。"),
    ] },
    { id: "practice", title: "写自己的条件提醒，再修复一处归属", navGroup: "practice", navLabel: "独立练习", blocks: [
      p("先独立完成，再按需展开提示。本人源码、关键预测与真实运行结果是主要交付；简短表格或现场解释足够，相同会话信息只记一次。"),
      { type: "exercise", id: "choose-when-to-print", title: "让一条提醒只在满足条件时出现", kind: "代码",
        prompt: "自己选一个新的数量情境，例如活动人数不超容量、材料用量不超库存，或测量至少达到标准。新建.py，独立决定有意义的变量名、新限制值、实际量、比较规则与提醒文字，不照抄正文名称/数字。写简单if控制指定提醒，在块外留一条正常结束提示。固定限制与规则，选低于、等于、高于的三个新值，各先预测再保存从头运行。交本人源码、三行改值/预测/真实输出表及短说明：条件在问什么、哪些语句受if控制、等值为何走这条路径。命令可引用会话卡。三组必须含真、假两种路径；仅复制参考输出不能替代运行。",
        hints: ["先确定哪一条提醒应该只在规则满足时出现，哪一条是检查结束的普通提示。你选择的规则包括相等吗？", "检查条件后的冒号、受控提醒的缩进和结束提示的位置。保持判断规则与限制不变，只换实际量；数据、比较符号、代码和三轮预测仍由你决定。"],
        solution: [
          "例如资料架最多容纳12册，新建shelf_check.py。页尾折叠参考给出一种写法：books先为9，shelf_capacity为12，条件books <= shelf_capacity只控制Books fit；Shelf check finished放在块外。这里换了情境、名称和数据，你自己的方案应另选。",
          "9册低于12，先预测Books fit、Shelf check finished两行；保存后运行python shelf_check.py（macOS用python3）。第二轮只改books为12，先预测仍两行，再保存完整运行，因为<=包含相等。第三轮只改为15，先预测只有Shelf check finished，再运行。",
          "三轮上限和规则相同，只有实际册数变化。真路径进入缩进块，假路径绕过它；块外提示在这几次正常执行中都会出现。用一份源码加9→12→15的短记录对应三组真实输出。",
          "若选最低标准>=，低值应是假、等值和高值为真；若选严格<或>，等值应是假。接受与情境一致的已学单比较，说明等值路径并真实产生真假两种结果即可。",
          "常错是三轮连限制也改了、把结束提示一并缩进、直接print写死的答案，或未保存就运行。沿自己的规则和缩进核对，用真实新数据重跑；答案表不能冒充本人证据。",
        ],
        rubric: [
          "本人新.py有自选情境、名称、数据与合理单比较，if确实控制指定提醒，冒号和缩进正确。",
          "固定规则/限制，低、等、高各有事前预测与真实结果，确含真假两种路径；源码一份加差异即可。",
          "等值是否满足解释正确，块外结束提示在三轮均执行；能结合本人代码指认条件和块归属。",
        ],
      },
      p("下一题规定：只有packed不超过capacity，才显示Checking batch和Pack allowed两条提醒；结束提示每次保留。另建repair_if.py，保存下面的起始程序。它能运行，先预测packed为8时会显示什么，再实际执行，与这条规定比较。"),
      sample("broken"),
      { type: "exercise", id: "repair-if-block", title: "为什么提示出现的时机不对？", kind: "实验",
        prompt: "使用上面的repair_if.py起始源码，先预测再真实运行，保留修前关键输出。程序有一处语句归属与规定不一致：指出哪一行本应受条件控制、现在实际在哪里。保持比较、名称与文字不变，只修这一行缩进；先预测再保存完整运行packed为8的假路径，再只改packed为4，保存重跑真路径。交源码加缩进/改值差异、修前和修后两轮预测/实际输出，用一句话解释为什么修的不是比较本身。相同命令只记一次。",
        hints: ["规定中哪两条提醒应当一起受到条件控制？把它们与普通结束提示分开看。", "比较两条提醒和if各自的行首位置。哪条已经在块内，哪条退回了行首？自行调整归属，保留规则，然后分别用假、真数据保存重跑。"],
        solution: [
          "8 <= 6为False，Checking batch已经缩进，因而跳过；Pack allowed在行首，仍会显示，然后显示Check finished。这是可运行但提醒时机不符的逻辑错误。先保留本人真实这两行，不能仅写“缩进有错”。",
          "只把print(\"Pack allowed\")前面补4个空格，与Checking batch对齐，使两条一起属于if块。页尾参考展示完整修复稿；if条件及最后一条不改。",
          "保持packed为8，先预测只有Check finished，保存并完整运行。再只改packed为4，4 <= 6为True，预测Checking batch、Pack allowed、Check finished三行，保存从头运行。",
          "比较式原本正确表达不超过容量，错误在提醒脱离了受控块；缩进修复的是执行归属。若把<=改为其他符号迎合某次输出，会改变数量规则，并未修复这条print总执行的问题。",
          "常错是把结束提示也移入、只删掉提醒、修改比较或只检查一种路径。核对修复只改变一条提醒的缩进，再分别实跑真、假；保留修前输出与修后差异即可，不重复写环境长报告。",
        ],
        rubric: [
          "修前实际运行并指出脱离if的Pack allowed，能解释False时为何仍显示。",
          "只修目标行缩进，比较/名称/文字及块外结束保持，两个受控print属于同块。",
          "修后假、真两轮均先预测再真实运行，输出符合规定；说明比较正确、错误在块归属。",
        ],
      },
    ] },
    { id: "reference-programs", title: "完成后核对：两题的完整参考", navGroup: "reference", navLabel: "参考核对", tier: "verification", blocks: [
      p("先保留自己的成果再展开。题一仅给另一个情境的参考起始值，三轮改值与原因见该题解答；题二给出只修目标行缩进的完整文件。参考代码可复制检查，核心成果仍是你独立写、预测并实际运行的程序。"),
      sample("own"), sample("repaired"),
    ] },
    { id: "next-step", title: "从显示判断，到按判断选择动作", navGroup: "finish", navLabel: "回顾与后续", blocks: [
      { type: "summary", points: ["比较得到真假，if根据条件决定是否执行缩进的代码块；条件后写冒号。", "同一缩进层级的受控语句一起执行或跳过，退回块外后继续正常执行。", "固定规则，用低、等、高三个新值先预测再保存重跑，解释等值边界与实际输出。"] },
      p("保留自己的提醒程序和缩进修复记录。接下来要解决另一个问题：条件不满足时，如果需要显示另一种提示，该怎样写？下一节从这里学习else与多路选择，循环随后再学。"),
    ] },
  ],
  resources: [],
  references: [
    { title: "Python if教程", href: "https://docs.python.org/3.14/tutorial/controlflow.html#if-statements", note: "本节只取最小if条件执行。" },
    { title: "if与语句块", href: "https://docs.python.org/3.14/reference/compound_stmts.html#if", note: "条件、冒号和受控制的语句组。" },
    { title: "缩进规则", href: "https://docs.python.org/3.14/reference/lexical_analysis.html#indentation", note: "缩进具有语法意义，同一块保持一致。" },
    { title: "条件的真假", href: "https://docs.python.org/3.14/library/stdtypes.html#truth-value-testing", note: "本课条件只使用已学比较产生的布尔结果。" },
  ],
});
