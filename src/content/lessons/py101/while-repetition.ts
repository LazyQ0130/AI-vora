import { lessonSchema, type ContentBlock } from "../../models";
import { whileCode, whileBlockNames, type WhileKey } from "../../resources/python-while-repetition";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const output = (filename: string, code: string): ContentBlock => ({ type: "code", language: "text", filename, code });
const sample = (key: WhileKey): ContentBlock => ({ type: "code", language: "python", filename: whileBlockNames[key], code: whileCode[key] });

// 简报/预解/官方事实/有限实跑与门禁：docs/py101-p19。复用Reader，零新图/下载。
export const pythonWhileRepetitionLesson = lessonSchema.parse({
  id: "PY101-C03-L04", courseId: "PY101", chapterId: "PY101-C03", title: "让程序重复执行直到条件变化",
  contentVersion: 1, optionalLesson: false,
  subtitle: "从只处理一件，到每轮重新检查：跟着数量的变化，说明程序为何继续、又为何停下。",
  prerequisites: "已完成第一、二章现行r2及3.1–3.3/r1：会保存运行.py、赋值与重新赋值、右侧数值表达式、整数加法和比较、True/False、if及冒号/四空格缩进、块外继续执行。沿用Python 3和编辑器，不安装库；手机可读，代码实践需要电脑。",
  prerequisiteLinks: [
    { title: "2.1 同名更新", href: "/learn/PY101/PY101-C02-L01#read-and-update", note: "重新赋值改变当前值。" },
    { title: "2.3 右侧先求值", href: "/learn/PY101/PY101-C02-L03#expression-to-value", note: "计算完成再赋给名称。" },
    { title: "3.1 受控块与块外", href: "/learn/PY101/PY101-C03-L01#block-boundary", note: "条件为假跳过块，后续仍继续。" },
    { title: "3.3 条件与动作", href: "/learn/PY101/PY101-C03-L03#next-step", note: "从一次判断进入状态变化。" },
    { title: "1.3 保存与重跑", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "改值后保存，再执行完整文件。" },
  ],
  objectives: [
    "根据新的起始数量和目标，独立写出包含初值、条件与体内更新的有限while程序，每处理一件显示完成量并正常结束",
    "运行前预测每轮检查值、更新值与输出，解释最后一次假检查和零轮执行，区分最后打印值与退出时变量值",
    "真实复现一处可终止的更新幅度错误，只修必要表达式并用新数据和零轮复验，说明漏更新不能保证停止的风险",
  ],
  assessmentMap: [
    { objective: 1, exerciseIds: ["count-to-target"] },
    { objective: 2, exerciseIds: ["count-to-target", "repair-state-update"] },
    { objective: 3, exerciseIds: ["repair-state-update"] },
  ],
  learningTime: { reading: [14, 20], practice: [10, 15], coding: [22, 34], basis: "editorial-estimate" },
  sections: [
    { id: "once-or-repeat", title: "if只做了一次，离3件还差多少？", navGroup: "repeat", navLabel: "从一次到重复", blocks: [
      p("活动材料已经处理0件，目标是3件。已有if能判断是否还没达到目标，再处理一件。packed表示已经完成的件数，target表示目标件数，单位都是件。先沿下面程序预测输出，再新建one_item.py保存运行。"),
      p("packed = packed + 1先读取旧值0，右侧算0+1得到1，再把1赋给同名packed；随后print才显示当前值。这仍是已学的右侧求值与重新赋值，不是在判断一个数学等式。"),
      sample("once"),
      output("Windows · PowerShell · 文件所在目录", "python one_item.py"),
      output("macOS · 终端 · 文件所在目录", "python3 one_item.py"),
      output("if版本 · 运行后核对", "1\nPacking finished"),
      p("0 < 3为真，进入if块更新一次，然后来到块外结束提示。1仍小于3，但这条if没有回头再检查，最终只处理一件。新需求是：每处理完一件重新检查，还没达到目标就接着做，达到后再结束。"),
    ] },
    { id: "first-while", title: "while在每轮开始重新检查条件", navGroup: "repeat", navLabel: "从一次到重复", blocks: [
      p("while是让代码块重复执行的关键字：先检查条件，为真就执行一轮，完成这一轮后回到条件再次检查；为假就结束这个循环，继续块外代码。它用的packed < target仍是熟悉的整数比较。"),
      p("while行末写冒号。缩进的两条语句组成循环体，也就是每轮条件为真时执行的那组动作；本课每条体内语句都缩进4空格。先更新数量再显示完成量。数量此刻的值是程序的状态，更新使状态发生变化。最后Packing finished退回行首，在循环体外。"),
      p("另存packing_loop.py，先预测会显示几次数量，再保存下面的完整程序。沿用已核验的解释器，后面命令只替换文件名。先在下一段逐轮推演，再实际运行核对。"),
      sample("main"),
      p("Python每轮根据当时的值决定是否进入循环体。初值0、目标3和每轮加1共同形成这次的执行次数，while没有预先记住“一定运行三次”。"),
    ] },
    { id: "follow-states", title: "打印3之后，还要再检查一次", navGroup: "states", navLabel: "逐轮与边界", blocks: [
      p("先手动走一遍：0小于3，更新为1并打印；回到条件时当前已是1，又小于3，更新为2并打印。继续推演下一轮和退出那次检查，再用同一文件实际运行。下表用于核对你的追踪。"),
      { type: "table", caption: "0件起步、目标3件，每轮先更新再输出", columns: ["检查时packed", "packed < 3", "本轮动作", "本轮print"], rows: [
        ["0", "True", "更新到1", "1"], ["1", "True", "更新到2", "2"], ["2", "True", "更新到3", "3"], ["3", "False", "不再进入循环体", "无"],
      ] },
      output("while主例 · 实际运行后核对", "1\n2\n3\nPacking finished"),
      p("这里循环体执行3轮，条件检查4次，最后一次是假。打印3后仍要返回while行，3 < 3为False，才离开循环体；随后正常执行块外结束提示。False结束的是这个循环，不是让整个Python程序立即退出。"),
      p("如果预测while也只显示1，就与one_item.py作最小对照：初值、比较、两条体内语句和结束语都相同，只把if换为while。问自己：完成一轮后，哪一种会重新检查？保留这次实际差异即可，不再写长报告。"),
    ] },
    { id: "zero-and-new", title: "第一次就不满足，可以一轮也不做", navGroup: "states", navLabel: "逐轮与边界", blocks: [
      p("保持packing_loop.py的目标3、比较和循环体，只把第一行改为packed = 3。先预测，再保存从头运行。第一次3 < 3已经为False，循环体一次都不执行，这叫零轮执行；块外语句仍然会运行。"),
      output("初值3、目标3 · 零轮结果", "Packing finished"),
      p("也可只改成packed = 4再实际观察：4 < 3同样是假，仍只显示结束。循环既可能多轮，也可能零轮，要先看第一次检查。"),
      p("再做新数据：把初值设为2、target设为5，其他行保持。预测时从2开始，先写三轮的更新值和下一次检查；保存后完整运行，核对下面结果。"),
      output("初值2、目标5 · 运行后核对", "3\n4\n5\nPacking finished"),
      p("进入循环时依次检查2、3、4，更新后依次显示3、4、5；最后检查5 < 5为假，退出时packed为5。新起点与新目标需要重新推演，不能把0、1、2、3当成固定答案。单位、比较方向和每次变化保持一致。"),
    ] },
    { id: "order-matters", title: "先显示还是先更新，报告的是不同时刻", navGroup: "order", navLabel: "顺序与停止", blocks: [
      p("另建before_update.py，恢复初值0和目标3。下面只交换循环体内两条语句的顺序，先显示再更新。先预测每条print执行时packed的值，再保存运行。"),
      sample("beforePrint"),
      output("先输出、后更新 · 实际核对", "0\n1\n2\nPacking finished"),
      p("第一轮print读到旧值0，之后才更新为1；下一轮显示1，再更新2；第三轮显示2，再更新3。退出时packed仍是3，但最后一次体内打印的是2。原主例先更新再输出，最后显示3，退出值也是3。"),
      p("两份程序语法有效，也都会停止。原任务要求“每处理完一件显示已经完成多少件”，所以选择先更新的版本。若你认为交换顺序不影响结果，就在每次print旁写它此刻读到的值，用两份真实输出核对。"),
    ] },
    { id: "stop-reason", title: "是什么让下一次条件最终变成假？", navGroup: "order", navLabel: "顺序与停止", blocks: [
      p("主例能停止，靠的是packed从0开始、目标固定为3、每轮加1；完成量向目标推进，最终3不再小于3。只说“遇到False停止”还不够，还要说明代码怎样让下一次比较变成False。"),
      p("这里只作纸面诊断，不启动缺失更新的程序：假如从主例删除packed = packed + 1，保留原来的print，第一次检查0 < 3真，显示0后当前仍是0；第二次检查仍真，再显示0。条件依赖的值没有变化，现有代码无法证明会自行结束。"),
      { type: "table", caption: "漏更新只作纸面追踪，不运行", columns: ["纸面步骤", "当前值", "下一次条件"], rows: [["第1轮只print后", "仍为0", "0 < 3仍为True"], ["第2轮只print后", "仍为0", "0 < 3仍为True"]] },
      p("若把更新移到循环体外，正常退出之前也执行不到它；若仍以小于3为条件却每次减1，状态会离退出条件更远。这些风险用源码和纸面值检查即可。实际练习采用能够正常结束的错误更新，不需要启动无限输出再手动终止。"),
      p("主例最后恰好显示目标，是当前起点、严格比较、每次+1和输出位置共同决定的。下一题会看到每次+2虽能停止，最后却可能超过目标；while本身没有保证最后输出总等于目标。"),
    ] },
    { id: "practice", title: "独立计数，再修复一次更新幅度", navGroup: "practice", navLabel: "独立练习", blocks: [
      p("先独立完成，再按需展开提示。本人源码、关键预测和真实结果是主要交付；源码可用一份加改值差异，状态追踪用短表，相同环境与命令只记一次。"),
      { type: "exercise", id: "count-to-target", title: "从自己的起点，把数量推进到目标", kind: "代码",
        prompt: "自选不同于正文的活动卡片、清单或标签情境，新建.py，自定有意义的合法名称、非负整数起点和目标，不照抄packed/target及0/3整组。写while简单比较，在体内每轮加1，每完成一件显示新完成量，块外显示结束提示。正常多轮选3–6轮，先预测每次检查值/更新值/输出，再保存真实运行；将初值改到恰好等于目标，先预测再实跑零轮；再用另一组新起点/目标实际验证。交本人完整源码加差异、三组必要预测与真实结果、简短状态追踪和一次命令，说明最后一次假检查为何出现、最后打印值与退出值的关系。",
        hints: ["先写清起点、目标与单位，哪条语句真正改变了当前数量？每完成一次应该增加多少？", "沿while检查→体内更新→print→回到检查逐步走，核对缩进及输出前后的值。自己决定名称、数字、完整程序和预测，不把状态更新放到正常退出后。"],
        solution: [
          "例如物料标签，labels_done从2开始，label_goal为6，每轮处理1张。页尾label_counter.py给完整参考；自己的情境/名称/数据应另选。条件labels_done < label_goal，体内先加1再print，结束提示在块外。",
          "2→6先预测输出3、4、5、6、Label check finished，保存运行python label_counter.py（macOS用python3）。检查值依次2、3、4、5为真，最后6 < 6假，共4轮、5次检查。最后打印6，退出值也为6，原因是先更新再显示。",
          "第二组只把labels_done设为6，预测只有Label check finished，再保存完整运行。第一次条件就是假，体内零轮，不会先加1，也不会显示数量。",
          "第三组新起点4、目标7，预测5、6、7、Label check finished，再保存从头执行。检查4/5/6为真、7为假，3轮4查。用一份源码加三组差异/结果，不能把第一轮输出重复贴成新数据。",
          "每轮+1让非负整数当前量向固定目标推进，有限次后不再小于目标，循环才停止。接受其他合理新情境、中文结束语和3–6轮的安全数据；常错是更新放块外、先print却声称显示完成后数量，或硬编码一串输出。沿自己的条件与更新逐步追踪，再保存实跑。",
        ],
        rubric: [
          "本人新.py、名称/情境/初值/目标合理，while有简单条件，更新位于体内、每轮+1，输出符合完成后报数且块外收尾。",
          "多轮、等值零轮、另一组新起点/目标均预测后真实保存运行，短追踪能对应检查/更新/print，不用参考表替代本人结果。",
          "说明最终假检查、状态为何靠近退出，以及最后打印值与退出值的关系；无for/range/break/函数或硬编码替代。",
        ],
      },
      p("下一题规定每处理完一件就增加1，再显示当前完成量。把下面repair_increment.py保存运行前，先预测每次更新和输出。程序能够正常结束，只有更新幅度不符合任务。"),
      sample("fault"),
      { type: "exercise", id: "repair-state-update", title: "为什么每次数到的不是下一件？", kind: "代码",
        prompt: "从上面的repair_increment.py开始，先预测再真实运行，保留原稿与输出。指出唯一错误更新表达式，说明一次循环应增加多少、现在增加多少，以及原稿为何能停止却不符合逐件处理。保持初值0、目标3、条件、缩进和提示，只修更新幅度，先预测再保存实跑；随后换成起点2/目标5再验证，并以3/3核对零轮。交本人修前/修后源码加一处差异、三组修后预测与实际结果及原稿结果，命令一次引用。解释最后打印值、最终变量与退出条件，不能硬编码print1/2/3、删循环或改比较凑答案。",
        hints: ["比较处理一件后应增加的数量，与当前更新表达式实际增加的数量。第一次和第二次分别会得到什么？", "沿当前值→更新值→print→下一次比较追踪，保留其他语句，只修任务不符的变化幅度。再选新起点与目标、零轮核对，最终修复程序由你完成。"],
        solution: [
          "原稿每轮+2：0 < 3真，更新2并显示2；2 < 3仍真，更新4并显示4；4 < 3假，最后Packing finished。实际应为2、4、Packing finished。程序能正常结束，但跳过逐件应显示的1和3，最终还超过目标。",
          "只把packed + 2改为packed + 1，其他初始值、目标、比较、缩进和文字都不改。原0→3修后先预测1、2、3、Packing finished，再保存运行python repair_increment.py（macOS用python3）。",
          "另轮再改起点2、目标5，先预测3、4、5、Packing finished，保存从头运行；页尾第二份参考展示的正是这个修后新数据阶段。先完成单处修复，再另作新数据验证；原稿和修复的唯一逻辑差异仍是+2→+1。",
          "零轮设为3/3，第一次比较假，只出现Packing finished，修复没有破坏边界。修后0→3和2→5都在最终到达目标后，再做一次假检查而停止；等值初始状态则不进体。",
          "错误+2稿最后打印4、退出值4，目标却是3；正确主例最后打印3、退出3；先print稿最后打印2、退出3。用实际顺序与更新说明关系，不能泛称所有while最后都显示目标。常错是改比较、改目标迎合2/4或只打印正确常量；保留一处修复差异并用新数据复验。",
        ],
        rubric: [
          "修前真实复现2/4/结束，定位为每轮幅度错误，说明可终止但不符合一次一件，未误称语法错误。",
          "仅将更新幅度修正确，原0/3、其余规则保持；原数据、新2/5、等值3/3都预测后实跑并收尾。",
          "本人源码/差异/结果可对应，解释最后假检查与退出值；无硬编码、删除循环或引入未来语法。",
        ],
      },
    ] },
    { id: "reference-programs", title: "做完再核对：有限循环的两题参考", navGroup: "reference", navLabel: "参考核对", tier: "verification", blocks: [
      p("先保留自己的程序再展开。第一份是题一标签情境；第二份是题二完成单处修复后，另轮起点2、目标5的数据稿。分别另存，别把两份追加到同一文件；原0/3修复结果和其他改值见各题解答。"),
      sample("own"), sample("fixed"),
    ] },
    { id: "next-step", title: "用初值、条件和更新说明每一轮", navGroup: "finish", navLabel: "回顾与后续", blocks: [
      { type: "summary", points: ["while每轮开始检查条件，真时执行循环体，完成后返回检查；首次假可以零轮，正常退出后继续块外语句。", "初值、固定目标与体内更新共同决定过程；预测时包含最后一次假检查，再用真实新数据验证。", "print读的是执行到这一行时的值，更新先后和幅度都会改变输出；漏更新风险用纸面检查，核心修错使用能结束的程序。"] },
      p("保留自己的多轮、零轮和修复记录。如果任务一开始就确定要检查几批，能否直接按这些批次逐次处理，不必手动安排同样的计数更新？下一节从已知重复次数继续。"),
    ] },
  ], resources: [],
  references: [
    { title: "Python while语句", href: "https://docs.python.org/3.14/reference/compound_stmts.html#while", note: "核对反复测试和首次条件为假。" },
    { title: "缩进规则", href: "https://docs.python.org/3.14/reference/lexical_analysis.html#indentation", note: "核对循环体的语句归属。" },
    { title: "赋值语句", href: "https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements", note: "先求右侧结果，再更新当前值。" },
    { title: "比较语义", href: "https://docs.python.org/3.14/reference/expressions.html#comparisons", note: "严格小于与等值退出。" },
  ],
});
