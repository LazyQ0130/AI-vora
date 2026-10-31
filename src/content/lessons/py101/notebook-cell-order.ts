import { lessonSchema, type ContentBlock } from "../../models";
import { notebookCode, notebookBlockNames, notebookCommands } from "../../resources/python-notebook";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, code: text, language });
const cell = (key: keyof typeof notebookCode) => code(notebookBlockNames[key], notebookCode[key], "python");
const commands = (key: keyof typeof notebookCommands) => [code("Windows · PowerShell · 项目根", notebookCommands[key].windows), code("macOS · zsh / bash · 项目根", notebookCommands[key].mac)];

export const pythonNotebookCellOrderLesson = lessonSchema.parse({
  id: "PY101-C01-L05", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 2,
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
      p("安装成功后，用同一环境Python执行-m notebook --version，记一次版本，再从项目根启动下方服务。"),
      {
  "type": "callout",
  "title": "安装没有成功时",
  "text": "保存命令和相关错误，请支持人员核对网络、权限、证书、版本支持和安装位置。保留认证和安全保护，不随意更换不可信镜像或修改全局配置。"
},
      ...commands("start"),
      p("这次终端会持续显示服务日志，通常不会立即回到输入提示符。它启动本地Notebook服务器，用来提供网页界面和管理会话。浏览器若没自动打开，就复制日志中实际给出的本地访问地址。检查是localhost或127.0.0.1，端口以本次日志为准，不假定总是8888。"),
      p("地址可能带token，它是本次访问凭据，只在自己的浏览器使用，不贴进作业、Git或公开截图。保留默认本地监听和认证，不使用0.0.0.0开放服务。这里运行的是你电脑上的Jupyter，Aivora网页只提供教材。"),
    ] },
    { id: "first-cells", title: "新建文档，先说明，再运行两格", navGroup: "cells", navLabel: "创建与运行", blocks: [
      p("在Notebook 7文件列表选New / New Notebook，建立Python文档。若需要选内核，先选目标项目候选，稍后用实际路径核对。"),
      p("用File → Rename命名first-notebook.ipynb，确认它位于项目根。菜单文字可随版本变化，文件和内核仍需分别核对。"),
      p("选中第一格，用工具栏的单元格类型列表把Code改为Markdown。Markdown文字格用于说明，写入下面这一句即可，不需要学习完整排版语法。按Shift+Enter运行它，文字应变成阅读状态，未被当作Python执行。"),
      code("第一格 · Markdown文字", "这份Notebook记录一次小型状态观察。先设置任务标签，再显示它。"),
      p("接着新建两个Code代码格（运行末尾一格后，Shift+Enter通常会选到或新增下一格，也可用工具栏的加号）。第二格只放下面一行，第三格只放print那一行，不把两行合成一格。"),
      cell("setDraft"), cell("showMarker"),
      p("这里只临时认识一种新写法：marker是当前运行内核暂时记住的名字，等号让它对应右边的文字。print(marker)显示这个名字此刻对应的内容，引号里的Draft A仍是已学过的字符串。完整变量、类型和赋值规则在后续章节学习。"),
      p("自己取新名字时，本课先采用一种简单写法：用英文字母开头，后面可以接英文字母、数字或下划线，名字中不放空格。例如task_name、label2都可以；for、class是Python保留词，不能拿来作这里的名字。"),
      p("赋值处与print处保持同样拼写和大小写；task_name与Task_name是不同名字。这是本次便于操作的命名约定，下划线开头和某些中文名字等其他合法写法也可使用。"),
      p("先预测显示格，再依次运行赋值格和显示格，应看到Draft A。赋值格没有普通输出，也已执行。"),
      p("执行计数与忙碌标记帮助观察状态，但短代码可能太快看不清。核对哪格真正执行过，以及本次实际结果即可。"),
      code("首次顺序运行 · 预期输出", "Draft A"),
    ] },
    { id: "kernel-check", title: "运行代码的是内核，浏览器负责显示", navGroup: "cells", navLabel: "创建与运行", blocks: [
      {
  "type": "image",
  "src": "/learning/py101/python-notebook-runtime.png",
  "width": 2187,
  "height": 1867,
  "mobile": {
    "src": "/learning/py101/python-notebook-runtime-mobile.png",
    "width": 907,
    "height": 2240
  },
  "alt": "浏览器通过Notebook服务器打开保存.ipynb、请求内核执行。内核保留运行状态；文件不保存全部内存，服务器和内核Python需分别核对。",
  "caption": "执行通路与存盘通路分开；重开网页不等于重启内核。"
},
      p("沿图中两条通路观察：浏览器经服务器请求内核执行；服务器也负责打开和保存.ipynb。执行与存盘是不同动作。现在在末尾Code格运行下方只读工具，检查实际内核。"),
      cell("kernelProbe"),
      p("将内核工具输出与目标.venv对应：Windows应是Scripts/python.exe，macOS为bin/python。标题Python 3或相同版本号不足以定位。"),
      p("不符时，在Kernel菜单Change Kernel或内核选择中选目标项，再诊断一次。服务器Python和内核Python要分别核对。"),
      p("在项目环境安装Notebook后通常已有可用内核，先完成上面的选择与诊断。"),
      {
  "type": "callout",
  "title": "内核列表缺少目标时",
  "text": "请支持人员检查安装/启动是否来自目标项目、ipykernel及内核发现方式，再按官方说明处理。无需人人注册用户级内核；本课使用浏览器Notebook，VS Code的Kernel选择是另一入口。"
},
    ] },
    { id: "stale-state", title: "文字改了，为什么仍然显示Draft A？", navGroup: "state", navLabel: "状态与顺序", blocks: [
      p("保持当前内核运行，把第二格改成下方内容，暂不执行这格。先预测：此刻只重跑第三格，会显示Draft A还是Ready B？写下判断，再选第三格运行。"),
      cell("setReady"),
      p("这次仍显示Draft A，说明保存或编辑没有替内核执行新赋值。如果你预测Ready B，就混淆了单元格文本和内核已经执行的状态。"),
      p("只运行改后的赋值格，再运行显示格，结果应变Ready B。这个最小对照不需要重装或更换内核。"),
      p("再实际运行改后的第二格，随后运行第三格，输出才变成Ready B。上方文本、下方先前的输出和内核当前状态可以一时不一致，记录真实执行过哪一格，才能解释屏幕上的结果。"),
      code("重新执行后 · 预期输出", "Ready B"),
      { type: "quiz", id: "saved-output-state", question: "改了赋值格并保存，但没执行它，显示格仍输出旧文字。最直接的解释是什么？", options: [
  "编辑或保存没有执行赋值，内核仍持有旧值",
  "保存.ipynb会自动执行赋值，因此内核应已有新值",
  "关闭并重开网页必然清空内核，所以不可能读到旧值"
], correct: 0, explanations: [
  "只执行改后的赋值格，再执行显示格；这个最小对照会更新值。",
  "保存文档和内核执行不同。观察只保存后再显示，结果仍可来自旧状态。",
  "浏览器页面和内核生命周期不同。明确重启内核才建立本题所需干净条件。"
] },
    ] },
    { id: "restart-order", title: "重启后先显示，会发生什么？", navGroup: "state", navLabel: "状态与顺序", blocks: [
      p("先保存当前文档。使用Kernel菜单中的Restart Kernel重启，并在确认框确认。此步选择仅重启，暂不选重启并全部运行。等待内核恢复空闲后，先运行第三格print(marker)，不先运行第二格。"),
      p("这次应出现NameError，错误中会提到marker尚未定义。重启清除了此前记住的名字；虽然赋值代码仍在文档中、文件也存在并已保存，它还没在这个新内核执行。内核路径在前一步已核验，本实验只改变执行顺序，无需重装Python或更换环境。"),
      p("保留刚才先运行哪格、实际错误和解释。现在运行提供marker的第二格，再运行第三格，应恢复Ready B。恢复不是让错误文字消失就结束，还要完成下一步的从头核验。"),
    ] },
    { id: "clean-run", title: "用一次干净执行检查整份文档", navGroup: "rerun", navLabel: "保存与复跑", blocks: [
      p("把文档排为说明、marker赋值、显示、观察工具，保留Ready B。先Restart Kernel确认重启，再Run All Cells；也可使用界面提供的Restart Kernel and Run All Cells。"),
      p("两种方式都先清掉旧状态，再从头执行。仅在旧内核Run All，可能继续借用之前留下的名字。"),
      p("等待所有必要代码格结束，检查：显示格为Ready B、没有错误、观察格仍指向目标.venv。执行计数说明提交顺序，会随重跑变化；屏幕上下排列和旧计数本身不证明刚从干净状态成功执行。把重启动作、实际输出和环境位置一起记下来。"),
      { type: "downloads", resourceIds: ["first-notebook-file"] },
      p("下载是最终可按顺序运行的同源核对稿，初始没有输出；第一次动手仍建议自己创建主例。下载并运行核对稿不能替代后面的独立新题。"),
    ] },
    { id: "save-stop", title: "保存文件，再关闭会话与服务", navGroup: "rerun", navLabel: "保存与复跑", blocks: [
      p("用File → Save Notebook或保存按钮存盘，再在项目清单确认first-notebook.ipynb存在。文件可以存代码、说明和当前输出，不能把内核所有内存状态打包带到另一个新内核。"),
      p("保存后关闭这份文档，从Jupyter文件列表重新打开，核对文件名与内核，再明确重启并全部运行，检查Ready B和环境路径，最后再保存。只关浏览器标签可能重新连接尚未结束的内核，不把重开页面当作干净执行证明。"),
      p("结束时先保存文档，再用File → Close and Shut Down Notebook或Kernel → Shut Down Kernel关闭这份内核，在Running列表确认不再运行。"),
      p("回到启动服务的终端按Ctrl+C，按实际关闭确认作答，等服务退出、Shell提示符回来。"),
      p("若宿主中断流程不清楚，可用Notebook 7的File → Shut Down并确认；看到Server stopped后，再回启动终端核对退出。只关网页不会保证停服，也不要结束其他项目的Python进程。"),
      p("若Notebook入口命令找不到，先核对同一环境内是否安装成功。可请支持人员按官方说明检查实际Scripts/jupyter-notebook.exe（macOS为bin/jupyter-notebook）入口，保留错误；不以关闭认证或改全局PATH处理。"),
    ] },
    { id: "practice", title: "交付自己的文档与一次恢复记录", navGroup: "practice", navLabel: "独立练习", blocks: [
      { type: "exercise", id: "create-own-notebook", title: "建立自己的Notebook并重启复跑", kind: "实验",
        prompt: "在目标环境自己新建并命名.ipynb，写一格自己的Markdown说明；另选名字和文字，把赋值、print分成代码格。口头预测后按序运行，用现成工具核对内核并保存。重新打开，确认目标内核、明确重启，再从头全跑并保存。交.ipynb和一条会话卡记录：启动命令/版本、内核身份、重启/全跑的顺序及成功结论。代码与输出直接由文档承载，不重复誊写，不含token。",
        hints: ["先区分文档、服务与内核。需要哪种单元格保存说明，哪个格提供后续显示所需的名字？", "核对项目位置和实际Python路径，再检查各格类型与依赖。保存并重新打开之后，怎样清除之前记住的内容，验证文档本身足够？最后自己执行和比较。"],
        solution: [
  "例如自己建立own-plan.ipynb，写一格说明，再用plan_text = \"Sketch D8\"与print(plan_text)两格，先预测Sketch D8。这是一个示例，自己的名称与文字应另选，源码位于环境目录外。",
  "以项目环境启动Notebook，运行现成sys.executable观察格，完整位置应属于自己的.venv；实际运行赋值与显示格，保存真实输出和.ipynb。",
  "保存、重新打开后仍确认内核，明确重启并按文档顺序全部执行。检查没有错误、显示自己的预期文字，再次保存；证据说明何时重启，不能仅说关过页面。",
  "常错是把说明留作Code、只改文本不执行、照抄参考稿、只交已有输出。接受自选名字、普通文字Markdown、等价干净新会话或先重启再全部运行；条件是文件和实际执行证据相互对应。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "本人新.ipynb含自写说明、自选名字/文字，赋值和显示格分开。",
  "文档保留真实执行结果；会话卡核对内核，口头预测不另交整份输出抄本。",
  "重新打开并核对目标内核，明确重启后按序全跑成功再保存，旧输出不足替代。"
],
      },
      p("下一题换成出库标签，保持相同的已核验项目内核。可下载起始文档，也可自己用下方两格建立dispatch-note.ipynb。文件与代码均已保存，只有最小赋值与print，不存在缺包或解释器错配。"),
      cell("setDelivery"), cell("showDelivery"),
      { type: "downloads", resourceIds: ["dispatch-notebook-file"] },
      { type: "exercise", id: "recover-cell-order", title: "出库标签为什么在重启后失败？", kind: "实验",
        prompt: "在dispatch-note.ipynb的正确干净内核，先预测并实际运行后面的显示格，保留NameError和顺序，独立恢复。再仅修改赋值格为自选文字而不执行，预测并运行显示格，留旧值现象及一句原因。使最终源码和结果一致后，重新打开、核对内核、明确重启，从头全跑保存。交.ipynb及三行对照：乱序失败、未执行改文仍旧值、干净全跑成功；相关回溯可由文档保留，不再抄一份。",
        hints: ["看当前内核从重启以来真正执行过哪些格。出错的名字依赖哪一次执行？", "找到提供该名字的格，与使用它的格比较位置和执行记录。决定文档怎样组织，再用清除状态后的完整执行检验，不能只靠此前已记住的内容。"],
        solution: [
  "先在重启后的内核运行print(delivery_note)，实际应出现NameError，提到该名字未定义；保留执行顺序与错误。源码已保存并不代表它已在新内核运行。",
  "赋值格提供delivery_note对应的Packed C7。让文档中提供名字的格位于使用格之前，实际执行后显示应为Packed C7；不修改字符串去掩盖问题，也无需换环境。",
  "短观察例如把赋值文字改为Packed New E6而暂不执行，预测后只跑显示格，仍应得到Packed C7。内核还记住上一次实际赋值；再执行修改格和显示格才变为新标记。学生须用自己的标记和真实记录，不能抄这组输出。",
  "保存并重新打开，确认目标内核，再明确重启、从上到下全部执行；检查所有必要格无错、显示最终自选标记、观察工具仍为目标环境，再保存文件和真实输出。这证明不依赖旧会话残留的名字。",
  "若原排列已正确，可以保留它，只修正执行操作；若曾移动格，则整理依赖后重验。常错是单独补跑却不做干净全跑、把旧输出当新执行、删报错截图代替修复。合理新会话也接受，但要有清除旧状态及完整执行的证据。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "干净内核真实复现显示先行的NameError，文档/短表说明顺序。",
  "未执行新赋值的观察有事前预测和真实旧值，能解释文本与状态之别。",
  "重新打开核对内核，重启全跑后显示自选标记并保存；文件承载代码输出，无重复截图/抄本要求。"
],
      },
    ] },
    { id: "next-step", title: "把能重跑的文件交给下一次自己", navGroup: "finish", navLabel: "下一步", blocks: [
      p("保留自己的.ipynb和一次实际内核身份记录。下次从干净内核按文档顺序跑完，才知道文件里的代码足够；旧输出只供回看。"),
      p("1.6要把脚本、环境和Notebook问题写成别人能照做的复现单。先完成本节的内核核对、重启与全跑，再学习交接。第5章仍需变量、表达式和控制流程基础；这里的两格赋值只用来观察状态。"),
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
