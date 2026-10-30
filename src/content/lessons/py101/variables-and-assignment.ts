import { lessonSchema, type ContentBlock } from "../../models";
import { variableCode, variableBlockNames, type VariableCodeKey } from "../../resources/python-variables";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string): ContentBlock => ({ type: "code", filename, code: text, language: "text" });
const sample = (key: VariableCodeKey): ContentBlock => ({ type: "code", filename: variableBlockNames[key], code: variableCode[key], language: "python" });
const sourceLines = (key: VariableCodeKey) => variableCode[key].split("\n").map((line, i) => `第${i + 1}行：${line}`).join("；");

// 编辑简报、起草前预解、官方来源与真实运行证据：docs/py101-p8/。
export const pythonVariablesAndAssignmentLesson = lessonSchema.parse({
  id: "PY101-C02-L01", courseId: "PY101", chapterId: "PY101-C02", contentVersion: 1,
  title: "用变量保留并更新程序里的值", optionalLesson: false,
  subtitle: "自己给任务文字取个名字，预测更新前后的输出，再修复一次读得太早的错误。",
  prerequisites: "已完成第一章：能在电脑上创建、保存和完整运行.py，使用print及成对引号，核对文件位置与解释器；接触过1.5的最小赋值和名称读取。沿用已可运行的Python 3与编辑器，不重新安装软件。手机可阅读，独立代码实践需要电脑。",
  prerequisiteLinks: [
    { title: "1.1 从终端执行文件", href: "/learn/PY101/PY101-C01-L01#run-script", note: "补齐.py和print的运行。" },
    { title: "1.3 保存后完整重跑", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "核对保存状态、cwd与实际目标。" },
    { title: "1.5 最小赋值经验", href: "/learn/PY101/PY101-C01-L05#first-cells", note: "回顾名字、文字与命名建议；本节转到普通脚本。" },
    { title: "1.6 读懂相关错误", href: "/learn/PY101/PY101-C01-L06#read-evidence", note: "保留错误类型及对应代码行。" },
  ],
  objectives: [
    "在自己创建的.py中用合法名称保存文字并输出当前值，区分名称和引号内的固定文字",
    "预测同一名称重新赋值前后的输出，只修改第二次赋值，保存重跑并解释哪一行变化",
    "按执行顺序找出首次赋值前的读取，记录实际错误，保留名称读取语义修复并从头运行",
  ],
  assessmentMap: [{ objective: 1, exerciseIds: ["keep-and-update"] }, { objective: 2, exerciseIds: ["keep-and-update"] }, { objective: 3, exerciseIds: ["repair-first-read"] }],
  learningTime: { reading: [10, 15], practice: [5, 8], coding: [10, 15], basis: "editorial-estimate" },
  sections: [
    { id: "changing-task", title: "任务变了，程序怎样接着使用新文字？", navGroup: "start", navLabel: "名称与值", blocks: [
      p("一个小程序先显示当前任务“打包笔记本”，稍后要改为“检查标签”。如果把同一任务文字在各处重复写死，修改时容易漏掉一处。我们可以先给这份文字取一个名字，使用时读这个名字，需要变化时再给它新的值。"),
      p("在1.5，你用marker和两格代码观察过内核记住的内容。这次回到普通.py文件：自己选名字、写出赋值与读取，并判断程序运行到不同位置时会显示什么。所有例子只用Python自带功能。"),
    ] },
    { id: "name-and-value", title: "先把一份文字交给名称", navGroup: "start", navLabel: "名称与值", blocks: [
      p("先看这一行，暂时只理解它的作用，下一段会把它与其他行组合成完整脚本："),
      sample("assign"),
      p("task_name是我们选择的名称，意思是任务名称；\"Pack notebooks\"是这次给它的文字值。和1.1一样，配对英文引号标记字符串的开始和结束，引号不是名称的一部分。"),
      p("执行这条语句时，=让左边的task_name对应右边的值，这个动作叫赋值。这种运行时的对应关系叫绑定。=在这里执行一个动作，并不要求你判断数学等式是否成立。"),
      p("本节把能绑定到值、供后续读取的名称称为变量，task_name就是变量名。它帮助后面的代码找到当前对应的值。之后再次赋值，可以改变这份对应关系；理解变量时，先抓住名称和当前值这两件事。单独执行赋值不会像print那样显示一行文字。"),
    ] },
    { id: "choose-name", title: "自己选一个能使用的名称", navGroup: "start", navLabel: "名称与值", blocks: [
      p("沿用1.5的便捷建议：用英文字母开头，后面接英文字母、数字或下划线，名称中不放空格。例如task_name、label2都符合这种写法。task_name中的下划线把两个词连成一个名称；my plan含空格、1plan以数字开头，都不能用作这里的变量名。"),
      p("Python有一些保留给语言本身的词，称为关键字，例如for、class，不能拿来作普通变量名。本次可选带含义的task_label、next_task等名字，也避开print，留着这个已有的输出工具。赋值处和读取处的拼写、大小写要一致；task_name和Task_name是两个名字。"),
      p("这些英文写法方便初次练习，不是Python全部合法名称的清单。下划线开头的名称以及用某些中文等文字组成的名称也可以合法使用。练习接受其他合法名称；一个清楚表达用途的名字，比只写一个字母更容易检查。"),
    ] },
    { id: "read-and-update", title: "读取当前值，再给同一名称新值", navGroup: "execution", navLabel: "读取与更新", blocks: [
      p("在刚才的赋值之后接上这一行："), sample("read"),
      p("print(task_name)先读取task_name此刻对应的值，再显示它，所以这里会显示Pack notebooks。括号里没有引号，读取的是名称；写print不会自动给尚未有值的名称赋值。"),
      p("再在这次读取后面写："), sample("update"),
      p("这还是同一个task_name。执行这一行时，它改为对应Check labels，称为重新赋值。后续再执行print(task_name)，会读到新的文字。名称保持相同，当前值可以随执行的赋值改变。"),
    ] },
    { id: "predict-run", title: "先预测四行代码，再运行完整脚本", navGroup: "execution", navLabel: "读取与更新", blocks: [
      p("在自己的练习文件夹新建task_labels.py，源码放在.venv外。用编辑器把下面四行写入，行首都不加缩进。先在本地笔记写下两行预测：第一次print执行时，之前已经发生哪次赋值？第二次print之前又发生了什么？写好再保存运行。"),
      sample("main"),
      p("确认编辑器已保存，终端用pwd和Windows的dir（macOS为ls）确认当前目录包含这份文件。沿用第一章已核验的解释器命令：Windows在PowerShell运行下面第一条，macOS在终端运行第二条；若此前一直用py，保持使用py。命令输入在终端提示符后，不放进.py，也不只运行编辑器选区。"),
      code("Windows · PowerShell · 文件所在目录", "python task_labels.py"),
      code("macOS · 终端 · 文件所在目录", "python3 task_labels.py"),
      p("如果沿用项目.venv而未激活，也可以按1.4直接调用已核验的环境解释器，脚本参数仍为task_labels.py。本节不创建新环境。实际结果应为："),
      code("完整运行 · 预期输出", "Pack notebooks\nCheck labels"),
      { type: "table", caption: "沿实际执行顺序看当前值", columns: ["刚执行到哪里", "task_name当前对应什么", "这一步的显示"], rows: [
        ["第1行赋值后", "Pack notebooks", "无普通输出"],
        ["第2行print", "Pack notebooks", "Pack notebooks"],
        ["第3行重新赋值后", "Check labels", "无普通输出"],
        ["第4行print", "Check labels", "Check labels"],
      ] },
      p("第一条print已经把旧值显示出来，第三行才开始执行新的赋值。后来的赋值会影响后续读取，不会倒过来改写已经显示的第一行。判断某次输出时，要看它执行之前真正发生的动作。"),
    ] },
    { id: "change-one-value", title: "只改第二次赋值，会改变哪一行？", navGroup: "execution", navLabel: "读取与更新", blocks: [
      p("现在自己另选一项任务，只改第三行引号内的文字，其他三行保持不动。先写两行新预测，再保存，用同一条命令从头运行整个文件，比较这一次和上一次的真实输出。"),
      p("例如把第二次赋值的文字换成Sort envelopes，第一行仍应为Pack notebooks，第二行变为Sort envelopes。原因是第一次读取之前的赋值没有改变，而第二次读取之前执行了修改后的赋值。用你自己选的文字再核对一次，不用把这个变式也抄进文件末尾。"),
      p("若仍显示旧文字，先按1.3核对保存标记、当前目录与执行目标，再比较源码。编辑内容、保存文件与运行程序是三个动作，新的输出来自这次实际执行。"),
    ] },
    { id: "literal-or-name", title: "有引号的文字和无引号的名称", navGroup: "compare", navLabel: "区分与排错", blocks: [
      p("回顾1.1：引号围起来的是固定字符串。另建name_or_text.py，先预测下面两次显示会不会相同，再保存并完整运行；命令中的文件名换成name_or_text.py。"),
      sample("literal"), code("对照 · 预期输出", "task_name\nReady"),
      p("print(\"task_name\")直接显示引号里的task_name这几个字符，没有读取这个名称。print(task_name)读取当前绑定的值，所以显示Ready。两行都使用print，差别在括号中的内容：固定文字，还是名称读取。"),
      p("如果想保存Ready这段文字，就保留它两端的引号。去掉后，Ready会被当成另一个名称；若本次程序没有给它提供值，读取就可能失败。下一段用一个更容易定位的完整脚本实际观察这种未定义名称错误。"),
    ] },
    { id: "fresh-script", title: "每次从终端启动，是本次脚本的执行", navGroup: "compare", navLabel: "区分与排错", blocks: [
      p("本节使用的是常规终端命令启动的新Python脚本进程：每次运行，都会从文件开头按源码顺序执行这几条语句。上一次运行结束时给名称赋过值，不会让下一次新进程自动拥有那个绑定。源码文件保存了语句，这次真正执行到赋值时才建立对应关系。"),
      p("1.5的Notebook可以在仍运行的同一内核中保留先前执行过的名称；那是另一种执行方式。这里不用Notebook旧状态补齐.py中缺失的步骤。把脚本保存并从头运行，是检查当前文件本身是否足够的办法。"),
    ] },
    { id: "first-read-error", title: "赋值写在后面，为什么第一行仍报错？", navGroup: "compare", navLabel: "区分与排错", blocks: [
      p("在新的dispatch_label.py中保存下面两行。先预测这次能否显示Packed T7，再从终端完整执行它。这是有意安排的失败实验，预期会出现NameError；保留你实际看到的相关代码行及错误末行。"),
      sample("firstRead"),
      p("运行到第一行时，程序需要读取dispatch_label，却还没有执行第二行的赋值，所以本次没有正常的任务输出。错误类型是NameError，描述会提到dispatch_label未定义；文件路径、行号排版与箭头可能随环境或Python版本变化，以自己的真实回溯为准。后面有赋值文本，并不等于它已经执行。"),
      p("修复要让提供值的赋值先于读取执行。保留通过名称显示任务的做法，自己调整顺序，保存后从头运行，核对是否正常显示Packed T7。这次原因来自已给定脚本的执行顺序；无需重装Python、安装包或改PATH。其他NameError仍要结合对应代码判断，不能都套用同一根因。"),
    ] },
    { id: "practice", title: "自己写一次更新，再独立修复一次读取", navGroup: "practice", navLabel: "独立练习", blocks: [
      p("先合上示例和参考答案完成任务。网页输入框只是临时笔记；正式成果保存在本地.py及短记录里。只需列出源码、命令、预测与实际结果，不必抄成长篇报告。"),
      { type: "exercise", id: "keep-and-update", title: "自己的任务标签会怎样改变？", kind: "代码",
        prompt: "创建与正文不同的.py文件，自选新的任务情境、一个合法名称和两段不同文字。自己写第一次赋值与名称读取，再写同一名称的第二次赋值与名称读取。运行前预测两行输出，保存并真实执行。随后只改第二次赋值的文字，再预测、保存并完整运行一次。交付实际源码（保留改前/改后差异）、运行命令、两次预测和两次真实输出；简短说明为什么第一行不随后面的赋值倒退改变，再用一句话区分名称与引号里的文字。名称不必是task_name，接受其他合法写法；不能只交参考输出。",
        hints: ["沿程序从上到下走到每一次print，观察此前最近执行过哪次给这个名称赋值的语句。", "把自己的两次赋值和两次读取分别标出，核对实际顺序。只改后一次赋值后，重新预测哪些读取会遇到它；仍由你独立选名、填新文字、保存和执行。"],
        solution: [
          "例如布展任务另建gallery_plan.py，选display_note：它以字母开头，只有字母和下划线，且不是关键字。以下只是一种参考，其他合法名称和任务内容同样接受。",
          `参考初稿从上到下写四行，分号只是这里的分隔说明，不输入文件：${sourceLines("ownInitial")}。两段文字用配对引号包住，两次print中的名称与赋值拼写一致。先预测Hang posters、Place signs两行，再保存；Windows可用python gallery_plan.py，macOS用python3 gallery_plan.py，保留本人真实结果。`,
          `只修改后一次赋值后的四行依次为：${sourceLines("ownChanged")}。重新预测后完整运行，应为Hang posters、Open doors。第一次print发生在后一次赋值之前，因此第一行保持原样，第二行读取更新后的值。`,
          "display_note是不带引号、用于读取的名称，\"Hang posters\"等是引号内固定文字。若把print中的名称加上引号，会改成显示名称文字本身，已经改变读取含义。",
          "常错包括：只改编辑区未保存、命令指向另一文件、赋值/读取拼写或大小写不同。后两种名称差异若导致读取未定义名称，可能出现NameError；漏掉配对引号可能是SyntaxError，把应为文字的内容写成未定义名称也可能NameError。按实际行检查，不只抄错误名。接受配对单引号和中文文字，但必须保留自选内容与两次实际执行。",
        ],
        rubric: [
          "实际新.py使用自选合法名称与新情境，两段文字不同；有同名两次赋值及两次名称读取，源码和运行命令对应。",
          "两轮都有运行前两行预测和真实输出；改后只改变第二次赋值，结果与执行位置相符，差异有核对。",
          "结合本人代码说明第一行已在更新前显示，不会被后来赋值改写；能区分名称读取与引号内固定文字。读完标记、复制样例或只有解释不代替代码与运行。",
        ],
      },
      p("下一题使用first-read-error中的两行dispatch_label起始源码，可回到上方代码框复制到另建的repair_label.py。它故意在第一次赋值前读取名称；不要先套用修复参考。"),
      { type: "exercise", id: "repair-first-read", title: "为什么脚本还没开始显示任务就报错？", kind: "实验",
        prompt: "确认repair_label.py的真实位置与保存状态，内容为上方dispatch_label两行故障源码。先预测首次运行现象，再从终端实际执行，保留真实错误类型、相关代码行和末行。按这次执行顺序判断：读取时，这个名称是否已经有值？自己决定安全修复方法，保留变量赋值与名称读取的语义，保存并从头重跑。交付修复前后源码、命令、错误及恢复后的真实输出，再简短解释本次新脚本为何不能依赖以前Notebook内核的状态。只改成print(\"Packed T7\")跳过了名称读取，不能算本题完成；不通过重装、改PATH或删环境解决。",
        hints: ["从这次脚本第一条执行语句开始看。它需要的名字，在此前的本次执行中已经获得值了吗？", "分别找到提供值的赋值语句与读取语句，比较它们在文件中的位置；考虑怎样调整依赖顺序并保留名称读取，然后自行保存与完整重跑。"],
        solution: [
          "新脚本先执行print(dispatch_label)，该名称尚未被本次执行绑定，因此真正运行会出现NameError，且没有Packed T7正常输出。赋值虽然写在文件第二行，但报错发生时还没有执行到那里。先保存本人实际回溯和对应行，不用参考文字代替故障证据。",
          `一种修复后的repair_label.py分两行写：${sourceLines("repaired")}。先提供值再读取。可以把赋值移到读取前，也可以把读取移到赋值后；保留同一名称和任务文字即可。`,
          "保存后从文件所在目录运行python repair_label.py（macOS用python3，已验证的py也可）。预期正常输出Packed T7，实际结果需自己保留；恢复成功要对应保存的整份源码。",
          "本节从终端启动新的脚本进程，不会继承先前另一个Notebook内核中的名称。即使旧内核曾有同名变量，也要让当前文件自己提供读取前所需的值。",
          "常错是只把print改成固定文字、只跑选区、依赖旧交互窗口或只写“调整顺序”而没保存重跑。若改了名称，要在赋值和读取处一致修改并说明；若真实错误不同，先核对实际文件和代码，不伪造NameError。",
        ],
        rubric: [
          "在已确认的保存文件上真正复现首次读取错误，保留实际命令、相关代码与NameError，不以预贴错误文字替代。",
          "依据本次执行先后指出读取时尚未绑定；修复仍含赋值及名称读取，提供值先执行，未用输出常量绕开任务。",
          "保存修复源码并从头运行，保留真实Packed T7输出与命令；能解释新脚本进程和旧Notebook内核状态的区别。",
        ],
      },
    ] },
    { id: "next-step", title: "用自己的文件检查这三件事", navGroup: "finish", navLabel: "回顾与后续", blocks: [
      { type: "summary", points: ["给值选择合法名称，执行赋值后再通过名称读取；引号中的内容表示固定文字。", "按执行位置预测当前值，重新赋值影响后续读取；保存并完整重跑验证自己的改动。", "遇到本次未定义名称错误，结合相关代码与执行先后检查提供值的步骤，再保留语义修复和复跑。"] },
      p("保留两个自己的.py及短记录，能现场换一个名字或任务文字并再次验证，才有独立操作的证据。网页读完只记录阅读，不会自动判断这些程序是否达标。"),
      p("接着学习2.2「分清文字、整数、小数和真假值」，它已有待人工审核试读，将用实际类型观察接续本节的名称与值。2.3–2.6仍只有规划；第5章函数试读还需要表达式与控制流程等中间先修，不能把阅读器的可读课时导航当作直接跳学建议。整门PY101仍在筹备。"),
    ] },
  ],
  resources: [],
  references: [
    { title: "Python赋值语句", href: "https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements", note: "核对名称的绑定和重新绑定。" },
    { title: "表达式中的名称", href: "https://docs.python.org/3/reference/expressions.html#identifiers-names", note: "核对名称读取与未绑定情形。" },
    { title: "合法名称与关键字", href: "https://docs.python.org/3.14/reference/lexical_analysis.html#identifiers", note: "名称字符、大小写和保留词。" },
    { title: "错误与异常", href: "https://docs.python.org/3/tutorial/errors.html", note: "识别错误类型和相关代码位置；本节不教异常处理。" },
    { title: "Python入门", href: "https://docs.python.org/3/tutorial/introduction.html", note: "赋值、字符串及最小例子。" },
    { title: "从终端执行脚本", href: "https://docs.python.org/3.14/using/cmdline.html#interface-options", note: "脚本文件参数和常规执行方式。" },
  ],
});
