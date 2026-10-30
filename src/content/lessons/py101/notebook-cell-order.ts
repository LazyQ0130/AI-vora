import { lessonSchema, type ContentBlock } from "../../models";
import { notebookCode, notebookBlockNames, notebookCommands } from "../../resources/python-notebook";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, code: text, language });
const cell = (key: keyof typeof notebookCode) => code(notebookBlockNames[key], notebookCode[key], "python");
const commands = (key: keyof typeof notebookCommands) => [code("Windows · PowerShell · 项目根", notebookCommands[key].windows), code("macOS · zsh / bash · 项目根", notebookCommands[key].mac)];

export const pythonNotebookCellOrderLesson = lessonSchema.parse({
  id: "PY101-C01-L05", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 1,
  title: "在Jupyter中按顺序运行单元格",
  subtitle: "代码已经改了，为什么还是旧输出？在自己的Notebook里观察内核状态，再从头重跑。",
  prerequisites: "已完成1.1–1.4：保存和运行.py，确认项目目录、.venv及实际解释器，能修复环境错配。本课沿用已有基础Python与项目环境；安装Notebook需要网络和获准的本地软件安装条件。手机可读，实际操作需要电脑。",
  prerequisiteLinks: [
    { title: "1.1 保存并执行源码", href: "/learn/PY101/PY101-C01-L01#run-script", note: "补齐本地运行与真实输出。" },
    { title: "1.2 确认当前目录", href: "/learn/PY101/PY101-C01-L02#relative-route", note: "补齐相对路径。" },
    { title: "1.3 保存与重跑", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "区分编辑、保存与执行。" },
    { title: "1.4 用实际解释器核验环境", href: "/learn/PY101/PY101-C01-L04#observe-env", note: "准备项目.venv，补齐路径观察。" },
  ],
  objectives: ["在项目环境启动本地Jupyter，确认内核并创建、运行和保存含文字与代码的Notebook", "预测并观察旧状态与乱序错误，解释原因，用重启和按序执行恢复", "重新打开保存的Notebook，在正确的干净内核中从头完整运行并保留实际证据"],
  assessmentMap: [{ objective: 1, exerciseIds: ["create-own-notebook"] }, { objective: 2, exerciseIds: ["recover-cell-order"] }, { objective: 3, exerciseIds: ["create-own-notebook", "recover-cell-order"] }],
  learningTime: { reading: [12, 18], practice: [6, 10], coding: [20, 30], basis: "editorial-estimate" },
  sections: [
    { id: "why-notebook", title: "把说明和几段代码放在同一份文档里", navGroup: "start", navLabel: "本地Notebook", blocks: [
      p("你已经会把几行Python保存成.py并运行。现在想在同一份记录里先写一段说明，再逐段运行代码、保留各段结果。Jupyter Notebook提供这种文档，文件以.ipynb结尾。文档中的一小块文字或代码叫单元格，可以分别编辑和运行。"),
      p("方便逐格运行，也带来一个疑问：上方代码已经改成新文字，下方却仍显示旧结果；重启后，同一格甚至报错。本节用两格短代码亲自观察，再把自己的文档整理成从头能跑的版本。"),
    ] },
    { id: "local-start", title: "从项目环境启动本地Notebook", navGroup: "setup", navLabel: "安装与启动", blocks: [
      p("在自己的练习位置准备notebook-lab；可沿用1.4已核对的项目环境，或按1.4在这个新目录创建.venv。cd到项目根，用pwd和文件清单确认位置及环境解释器。Notebook文件放在项目根，与.venv并列，不进入环境目录。"),
      code("本课项目布局", "notebook-lab/\n├── .venv/\n└── first-notebook.ipynb  ← 稍后新建"),
      p("先用环境中明确的Python核对pip位置。pip是这里用来安装Notebook程序的工具；只需认识这一次用途，完整依赖管理留后续。下列结果中的安装位置应属于本项目.venv，Python版本应与已核对的环境一致。"),
      ...commands("pip"),
      p("首次安装需要网络下载Notebook及其必要依赖，正常等待与下载故障都另计时间。使用同一环境解释器执行下一条，等安装成功、终端返回提示符再继续。已有可用Notebook时先核对环境中的版本，不重复安装其他Python或整套工具。"),
      ...commands("install"),
      p("若遇网络、权限、证书或版本兼容错误，保存命令和完整提示，向教学支持核对获准网络、Python支持范围及安装位置；不关闭安全保护、不改全局配置或随意换不可信镜像。安装成功后，用上面同一环境的Python路径，把-m pip --version部分换为-m notebook --version执行，记下实际Notebook版本，再从项目根执行下方启动命令："),
      ...commands("start"),
      p("这次终端会持续显示服务日志，通常不会立即回到输入提示符。它启动本地Notebook服务器，用来提供网页界面和管理会话。浏览器若没自动打开，就复制日志中实际给出的本地访问地址。检查是localhost或127.0.0.1，端口以本次日志为准，不假定总是8888。"),
      p("地址可能带token，它是本次访问凭据，只在自己的浏览器使用，不贴进作业、Git或公开截图。保留默认本地监听和认证，不使用0.0.0.0开放服务。这里运行的是你电脑上的Jupyter，Aivora网页只提供教材。"),
    ] },
    { id: "first-cells", title: "新建文档，先说明，再运行两格", navGroup: "cells", navLabel: "创建与运行", blocks: [
      p("本课以Notebook 7的浏览器界面为例。在文件列表使用New / New Notebook创建Python Notebook；若出现内核选择，先选本项目可用的Python内核，稍后用实际路径核验。用File → Rename将Untitled命名为first-notebook.ipynb，并确认保存位置为项目根；界面文字可能随版本变化。"),
      p("选中第一格，用工具栏的单元格类型列表把Code改为Markdown。Markdown文字格用于说明，写入下面这一句即可，不需要学习完整排版语法。按Shift+Enter运行它，文字应变成阅读状态，未被当作Python执行。"),
      code("第一格 · Markdown文字", "这份Notebook记录一次小型状态观察。先设置任务标签，再显示它。"),
      p("接着新建两个Code代码格（运行末尾一格后，Shift+Enter通常会选到或新增下一格，也可用工具栏的加号）。第二格只放下面一行，第三格只放print那一行，不把两行合成一格。"),
      cell("setDraft"), cell("showMarker"),
      p("这里只临时认识一种新写法：marker是当前运行内核暂时记住的名字，等号让它对应右边的文字。print(marker)显示这个名字此刻对应的内容，引号里的Draft A仍是已学过的字符串。完整变量、类型和赋值规则在后续章节学习。"),
      p("自己取新名字时，本课先采用一种简单写法：用英文字母开头，后面可以接英文字母、数字或下划线，名字中不放空格。例如task_name、label2都可以；for、class是Python保留词，不能拿来作这里的名字。"),
      p("赋值处和print处的名字要拼写一致，大小写也要相同；Python把task_name和Task_name看作两个不同的名字。这些是本课便于操作的命名建议，不是全部合法名称规则：Python也允许下划线开头的名字，以及用某些中文等文字组成的名字，其他合法写法同样可以使用。"),
      p("先预测第三格输出，再选第二格按Shift+Enter，接着运行第三格。第三格下方应出现Draft A。第二格没有普通输出，仍已执行。执行时编号可暂显示[*]，结束后变为数字；短代码变化很快，未必看得见忙碌标记。运行编号和状态帮助观察提交与结束，最后仍核对真实结果。"),
      code("首次顺序运行 · 预期输出", "Draft A"),
    ] },
    { id: "kernel-check", title: "运行代码的是内核，浏览器负责显示", navGroup: "cells", navLabel: "创建与运行", blocks: [
      { type: "table", caption: "把三种对象分开", columns: ["对象", "负责什么", "保存或关闭后会怎样"], rows: [
        [".ipynb文件", "保存代码、文字、元数据以及可保存的输出", "文件留在磁盘；不等于保存了运行中所有名字"],
        ["Notebook服务器", "提供本地网页界面、文件和会话管理", "关浏览器不保证服务停止"],
        ["Python内核", "实际执行代码，保留运行期间名字对应的内容", "重启会清除这次运行状态"],
      ] },
      p("浏览器把代码交给内核执行，再显示返回结果。启动服务器的Python与代码内核不能未经核验就当成同一份。在文档末尾再建一个Code格，原样运行下面的只读观察工具，不要求自己写import/sys。"),
      cell("kernelProbe"),
      p("把输出的完整解释器位置与目标项目.venv对应：Windows应属于其Scripts/python.exe，macOS属于bin/python。内核标题只写Python 3或版本相同不足为证。若不符，查看Kernel菜单的Change Kernel或右上角内核选择，选目标环境对应项，再重新诊断。"),
      p("主流程在项目环境安装Notebook后，通常已有Python内核可用，无需人人额外执行用户级内核注册。列表缺少目标时，先确认安装/启动来自同一项目、该环境有ipykernel；按官方帮助请支持人员检查发现方式，再做有条件的修复，不猜选另一个Python。VS Code的Notebook Kernel选择也不同于普通.py解释器选择，本课继续用浏览器Notebook完成操作。"),
    ] },
    { id: "stale-state", title: "文字改了，为什么仍然显示Draft A？", navGroup: "state", navLabel: "状态与顺序", blocks: [
      p("保持当前内核运行，把第二格改成下方内容，暂不执行这格。先预测：此刻只重跑第三格，会显示Draft A还是Ready B？写下判断，再选第三格运行。"),
      cell("setReady"),
      p("这一次仍应显示Draft A。编辑只改变单元格文本；内核上次真正执行的还是Draft A那次赋值，名字对应的内容没有自动更新。按保存也只是写文件，并不执行新代码。"),
      p("再实际运行改后的第二格，随后运行第三格，输出才变成Ready B。上方文本、下方先前的输出和内核当前状态可以一时不一致，记录真实执行过哪一格，才能解释屏幕上的结果。"),
      code("重新执行后 · 预期输出", "Ready B"),
      { type: "quiz", id: "saved-output-state", question: "改了赋值格并保存，但没执行它，显示格仍输出旧文字。最直接的解释是什么？", options: ["内核还保留此前实际执行的状态，保存没有执行新赋值", "文件保存失败，Python一定损坏了"], correct: 0, explanations: ["比较文本、磁盘和运行状态；重新执行提供名字的格，再执行显示格观察变化。", "当前现象本身不能证明文件或解释器损坏，应先核对真实执行顺序。"] },
    ] },
    { id: "restart-order", title: "重启后先显示，会发生什么？", navGroup: "state", navLabel: "状态与顺序", blocks: [
      p("先保存当前文档。使用Kernel菜单中的Restart Kernel重启，并在确认框确认。此步选择仅重启，暂不选重启并全部运行。等待内核恢复空闲后，先运行第三格print(marker)，不先运行第二格。"),
      p("这次应出现NameError，错误中会提到marker尚未定义。重启清除了此前记住的名字；虽然赋值代码仍在文档中、文件也存在并已保存，它还没在这个新内核执行。内核路径在前一步已核验，本实验只改变执行顺序，无需重装Python或更换环境。"),
      p("保留刚才先运行哪格、实际错误和解释。现在运行提供marker的第二格，再运行第三格，应恢复Ready B。恢复不是让错误文字消失就结束，还要完成下一步的从头核验。"),
    ] },
    { id: "clean-run", title: "用一次干净执行检查整份文档", navGroup: "rerun", navLabel: "保存与复跑", blocks: [
      p("把文档排成说明、marker赋值、print(marker)、观察工具的顺序，赋值文本保留Ready B。使用当前界面的Restart Kernel and Run All Cells；也可先Restart Kernel确认重启，再用Run菜单的Run All Cells。两种方式都要先清除状态，再按文档从上到下运行。仅在旧内核点Run All可能掩盖缺少定义的问题。"),
      p("等待所有必要代码格结束，检查：显示格为Ready B、没有错误、观察格仍指向目标.venv。执行计数说明提交顺序，会随重跑变化；屏幕上下排列和旧计数本身不证明刚从干净状态成功执行。把重启动作、实际输出和环境位置一起记下来。"),
      { type: "downloads", resourceIds: ["first-notebook-file"] },
      p("下载是最终可按顺序运行的同源核对稿，初始没有输出；第一次动手仍建议自己创建主例。下载并运行核对稿不能替代后面的独立新题。"),
    ] },
    { id: "save-stop", title: "保存文件，再关闭会话与服务", navGroup: "rerun", navLabel: "保存与复跑", blocks: [
      p("使用File → Save Notebook或工具栏保存，Windows通常Ctrl+S、macOS为Command+S；确认保存标记，并在本地文件管理器或项目清单确认first-notebook.ipynb确实存在。它可能保存刚才输出，但不会让运行时名字自动进入另一个新内核。"),
      p("保存后关闭这份文档，从Jupyter文件列表重新打开，核对文件名与内核，再明确重启并全部运行，检查Ready B和环境路径，最后再保存。只关浏览器标签可能重新连接尚未结束的内核，不把重开页面当作干净执行证明。"),
      p("结束时先保存；用File → Close and Shut Down Notebook关闭当前文档会话，或用Kernel → Shut Down Kernel关闭内核，在Running列表确认它不再运行。回到启动服务的那个终端按Ctrl+C；若出现关闭确认，按实际提示确认，等待服务退出并返回命令提示符。若终端宿主的中断流程不清楚，Notebook 7还可用File → Shut Down并确认，看到Server stopped后回启动终端核对已退出。只关闭网页不代表本地服务器已停止，也不要终止其他项目的Python进程。"),
      p("若启动候选命令无法找到Notebook入口，先确认同一环境内安装成功；可按官方说明使用该环境实际存在的Scripts/jupyter-notebook.exe（macOS为bin/jupyter-notebook）启动。命令和版本问题保留完整提示交支持人员，不用关闭认证或更改全局PATH解决。"),
    ] },
    { id: "practice", title: "交付自己的文档与一次恢复记录", navGroup: "practice", navLabel: "独立练习", blocks: [
      { type: "exercise", id: "create-own-notebook", title: "建立自己的Notebook并重启复跑", kind: "实验",
        prompt: "在目标项目环境中自己新建Notebook，自选.ipynb文件名，不直接交下载稿。写至少一格Markdown说明；自选与正文不同的名字和短文字，将最小赋值、print显示分成代码格，再用现成观察格核对内核。先预测输出，按文档顺序实际运行并保存。重新打开后确认目标内核，明确重启，从头完整运行，再保存。交付真实.ipynb及简短证据：位置、启动命令/版本、实际内核路径、预测/输出、重启动作和全部运行结果；不含访问token。只有文字报告或旧输出截图不足以完成。",
        hints: ["先区分文档、服务与内核。需要哪种单元格保存说明，哪个格提供后续显示所需的名字？", "核对项目位置和实际Python路径，再检查各格类型与依赖。保存并重新打开之后，怎样清除之前记住的内容，验证文档本身足够？最后自己执行和比较。"],
        solution: ["例如自己建立own-plan.ipynb，写一格说明，再用plan_text = \"Sketch D8\"与print(plan_text)两格，先预测Sketch D8。这是一个示例，自己的名称与文字应另选，源码位于环境目录外。", "以项目环境启动Notebook，运行现成sys.executable观察格，完整位置应属于自己的.venv；实际运行赋值与显示格，保存真实输出和.ipynb。", "保存、重新打开后仍确认内核，明确重启并按文档顺序全部执行。检查没有错误、显示自己的预期文字，再次保存；证据说明何时重启，不能仅说关过页面。", "常错是把说明留作Code、只改文本不执行、照抄参考稿、只交已有输出。接受自选名字、普通文字Markdown、等价干净新会话或先重启再全部运行；条件是文件和实际执行证据相互对应。"],
        rubric: ["新文件命名/位置正确，含自写说明与自选名字/文字的最小代码，实际目标内核有路径证据。", "有运行前预测、真实输出与保存的.ipynb，说明代码如何依次提供和使用名字。", "重新打开并核对内核，从明确干净状态完整执行成功再保存；不以下载点击、旧输出或读完标记代替。"],
      },
      p("下一题换成出库标签，保持相同的已核验项目内核。可下载起始文档，也可自己用下方两格建立dispatch-note.ipynb。文件与代码均已保存，只有最小赋值与print，不存在缺包或解释器错配。"),
      cell("setDelivery"), cell("showDelivery"),
      { type: "downloads", resourceIds: ["dispatch-notebook-file"] },
      { type: "exercise", id: "recover-cell-order", title: "出库标签为什么在重启后失败？", kind: "实验",
        prompt: "在dispatch-note.ipynb中，用正确环境的干净内核，先预测并实际运行后面的显示单元格，保存真实错误与执行顺序。保持现有两段源码语法和内核选择不变，独立判断原因，决定需要怎样调整运行或排列。恢复后做一次短观察：只把提供名字格中的文字改成自选新标记，暂不执行它；预测并重跑显示格，记录和解释结果。再让最终文本与执行结果一致，重新打开后确认目标内核、明确重启，按文档顺序完整运行所有核心代码并保存.ipynb。交付错误/短观察的预测与现象、原因、修复、干净重跑和保存证据，解释为何不依赖旧状态。题目不混入未保存、缺包和环境错误。",
        hints: ["看当前内核从重启以来真正执行过哪些格。出错的名字依赖哪一次执行？", "找到提供该名字的格，与使用它的格比较位置和执行记录。决定文档怎样组织，再用清除状态后的完整执行检验，不能只靠此前已记住的内容。"],
        solution: ["先在重启后的内核运行print(delivery_note)，实际应出现NameError，提到该名字未定义；保留执行顺序与错误。源码已保存并不代表它已在新内核运行。", "赋值格提供delivery_note对应的Packed C7。让文档中提供名字的格位于使用格之前，实际执行后显示应为Packed C7；不修改字符串去掩盖问题，也无需换环境。", "短观察例如把赋值文字改为Packed New E6而暂不执行，预测后只跑显示格，仍应得到Packed C7。内核还记住上一次实际赋值；再执行修改格和显示格才变为新标记。学生须用自己的标记和真实记录，不能抄这组输出。", "保存并重新打开，确认目标内核，再明确重启、从上到下全部执行；检查所有必要格无错、显示最终自选标记、观察工具仍为目标环境，再保存文件和真实输出。这证明不依赖旧会话残留的名字。", "若原排列已正确，可以保留它，只修正执行操作；若曾移动格，则整理依赖后重验。常错是单独补跑却不做干净全跑、把旧输出当新执行、删报错截图代替修复。合理新会话也接受，但要有清除旧状态及完整执行的证据。"],
        rubric: ["从干净内核真正复现显示格先运行的NameError，保留顺序与现象，不捏造其他故障。", "解释名字尚未在当前内核定义，给出合理修复；短观察有预测、真实旧值及文本尚未执行的解释。", "重新打开后确认目标内核，再从明确干净状态按文档顺序全跑成功，保存.ipynb及最终自选标记的实际结果，说明为何不依赖旧状态；报告不能替代文件与执行。"],
      },
    ] },
    { id: "next-step", title: "把能重跑的文件交给下一次自己", navGroup: "finish", navLabel: "下一步", blocks: [
      p("留好自己的.ipynb与短记录：哪个环境启动，实际内核在哪，先执行了哪些格，重启后能否按文档顺序重现结果。屏幕上的旧输出可以帮助回看，干净重跑才检验当前代码是否完整。"),
      p("下一节1.6「让别人复现一次环境问题」现已提供待审核试读。它会组合脚本、路径、编辑器、虚拟环境与Notebook的已有操作，本节无需提前学习依赖锁定或远程服务。阅读器按可读课时导航，函数试读仍需变量、表达式和控制流程等基础，不能把本次最小赋值实验当成已学完整变量章节。"),
    ] },
  ],
  resources: [
    { id: "first-notebook-file", title: "first-notebook.ipynb", href: "/downloads/first-notebook.ipynb", format: "Notebook", description: "最终核对稿：同源Ready B版本，空输出；用于对照，不替代独立新建练习。" },
    { id: "dispatch-notebook-file", title: "dispatch-note.ipynb", href: "/downloads/dispatch-note.ipynb", format: "Notebook", description: "出库标签起始稿：同源两格任务；故意乱序需自己操作，默认文档可按序运行。" },
  ],
  references: [
    { title: "Jupyter安装", href: "https://jupyter.org/install", note: "Notebook安装与启动。" },
    { title: "Notebook用户文档", href: "https://jupyter-notebook.readthedocs.io/en/stable/", note: "界面和单元格，留意版本。" },
    { title: "运行与内核状态", href: "https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Running%20Code.html", note: "逐格运行、重启与顺序。" },
    { title: "Jupyter Server安全", href: "https://jupyter-server.readthedocs.io/en/stable/operators/security.html", note: "本地访问与认证保护。" },
    { title: "IPython内核", href: "https://ipython.readthedocs.io/en/stable/install/kernel_install.html", note: "不同环境内核的条件性安装说明。" },
  ],
});
