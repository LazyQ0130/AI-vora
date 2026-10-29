import { lessonSchema, type ContentBlock } from "../../models";
import { firstRunProgram } from "../../resources/core-programs";
import { resourcesForProgram } from "../../resources/programs";

// 编辑简报与2026-10-29官方核验：docs/py101-p0/。正文、.py和Notebook同源。
const sample = firstRunProgram;
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, language, code: text });
const hello = sample.core.split("\n")[0] + "\n";

export const pythonFirstRunLesson = lessonSchema.parse({
  id: "PY101-C01-L01", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 1,
  title: "从零运行第一个Python程序",
  subtitle: "让电脑显示自己写的文字：运行一行，保存成文件，再修改和排错。",
  prerequisites: "会打开软件、输入文字、创建文件夹与保存文件即可；无需Python或AI000基础。准备一台允许使用本地Python的电脑和英文输入法。手机可阅读，代码实践需要电脑。",
  objectives: [
    "在本地确认解释器版本，并用自己的运行记录区分代码文件、解释器和输出",
    "独立修改并运行一个.py文件，先预测再核对print产生的逐行结果",
    "根据文件位置或报错定位一次运行失败，并验证恢复后的结果",
  ],
  assessmentMap: [{ objective: 1, exerciseIds: ["own-message"] }, { objective: 2, exerciseIds: ["own-message"] }, { objective: 3, exerciseIds: ["find-script"] }],
  learningTime: { reading: [12, 18], practice: [8, 12], coding: [15, 25], basis: "editorial-estimate" },
  sections: [
    {
      id: "first-output", title: "先让电脑说一句话", navGroup: "start", navLabel: "首次输出",
      blocks: [
        p("你想让电脑显示一句问候。我们先让它显示 Hello, Aivora!，接着把问候换成自己的文字。下面是第一条Python指令；运行成功后，屏幕应出现下一框中的一行文字。"),
        code("第一条Python指令", hello, "python"),
        code("预期输出（只用于核对）", "Hello, Aivora!\n"),
        p("Windows：打开开始菜单，搜索并打开 PowerShell。macOS：在「应用程序 → 实用工具」中打开「终端」。终端是接收文字命令、显示执行结果的窗口。先在这个窗口输入下面对应系统的命令，按回车。"),
        code("Windows · 在PowerShell输入", "python --version"),
        code("macOS · 在终端输入", "python3 --version"),
        p("若出现 Python 3.x.x（例如 Python 3.14.2），说明这个命令能启动解释器。解释器是执行Python代码的软件，版本号说明这次用的是哪一版。记下你的实际版本。若没有版本号、打开商店或出现找不到命令，转到下一段「还没有可用的Python时」，装好后回到这里。已有受支持的3.x能用，就先继续。"),
        p("Windows输入 python，macOS输入 python3，再按回车。看到 >>> 后，解释器正在等待Python指令。只把上面的 print(\"Hello, Aivora!\") 复制进去并回车；>>> 是窗口自己显示的提示符，不复制。若你已经用 py --version 验证了Windows的 py 命令，也可用 py 进入，后文的 python 一律换成 py。"),
        p("你应看到 Hello, Aivora!，下一行重新出现 >>>。文字来自刚才的指令；>>> 表示可以继续输入。完成这一行后，在 >>> 后输入 quit() 并回车，回到PowerShell或系统终端。quit() 这里只用于离开交互窗口；本节不展开它的定义。"),
        { type: "callout", title: "把安装等待单独安排", text: "页面预计时间是编辑估计。安装、下载与故障恢复另预留15–40分钟；权限或网络问题可能更久。若受阻，记下命令和完整提示，找教学支持解决本地环境。先写预测可以继续准备，真正运行成功后才完成本课。" },
      ],
    },
    {
      id: "local-python", title: "还没有可用的Python时", navGroup: "setup", navLabel: "本地环境",
      blocks: [
        p("Windows新安装：打开下方Python官方下载页，选择 Python Install Manager（安装管理器），从官网提供的安装文件或Microsoft Store安装。它负责取得和启动解释器；不是写代码的编辑器。按安装提示完成后，关闭旧PowerShell窗口并新开一个，再运行 python --version。首次调用在没有运行时的情况下可能联网下载当前稳定版，等下载完成后再检查版本。"),
        p("当前官方路线使用Install Manager，不依赖旧版安装器的「Add Python to PATH」截图。通常可面向当前用户安装，学校或单位设备仍可能禁止安装。遇到权限提示、组织限制或下载失败时，保留提示，请管理员或教学支持提供获准的本地Python；不需要取得管理员密码或关闭防护来做本课。"),
        p("Windows已有安装：再试 py --version。python 是运行Python的常用命令；当前Install Manager的 py 也能运行解释器，并支持版本选择和管理。旧版Python Launcher也叫 py，因此两者未必选中同一版本，py list 也不是每台旧电脑都支持。以实际成功的版本命令为准，选定一个后全课一致使用；不为本课删除已有Python。"),
        p("若 python 和 py 都找不到：先确认安装确实完成、重开终端，再在开始菜单搜索「管理应用执行别名」，查看是否存在官方的 Python (default) 项及其启用状态。别名是系统把命令交给程序的入口。可以将这一观察与 py --version 的结果一并交给教学支持；完整PATH配置留待有需要时处理。若 python 打开商店，也按这个方向检查，不反复盲点安装。"),
        p("macOS新安装：从官网下载适配macOS的稳定版 .pkg，打开后先读安装器列出的系统要求，再按提示安装。官方通用安装包支持相应版本的Apple Silicon与Intel机型；标准安装需要管理员授权。没有权限就请管理员或教学支持准备已获准的本地环境。安装后按官方说明运行「应用程序 / Python 3.x」中的 Install Certificates.command 完成证书配置，随后新开终端，运行 python3 --version。"),
        p("macOS统一用 python3；有些电脑不提供 python。若提示安装Apple开发工具，先取消这条分支，按Python官网路线或找教学支持核对；不要修改或删除Apple管理的 /usr/bin/python3。若版本不可用，确认安装完成并重开终端；把实际命令和提示交给支持人员。"),
        { type: "reading-links", title: "安装时打开官方页面", links: [
          { title: "Python官方下载", href: "https://www.python.org/downloads/", note: "选择稳定版，跳过标有alpha、beta、rc或pre-release的测试版。" },
          { title: "Windows安装与故障排查", href: "https://docs.python.org/3/using/windows.html", note: "核对Install Manager与已有安装的差异。" },
          { title: "macOS安装说明", href: "https://docs.python.org/3/using/mac.html", note: "核对系统要求、管理员授权与证书配置。" },
        ] },
        p("获得版本号后，回到「先让电脑说一句话」完成那一行输出。后面的代码只使用Python自带的功能，不需要安装第三方库。"),
      ],
    },
    {
      id: "print-text", title: "这一行怎样变成屏幕上的文字", navGroup: "text", navLabel: "文字输出",
      blocks: [
        p("print 是Python自带的显示指令：把圆括号里的内容写到输出窗口。这里的英文双引号把一段文字的开始和结束标出来；引号本身不会显示。括号和引号都要成对，建议切换英文输入法输入这些符号。Hello, Aivora! 里面的空格、逗号、感叹号会原样显示。"),
        p("这种用引号围起来的文字叫字符串。英文单引号也能标记字符串，开头结尾应使用同一种；本节先用双引号。每执行一条这样的 print，默认在显示完后换到下一行。先试着预测：连续写两条，会得到一行还是两行？保存成文件后就能直接观察。"),
        { type: "quiz", id: "file-interpreter-output", question: "保存了 first_run.py，并用 python first_run.py 看到问候。哪组对应正确？", options: ["first_run.py是代码文件；python启动解释器；问候是输出", "first_run.py是解释器；python是问候内容"], correct: 0, explanations: ["文件保存指令，解释器执行指令，输出是本次执行的结果。后面的开放练习还要用自己的文件和记录说明。", ".py文件是你保存的文字指令，运行它的软件才是解释器。"] },
      ],
    },
    {
      id: "save-script", title: "把两条指令保存成文件", navGroup: "file", navLabel: "保存与运行",
      blocks: [
        p("交互窗口适合立即试一行；要反复运行自己的几条指令，可以保存成脚本文件。脚本是存有程序指令的文本文件，这里用 .py 结尾的文件名。先在你能写入、容易找到的位置创建一个新文件夹 aivora-python，例如自己的「文档」中。记下它的位置。"),
        p("Windows打开记事本，它在这里充当编辑器：用来输入并保存代码。新建文档，复制下面两行。选择「文件 → 另存为」，进入刚建的 aivora-python 文件夹，文件名填 first_run.py；文件类型选「所有文件」，编码选 UTF-8，再保存。UTF-8是一种保存文字的方式，可保留中文。用文件属性确认实际名字是 first_run.py，结尾没有多出 .txt。"),
        p("macOS可打开官方安装附带的「应用程序 → Python 3.x → IDLE」。IDLE包含编辑窗口和交互窗口；在菜单选择 File → New File，向新编辑窗口复制下面两行，再 File → Save，选 aivora-python 文件夹，保存为 first_run.py。若找不到IDLE，可在已经验证过的终端输入 python3 -m idlelib 启动它；该命令只是打开随Python提供的编辑工具，本节不展开模块语法。无法启动时向教学支持确认安装组件。"),
        code("first_run.py", sample.core, "python"),
        p("代码框的复制按钮只复制两行源码。不要把文件名、行号、>>>、命令或预期输出写进文件。保存后的文件会留在电脑上；网页练习框中的输入只是临时自查，刷新后可能丢失。"),
        { type: "downloads", resourceIds: ["first-run-python"] },
        p("下载提供相同的两行起始代码，方便核对。如果使用下载，请移到刚建的文件夹并确认名字；练习仍要求你亲自修改。第一节只用.py；Notebook的使用另有规划。"),
      ],
    },
    {
      id: "run-script", title: "在文件所在的位置执行", navGroup: "file", navLabel: "保存与运行",
      blocks: [
        p("回到PowerShell或系统终端。当前目录就是这个窗口此刻用来寻找文件的文件夹；刚保存文件不会自动改变终端所在的位置。cd 是改变当前目录的命令。Windows在资源管理器进入 aivora-python，点击地址栏复制完整路径；输入 cd、一个空格和英文双引号，把路径粘贴在引号内。下面路径只是示例，换成你电脑上实际的位置。"),
        code("Windows · PowerShell示例（逐行执行）", 'cd "C:\\Users\\你的用户名\\Documents\\aivora-python"\npwd\ndir'),
        p("pwd 显示当前目录，dir 列出其中的文件。确认列表中确实有 first_run.py，再执行下面一行。终端显示的 PS C:\\…> 等前缀不需要输入。若仍看到 >>>，先输入 quit() 退出解释器，再输入终端命令。"),
        code("Windows · PowerShell", "python first_run.py"),
        p("macOS同样先 cd 到实际保存位置；下面用自己的文稿目录作示例，实际文件夹不同就替换整段路径。pwd显示位置，ls列出文件。引号让含空格的路径也能作为一个整体传入。"),
        code("macOS · 终端示例（逐行执行）", 'cd "$HOME/Documents/aivora-python"\npwd\nls\npython3 first_run.py'),
        p("两种系统都应得到下面的两行输出。执行完后回到系统终端的命令提示处，说明这次脚本运行已经结束。第二行是程序自己写出的提示文字；它不会自动检测文件名，改名时也不会自动跟着改。确认文件来源主要看pwd、文件清单和运行命令中的路径。"),
        code("脚本预期输出", "Hello, Aivora!\nFile: first_run.py\n"),
        p("这次过程可以逐项指出：first_run.py保存两条指令；python（或选定的py、macOS的python3）启动解释器读取文件；两条print按从上到下的顺序产生两行输出。屏幕上的旧输出不会因编辑文件自动更新，每次检查修改都要重新执行。"),
      ],
    },
    {
      id: "change-message", title: "让结果带上自己的变化", navGroup: "change", navLabel: "修改与排错",
      blocks: [
        p("先不看答案，把第一行引号内的文字换成一件你今天想完成的小事，保留第二行。运行前，在纸上或本地笔记预测两行输出；保存文件，再用刚才的命令执行。逐行比较预测和实际结果。若第一行还显示旧问候，先确认已保存，以及运行命令是否指向正在编辑的文件。"),
        p("这一轮只改引号内的文字，括号和配对引号保持完整。文字可以用中文；若中文显示异常，先确认文件保存为UTF-8，再临时换成英文短句核对执行过程，把显示问题单独记录。接下来的核心练习会要求你独立改两行并新增一行。"),
      ],
    },
    {
      id: "locate-errors", title: "没得到预期结果，从现象找原因", navGroup: "change", navLabel: "修改与排错",
      blocks: [
        p("先读错误信息，再决定查哪一处。命令找不到时还没开始执行源码；can’t open file 表示没有打开指定文件；SyntaxError表示代码写法无法被解释器解析。报错的大小写、路径和具体措辞可能随版本变化，优先看它指向的文件及行号。"),
        { type: "table", caption: "按可观察现象逐项恢复", columns: ["看到什么", "先检查什么", "恢复后怎样验证"], rows: [
          ["python命令不可用，或打开商店", "重开终端，核对安装完成与py --version；回看安装段", "用选定命令取得版本号，再跑第一条print"],
          ["can’t open file / No such file or directory", "pwd位置和dir（macOS为ls）是否包含目标文件", "cd到实际保存文件夹，按清单中的准确文件名运行"],
          ["清单里是first_run.py.txt", "文件属性中的完整名称；记事本另存为类型", "将自己这一个文件另存为所有文件类型的first_run.py，再核对清单并运行"],
          ["SyntaxError，可能提到unterminated string literal", "报错行的一对英文引号和括号；别把中文弯引号当英文引号", "补全配对符号并保存，重新运行至两行正常输出"],
          ["输出还是旧文字", "编辑器是否保存；pwd和运行命令是否对应编辑文件的位置", "先保存，给正在编辑的第一行改一个独特标记，重跑核对标记"],
          ["把cd或python first_run.py输入后出现SyntaxError", "窗口是否正在显示>>>", "在>>>后quit()回到系统终端，再输入终端命令"],
        ] },
        p("想观察语法错误，可在自己的练习文件第一行临时删掉结尾的英文引号，保存再运行。文件会在解析阶段失败，这次不会产生原来两行正常输出；终端中更早的旧输出仍可能留着。把引号补回、保存、重跑，才算验证恢复。无需为这个错误重装Python。"),
      ],
    },
    {
      id: "practice", title: "合上示例，完成自己的程序", navGroup: "practice", navLabel: "独立练习",
      blocks: [
        { type: "exercise", id: "own-message", title: "修改并运行三行提示", kind: "代码",
          prompt: "输入：本节下载的first_run.py两行起始文件。选一个自己的主题（不使用正文原句），改写两条输出，再增加第三条提示；其中一行加入你自己选的独特标记，便于辨认版本。先写三行预测，保存后在本地执行。交付：最终.py、预测与实际输出、实际文件位置和运行命令、解释器版本命令及结果。最后用一句话指出其中哪个是文件、哪个启动解释器、哪些是输出，并写一致或标出差异。记录只需这些短项，不写长报告。",
          hints: ["查看哪些文字位于配对引号内；想想新增一行输出需要增加哪种指令。先用自己的文字预测，再碰运行命令。", "在起始文件里逐条改引号内文本，独立补第三行；保存后用pwd和文件清单确认位置，再用已验证的解释器命令执行。逐行核对数量、顺序和独特标记。"],
          solution: ["先自己确定主题和标记；例如选学习提醒、标记B7，可依次输出 Reading plan B7、File: first_run.py、Next: run again。这只是一个可行例子，你的内容应由你选择。", "在文件中分别写三条print，每条用成对英文引号包住自己的文字；预测三行内容及顺序，然后保存为UTF-8的.py。", "Windows记录python --version（或全程py --version）；macOS记录python3 --version的真实输出。确认当前目录有文件，运行python first_run.py（或py / python3对应命令），保存实际输出并逐行比较。", "文件是保存的指令，解释器是运行这些指令的软件，输出是执行后显示的文字。常见错误：只改网页框、文件未保存、只复制三行参考文字却没有独立选主题；应回到本地文件完成变化并重新验证。合理替代：中文主题、配对单引号、其他.py文件名均可，但命令和记录须对应实际文件。"],
          rubric: ["源码确实修改了两条文字并新增第三条，含自己选择的标记；能用选定解释器在本地运行。", "预测发生在运行前，保留真实三行输出；数量、顺序与内容一致，或解释并修正差异。", "版本号、文件位置和运行命令均来自自己环境；能准确指出文件、解释器与输出。复制参考例子或只有阅读标记不足以通过。"],
        },
        { type: "exercise", id: "find-script", title: "程序存在，为什么说找不到？", kind: "实验",
          prompt: "输入：你刚才能运行的.py。先记录它所在的完整文件夹位置。在这个文件夹内新建一个空文件夹 run-check（仅创建，不移动或删除原文件），回到原终端输入 cd run-check。先用pwd与dir（macOS为ls）观察，再执行原来的相对文件名命令，如python first_run.py。保存实际失败信息。交付：失败时的位置/命令/现象、你判断的原因、恢复命令和成功输出；解释为什么这次错误应先查文件位置。文件名若不同，命令随之替换。",
          hints: ["看失败信息是在说Python命令不存在，还是在说文件打不开；比较当前目录与源码所在目录。", "pwd显示刚进入的run-check，文件清单没有原.py。选择回到记录的原目录，或给解释器传入那个文件的完整路径；路径有空格时用英文双引号包住。再核对恢复输出。"],
          solution: ["run-check位于原文件夹内部且为空；从这里运行python first_run.py时，解释器会在当前目录寻找这个相对文件名，所以打开失败，尚未执行print。macOS用python3，原理相同。", "一种恢复：cd后跟用双引号包住的原文件夹完整路径，再核对pwd与文件清单，执行原命令。另一种恢复：留在run-check，输入python后加双引号包住的.py完整路径（macOS用python3）。两者都指向你原来的文件。", "重跑应出现练习一中自己的三行输出和标记；把失败与恢复后的命令、输出对照保存。常见误判：重装解释器、只改print或只回忆示例输出，都没有修复查找位置。", "若原命令本来使用绝对路径，进入run-check仍可能成功；本题要改用相对文件名才能复现。若run-check已有同名脚本，另建一个明确的新空练习文件夹再做，保留现有文件。"],
          rubric: ["真的在不含原脚本的目录中执行相对文件名，保留失败信息，不伪造报错。", "原因能联系pwd、文件清单和命令；明确解释器已启动但指定文件未打开。", "独立采用一种合法恢复路径，成功运行并核对自己的输出；路径命令可因电脑位置不同而不同。"],
        },
      ],
    },
    {
      id: "next-step", title: "保留程序，准备下一次运行", navGroup: "finish", navLabel: "下一步",
      blocks: [
        p("把最终.py和两次练习的简短记录留在本地。下次即使关掉终端，也能找到文件、确认解释器、运行命令并核对自己的输出，这才是本节留下的编程成果。网页上的「读完」只记录阅读，不会替你验证程序。"),
        p("建议下一节学习1.2「解释器怎样找到并执行脚本」，把本节的一次成功运行推广到不同目录。1.2已有待人工审核的试读教材，完成后可继续1.3「用编辑器完成保存与重跑」的待审核试读。第5章函数课还需要变量、表达式和控制流程等基础，补齐后再读。"),
      ],
    },
  ],
  resources: resourcesForProgram("first-run").filter(resource => resource.format === "Python"),
  references: [
    { title: "Python官方下载", href: "https://www.python.org/downloads/", note: "选择受支持的稳定版，安装信息可能更新。" },
    { title: "Windows：Install Manager与排错", href: "https://docs.python.org/3/using/windows.html", note: "运行命令及已有安装的差异。" },
    { title: "macOS安装与执行", href: "https://docs.python.org/3/using/mac.html", note: "官方安装包、授权与python3。" },
    { title: "Python解释器", href: "https://docs.python.org/3/tutorial/interpreter.html", note: "交互、脚本与源码编码。" },
    { title: "print内置功能", href: "https://docs.python.org/3/library/functions.html#print", note: "显示文字与默认换行。" },
    { title: "IDLE编辑器", href: "https://docs.python.org/3/library/idle.html", note: "创建与保存文件的必要操作。" },
  ],
});
