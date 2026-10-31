import { lessonSchema, type ContentBlock } from "../../models";
import { booleanCode, booleanBlockNames, type BooleanKey } from "../../resources/python-boolean-combinations";

const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const output = (filename: string, code: string): ContentBlock => ({ type: "code", language: "text", filename, code });
const sample = (key: BooleanKey): ContentBlock => ({ type: "code", language: "python", filename: booleanBlockNames[key], code: booleanCode[key] });

// 简报、官方事实、预解、短路作者验证和生产门禁：docs/py101-p18。复用Reader，零新图/下载。
export const pythonBooleanCombinationsLesson = lessonSchema.parse({
  id: "PY101-C03-L03", courseId: "PY101", chapterId: "PY101-C03", title: "多个条件怎样共同决定结果",
  contentVersion: 1, optionalLesson: false,
  subtitle: "数量既要够用，又不能超过库存。先分清两个要求，再选出能验证连接规则的数据。",
  prerequisites: "已完成前两章现行r2与3.1、3.2：会保存整数和比较得到的bool，使用True/False及>=、<=、<、>，能写简单if与选择链，区分块内外；会保存并从终端完整运行.py。沿用Python 3与编辑器，不装库；手机可读，代码操作需要电脑。",
  prerequisiteLinks: [
    { title: "2.4 保存比较结果", href: "/learn/PY101/PY101-C02-L04#keep-result", note: "比较先求值，再让名称保存bool。" },
    { title: "2.4 验证相等边界", href: "/learn/PY101/PY101-C02-L04#boundary-runs", note: "含等号与严格比较的区别。" },
    { title: "3.1 条件与块外", href: "/learn/PY101/PY101-C03-L01#block-boundary", note: "if使用真假控制缩进块。" },
    { title: "3.2 判断执行到哪里", href: "/learn/PY101/PY101-C03-L02#first-match", note: "比较能成立与本次实际检查有区别。" },
    { title: "1.3 保存与重跑", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "每次改值后保存，再运行完整文件。" },
  ],
  objectives: [
    "根据新的数量规则，用简单比较与and/or/not分别表达同时满足、任一项满足和对结果取反，并解释各判断的实际含义",
    "固定上下界，选出区分两个子条件贡献的五组边界数据，先预测再实际运行，说明哪项导致总判断变化",
    "为错误连接词提出反例，真实复现误放行，修复后用合格值、两端失败值与相等边界验证规则",
  ],
  assessmentMap: [
    { objective: 1, exerciseIds: ["combine-quantity-rules"] },
    { objective: 2, exerciseIds: ["combine-quantity-rules", "diagnose-connector"] },
    { objective: 3, exerciseIds: ["diagnose-connector"] },
  ],
  learningTime: { reading: [14, 20], practice: [10, 15], coding: [20, 30], basis: "editorial-estimate" },
  sections: [
    { id: "separate-checks", title: "5件材料，要分别通过哪两项检查？", navGroup: "combine", navLabel: "从两项到同时", blocks: [
      p("前两节已经能按条件决定是否显示提醒、选择哪条提醒。现在活动材料还有两个要求：至少准备3件，现有库存最多6件。5件够不够最低需求？有没有超过库存？先把两个问题分开。"),
      p("count保存本次件数，minimum保存最低件数，stock保存库存件数，单位都是件。enough保存count >= minimum的结果，问数量是否够用；within_stock保存count <= stock的结果，问是否没有超过库存。两个名称各保存一个布尔值。"),
      p("新建quantity_parts.py，先预测下面两条print各显示什么，再保存运行。"),
      sample("named"),
      output("Windows · PowerShell · 文件所在目录", "python quantity_parts.py"),
      output("macOS · 终端 · 文件所在目录", "python3 quantity_parts.py"),
      output("count为5 · 运行后核对", "True\nTrue"),
      p("沿用已核验的解释器，后面运行新文件只换文件名。现在只改count为2：先预测两个结果，再保存从头运行；它们应为False、True，说明没达到最低量，但没有超库存。再只改为7重跑，结果为True、False，失败的是另一条要求。minimum和stock始终不变。"),
      p("两个子判断可以得到不同结果。新需求是两项同时满足才显示Quantity ready（数量已就绪）；只满足其中一项，还不能发出准备完成的提示。"),
    ] },
    { id: "both-required", title: "and让两项都满足，才算准备好", navGroup: "combine", navLabel: "从两项到同时", blocks: [
      p("and把两项连起来：对这里的布尔结果，只有两项都为True，组合才为True；有一项为False，组合就为False。它连接的是具体表达式或值，要先明确左右各在问什么。"),
      p("先使用刚才的两个布尔名称，恢复count为5，把组合保存为quantity_ready。新建combined_result.py，先预测最后一行，再保存运行完整程序。"),
      sample("andResult"),
      output("count为5 · 组合结果", "True"),
      p("5件既达到3件，也不超过6件，所以quantity_ready为True。只改为2，再改为7，各先预测、保存和重跑，结果都为False；用上一段两个子结果说明各自为什么失败。"),
      p("quantity_ready已经是一个bool，if可以直接读取它。另存saved_condition.py，先预测受控提醒与块外结束提示，再保存运行下面的完整程序；比较无需另写一份才能交给if。"),
      sample("andIf"),
      output("保存的bool用于if · count为5", "Quantity ready\nCheck finished"),
      p("也可以把两个比较直接放进if条件。下面是后续五轮共用的完整主例，另存quantity_range.py。两个括号分别围住一项比较，让左右规则更清楚；单个比较本身并不要求额外括号才能运行。and组合比较结果，冒号和4空格仍沿用前两节，结束提示在块外。"),
      sample("main"),
    ] },
    { id: "five-values", title: "两端都要测，相等也要测", navGroup: "boundary", navLabel: "五组边界", blocks: [
      p("固定minimum为3、stock为6，在quantity_range.py依次把count设为2、3、5、6、7。每轮先口头或记一行预测：左右两个比较各真假，Quantity ready会不会出现；然后保存、从头运行。三项规则不改，不用循环代替这五次操作。"),
      p("完成五轮后，再核对这张表。只有合格值显示数量提示，所有这些正常运行最后都显示Check finished。"),
      { type: "table", caption: "固定3–6件，五轮运行后的边界核对", columns: ["count（件）", "count >= minimum", "count <= stock", "and / 数量提示"], rows: [
        ["2", "False", "True", "False / 不显示"], ["3", "True", "True", "True / Quantity ready"],
        ["5", "True", "True", "True / Quantity ready"], ["6", "True", "True", "True / Quantity ready"], ["7", "True", "False", "False / 不显示"],
      ] },
      p("至少3件、最多6件都包含相等，所以3与6通过。2和7都不通过，原因却不同：2没有达到最低量，7超过了库存。只测5件会漏掉这两类错误；保留上下界、比较不变，才能看出哪项要求起作用。"),
    ] },
    { id: "review-or", title: "不足或超限，任意一种都需要复核", navGroup: "other", navLabel: "另外两种问题", blocks: [
      p("现在换一个要回答的问题：什么时候需要进一步检查这批数量？少于最低量需要检查，超过库存也需要检查，任意一种异常出现就够了。or表示至少一项为True时组合为True，两项都为True时也为True；只有两项都为False时才为False。"),
      p("这次左边too_few问count < minimum，右边too_many问count > stock；两个子条件的含义也随问题改变。needs_review保存它们的or结果。新建needs_review.py，先预测count为2时的结果，再保存运行。"),
      sample("review"),
      output("count为2 · 是否需复核", "True"),
      p("2件不足，too_few为True，所以需复核。只改为5，先预测再保存实跑，应为False；只改为7再跑，应为True，因为超过库存。对照3和6，恰好达到两端都没有触发异常。当前最低量不大于库存，这两种异常不会同时出现；or本身仍允许两项都真。"),
      p("要分清“够最低量并且不超库存”与“不足或者超库存”。把原先两项合格条件直接用or连接，会改变规则；连接词和左右的实际问题需要一起设计。"),
    ] },
    { id: "reverse-result", title: "not把已有判断的真假反过来", navGroup: "other", navLabel: "另外两种问题", blocks: [
      p("如果已经算出“数量合格”，怎样表达“数量不合格”？not对已有判断取反：原来为True时得到False，原来为False时得到True。先从一个现成bool看起，新建reverse_bool.py，预测后保存运行。"),
      sample("notValue"),
      output("原判断为True · 取反后", "False"),
      p("只把赋值的True改为False，再预测、保存重跑，输出应为True。接着回到实际数量：另存reverse_ready.py，用原来的两个比较算quantity_ready，再依次显示它和not quantity_ready。先预测count为2的两行，再保存运行。"),
      sample("notRange"),
      output("count为2 · 合格 / 不合格", "False\nTrue"),
      p("只改为5重跑，两行应是True、False；改为7则又是False、True。若把not quantity_ready为True读成“必定不足”，就用2和7作最小对照：它们取反结果相同，但分别因不足、超库存而失败。not只说明原判断不成立，具体原因仍要看子条件。"),
      p("直接取反单个比较时，把比较围在括号中，让取反范围清楚。新建below_minimum.py，先预测，再保存运行下面完整程序。"),
      sample("notComparison"),
      output("count为2 · 没达到最低量", "True"),
      p("这里not (count >= minimum)只表示“没有达到最低数量”。只改count为3，结果为False；改成7也为False，不能把这条判断解释成“超库存”。先说清原判断，再解释取反后的问题即可。"),
    ] },
    { id: "short-circuit", title: "结果已经确定时，右侧可能不再检查", navGroup: "evaluation", navLabel: "求值与诊断", blocks: [
      p("Python从左到右求值。在quantity_range.py直接写出的and条件中，count为2时左侧已经False，两项同时为真已不可能，于是不再求值右侧。这种一旦结果已确定就跳过后项的行为，叫短路。右侧2 <= 6作为单独比较是True，但本次条件里没有执行到它。"),
      p("or则在左侧已为True时跳过右侧；左侧为False才需要右侧来决定。比如直接用“不足或超限”的两个比较组合，2件时不足已经为真，就足以确定需复核；7件时不足是假，才继续检查超限。"),
      p("先保存enough与within_stock的版本有一点不同：两条赋值已经分别执行过比较，后面的and组合保存的bool，跳过的是右侧名称的读取，不能让之前的比较没发生。当前直接条件例才可能跳过右侧比较本身。"),
      p("3.2的选择链也让你见过“一个比较能成立，但本轮未实际检查”；这里是表达式内部的求值，if/elif/else是选择分支的语句结构。对本课普通数值比较得到的bool进行组合，结果是True或False，后面的题也保持这个范围。"),
    ] },
    { id: "practice", title: "自己设计范围，再用反例修复连接词", navGroup: "practice", navLabel: "独立练习", blocks: [
      p("先独立写，再按需展开提示。一份源码加改值短表足够；相同会话的环境和命令只记一次。表中写事前预测和真实结果，参考表或运行成功标记都不能代替本人执行。"),
      { type: "exercise", id: "combine-quantity-rules", title: "让新数量同时满足两条实际规则", kind: "代码",
        prompt: "自选与正文不同的材料、容量或名额情境，新建.py，自己决定合法名称、新最低量、新最高量和有意义的提示；下界低于上界且留有内部整数，单位相同。分别用两个简单比较得到bool，解释各自含义，再用and组合，以if控制合格提示，块外保留结束提示。固定上下界，选低于下界、恰好下界、内部、恰好上界、高于上界五值，各先预测两项与合格结果，再保存从头运行，保留真实判断和提示。另写有实际意义的or判断（如不足或超限需复核），并对一个保存的bool使用not，实际显示结果并说明取反含义。交本人源码、固定规则、五行改值/预测/真结果表、一次关键命令，两个失败值各一句原因，以及or/not说明。",
        hints: ["先分别问最低要求与最高允许量，确认含不含等值。哪组数据只让第一项失败，哪组只让第二项失败？", "先把两个比较的真假分别列出，再按“必须一起成立”连接；另外的or在问哪种问题，not取反的是哪个保存的判断？最终名称、数字、程序和结果表由你决定。"],
        solution: [
          "例如借阅资料至少4册，手头有9册；books从6开始，minimum_books为4、available_books为9。页尾book_range.py为完整参考，自己的题目另选。enough_books与within_available分别检查>=下界和<=上界，ready用and保存两项同时成立。",
          "needs_check用books < minimum_books与books > available_books的or，问是否不足或超出现有册数；not ready问这次是否不合格。参考依次print两项、ready、needs_check、not ready，再由if ready控制Book batch ready，块外Book check finished。",
          "固定4和9，选3、4、6、9、10。依次五个bool的预解：3为False/True/False/True/True；4、6、9均为True/True/True/False/False；10为True/False/False/True/True。先按自己的数字预测，保存运行python book_range.py（macOS用python3），五轮只改books。",
          "3不足下界、10超过现有量，所以都不显示合格提示；4、6、9显示Book batch ready，五轮最后都有Book check finished。两个含等号的比较让边界通过。两个失败值的not ready虽同为True，却不能单靠它分辨失败原因。",
          "接受其他单位、中文提示和有明确含义的or/not；所用操作数来自简单比较。常错是只测内部值、两项合格条件误用or、not的解释脱离原判断，或改数据时也改了上下界。保持规则，用五组本人运行定位，不能只交预写的真假词。",
        ],
        rubric: [
          "本人新情境/名称/上下界和提示，两个比较含义正确、单位一致，固定范围有内部值；and确实要求两项同时满足。",
          "五组覆盖低/等下界/内部/等上界/高，每轮预测后保存实跑，关键子结果与合格提示可对应；失败两端原因各解释，块外结束均保留。",
          "or的两个子条件与声明的问题匹配，not对指定bool取反且解释准确，源码和真实结果充分；无循环、容器、函数或复杂输入结构。",
        ],
      },
      p("下一题仍规定至少3件且不超过库存6件。下面repair_connector.py可以运行，但有一处连接词不符合需求。先预测count为2会显示哪些行，再保存实际运行，与规定比较；保留这次原始结果。"),
      sample("fault"),
      { type: "exercise", id: "diagnose-connector", title: "为什么不足的材料也被判定可以使用？", kind: "代码",
        prompt: "使用上面的repair_connector.py，先预测再实际复现count为2的错误放行，分别说明两个子比较的结果。保持最低3、库存6及其他源码，另选一个大于库存的反例：预测or是否也误放行，保存实跑（可用7），解释是哪项使结果为真。自行修复这一处连接词，不能删提示或写死False；用2、3、5、6、7各先预测再保存运行，核对两端失败值被排除、合格值仍通过、两个等值也通过。交本人修前/修后源码加一词差异、修前两组真实输出、修后五行预测/实际结果与一次命令，解释原需求和连接规则为何不符，以及or适合的另一种具体问题。",
        hints: ["在count为2时，两个比较分别问什么，各自是真是假？再选一个超过库存的值，看是哪一项能成立。", "本题要求两项都满足，还是其中一项满足就够？按这个要求自行决定连接词，再检验合格值和两端等值，别同时改其他条件。"],
        solution: [
          "2 >= 3为False、2 <= 6为True，原or只需一项为真，因此实际显示Quantity ready、Check finished。正常退出没有证明符合需求；这次是逻辑错误。先保留本人真实输出与源码。",
          "另把count改为7：左项True、右项False，or仍为True，也显示同样两行。与2相比，这回由左项造成误放行；只有内部5件的数据不能揭露这个错误连接词。",
          "需求是至少达到最低量并且不超库存，修复仅把or改为and。页尾修复参考保留原比较、名称、缩进与文字；先留自己的修复再核对。",
          "修后固定3与6，分别保存运行2、3、5、6、7：2与7仅Check finished；3、5、6先Quantity ready再Check finished。命令python repair_connector.py，macOS用python3；各轮先预测再执行，保留一份源码加五行改值结果。",
          "or适合“不足或超限需复核”：两边要相应写成<最低量与>库存。不是把原来两项合格比较原封不动接or就能表达复核。常错是硬编码拒绝、删提示、同时换比较，或修后只测2；用一词差异和合格/边界复验排除这些假修复。",
        ],
        rubric: [
          "修前2和另一个超库存反例实际误放行，能说明两子比较分别真假，两个反例由不同子项使or成立。",
          "只修错误连接词，保留原规则/输出/缩进；解释同时满足与任一满足的差别，未硬编码或删提示。",
          "修后五轮真实保存运行：两端失败、内部及两个等值正确，块外结束保持，修前后源码和结果可对应；说明一个or适用的新问题，无超纲语法。",
        ],
      },
    ] },
    { id: "reference-programs", title: "完成后核对两题参考程序", navGroup: "reference", navLabel: "参考核对", tier: "verification", blocks: [
      p("先保留本人原作再展开。下面依次为题一新情境和题二只改连接词后的完整程序，各自另存，按解答中的五组数据预测和实跑；参考结果不能冒充本人的运行。"),
      sample("own"), sample("fixed"),
    ] },
    { id: "next-step", title: "让测试值真正检验每条要求", navGroup: "finish", navLabel: "回顾与后续", blocks: [
      { type: "summary", points: ["先明确两个子条件各问什么：and要求本课两个bool都真，or至少一个真，not取反已有判断。", "固定范围，用下界外、下界、内部、上界、上界外检验规则，分别说明哪项导致失败；not不自动提供原因。", "短路会在结果已确定时跳过右侧求值，比较能成立与本轮执行到它是两回事；用真实反例检验连接词，不能只看程序正常退出。"] },
      p("保留自己的范围程序与修复记录。现在条件会影响本次动作；如果材料还没数到目标，怎样让同一个动作自动再做一次，并在达到目标时停下？下一节从数量变化进入重复执行。"),
    ] },
  ], resources: [],
  references: [
    { title: "Python布尔运算语义", href: "https://docs.python.org/3.14/reference/expressions.html#boolean-operations", note: "核对and/or/not与求值顺序。" },
    { title: "布尔运算与短路", href: "https://docs.python.org/3.14/library/stdtypes.html#boolean-operations-and-or-not", note: "本课使用比较得到的bool操作数。" },
    { title: "括号与运算优先关系", href: "https://docs.python.org/3.14/reference/expressions.html#operator-precedence", note: "用括号明确比较与取反范围。" },
    { title: "if条件执行", href: "https://docs.python.org/3.14/tutorial/controlflow.html#if-statements", note: "已保存的bool也可作为条件。" },
  ],
});
