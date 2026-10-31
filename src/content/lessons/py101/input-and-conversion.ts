import { lessonSchema, type ContentBlock } from "../../models";
import { inputCode, inputBlockNames, type InputKey } from "../../resources/python-input-conversion";
const p=(text:string):ContentBlock=>({type:"paragraph",text});
const output=(filename:string,code:string):ContentBlock=>({type:"code",language:"text",filename,code});
const sample=(key:InputKey):ContentBlock=>({type:"code",language:"python",filename:inputBlockNames[key],code:inputCode[key]});

// 简报、预解、官方核验与真实交互证据见docs/py101-p12。实际Python在学生本机运行。
export const pythonInputAndConversionLesson=lessonSchema.parse({
  id:"PY101-C02-L05",courseId:"PY101",chapterId:"PY101-C02",title:"取得用户输入，再转成需要的数值",contentVersion:2,optionalLesson:false,
  subtitle:"键入4，收到的为什么先是文字？先接住输入，再转换和计算，用另一组数据重新核对。",
  prerequisites:"已完成第一章及2.1–2.4：能创建、保存并从终端完整运行.py，会赋值、print和type，认识str/int/float以及乘法、单位和比较。沿用已有Python 3和编辑器，不安装库；手机可阅读，实际交互操作需要电脑。",
  prerequisiteLinks:[
    {title:"1.3 保存并重跑",href:"/learn/PY101/PY101-C01-L03#save-rerun",note:"核对目录、解释器与实际保存文件。"},
    {title:"2.1 名称与值",href:"/learn/PY101/PY101-C02-L01#name-and-value",note:"复习=保存右侧取得的值。"},
    {title:"2.2 观察类型",href:"/learn/PY101/PY101-C02-L02#inspect-type",note:"回看数字文本与数值、type观察。"},
    {title:"2.3 数量关系",href:"/learn/PY101/PY101-C02-L03#expression-to-value",note:"核对乘法对应的数量与单位。"},
    {title:"2.4 比较结果",href:"/learn/PY101/PY101-C02-L04#main-example",note:"按顺序已学，本次增加运行时输入。"},
  ],
  objectives:[
    "在自己创建的.py中用input取得终端输入，解释提示、等待、键入、Enter与print显示的区别并保留真实记录",
    "用type观察原始str与转换后的int或float，明确先接收再转换，用转换后的数值完成有单位的计算",
    "为自己的程序预测并真实运行两组新合法输入，在受控副本识别格式错误，再重新启动用合法值验证恢复",
  ],
  assessmentMap:[{objective:1,exerciseIds:["interactive-label-and-count"]},{objective:2,exerciseIds:["interactive-label-and-count","measure-and-recheck"]},{objective:3,exerciseIds:["measure-and-recheck"]}],
  learningTime:{reading:[12,18],practice:[8,12],coding:[18,28],basis:"editorial-estimate"},
  sections:[
    {id:"first-input",title:"提示出现后，程序在等你键入",navGroup:"input",navLabel:"取得输入",blocks:[
      p("给物品准备标签，每件需要3个。以前把count = 4写在源码，再用print(count * 3)得到12。换一批件数就要改文件。现在希望运行程序的人输入物品名和件数，让同一份脚本处理不同数量。先只收一段名称，看看程序怎样等你。"),
      p('input是Python自带的输入功能。input("Label: ")先显示字符串Label: 作为提示，再等待一行键盘输入。提示中的冒号和末尾空格方便使用者接着键入；英文引号界定源码里的文字，引号本身不显示。input不会给提示自动加换行。'),
      p("看到提示后在终端键入Box A，按Enter提交。input取得这一行文字，不含提交时的末尾换行；=让label保存返回的字符串。随后print(label)才读取并显示它。先有等待和输入，才有后面的print。"),
      sample("label"),
      p("在自己的练习目录新建receive_label.py，源码放在.venv外，行首不缩进，保存上面两行。先预测何时看到Label: ，何时看到print显示的Box A。Box A是本次数据，不加在.py末尾。"),
      p("保存文件后，在其所在目录执行下方对应命令。沿用已核验的python/py或python3；启动命令在Shell中输入，接下来的数据才在程序提示后键入。"),
      output("Windows · PowerShell · 文件所在目录","python receive_label.py"),output("macOS · 终端 · 文件所在目录","python3 receive_label.py"),
      p("看到Label:且Shell还没回来时，程序在等你。键入Box A、按Enter，观察下一行Box A，再确认Shell提示符回来。"),
      p("后面的程序同样在本机终端运行，网页只提供教材和临时笔记。记录里把命令、提示、键入回显和print分开，避免把回显当成第二条print。"),
      output("带标注的交互示意 · 不是原始stdout","[程序提示，无换行] Label: \n[你在同一行键入] Box A\n[你按键] Enter\n[随后print，独立一行] Box A\n[shell重新出现] 本机命令提示符"),
      {type:"table",caption:"屏幕内容要分清来源",columns:["看到的内容","来源","是否为print结果"],rows:[["Label: （含末尾空格）","input提示，属于程序标准输出stdout","否"],["提示后键入的Box A","终端通常显示键盘回显","否"],["下一行Box A","print(label)","是"],["命令前后的shell提示符","PowerShell等shell","否"]]},
      p("自动验证也能把数据送入标准输入stdin。管道不会自动产生键盘回显，本例捕获的stdout可能直接是Label: Box A再换行，其中Box A来自print。不能把真人屏幕上的两次Box A都称作print，也不能为自动日志补造一行键入回显。"),
    ]},
    {id:"raw-count",title:"键入数字4，先看看取得的类型",navGroup:"conversion",navLabel:"先收再转",blocks:[
      p("能收名称后，再观察数字输入。新建inspect_input.py，先预测输入4后的值与类型，保存三行并启动；Count:出现后键入4，再按Enter。"),
      sample("rawCount"),output("输入4后 · 仅两条print结果","4\n<class 'str'>"),
      p("键入的是数字字符，input取得的仍是str。若预测type会是int，就是从字符外观猜了类型。"),
      p("在同一inspect_input.py中换输入7重跑：普通显示变化，type仍为str。count_text的名字只说明用途，不替值决定类型。"),
      p("若要让完整件数参与数值乘法，需要明确转换。先确认原始值的类型，再处理数量；文字看起来像数字，并不使它自动成为数值。"),
    ]},
    {id:"int-conversion",title:"另做一步整数转换，保留原始文字",navGroup:"conversion",navLabel:"先收再转",blocks:[
      p("int是Python自带的整数转换工具，把符合要求的整数文本交给它，可以建立一个整数值。本轮先用4、7、12这样的普通十进制整数文本。新建convert_count.py，先预测输入4后的值与类型，再保存运行："),
      sample("convertInt"),output("输入4后 · 仅两条print结果","4\n<class 'int'>"),
      p("第1行先接收count_text；第2行int(count_text)读取文本并尝试建立整数，=让count接住结果；后两行显示整数和类型。转换后才有可作为件数计算的整数4。原count_text仍是str，int没有把它就地改成整数。"),
      p("为了同时观察两份值，另存observe_conversion.py，先预测四行，再输入4运行下面的完整观察版。前两条print在转换前，后两条在转换后。"),
      sample("inspectInt"),output("输入4后 · 四条print按执行顺序","4\n<class 'str'>\n4\n<class 'int'>"),
      p("普通显示相同，类型却不同。分步写能看清哪份是输入文字、哪份是新整数；后续计算应读取count。把实际结果和预测核对，保留这个区别再进入主例。"),
    ]},
    {id:"main-example",title:"同一份脚本，接收两批不同物品",navGroup:"calculation",navLabel:"转换后计算",blocks:[
      p("每件需要3个标签，3的单位为个/件。label是物品名称，count_text是件数文本，count是整数；用count * 3计算总标签数。"),
      p("保存item_labels.py前，先为Box A/4预测两条print；启动后按两次提示分别输入。"),
      sample("main"),output("Windows · PowerShell · 文件所在目录","python item_labels.py"),output("macOS · 终端 · 文件所在目录","python3 item_labels.py"),
      p("启动后，Label: 出现才输入Box A、Enter；Count: 出现才输入4、Enter。两项数据分别提交，不合成一行。4件乘每件3个，实际核对下面两条print；提示和键盘回显不在这两行里。"),
      output("第一组Box A / 4 · 仅print结果，12为标签个数","Box A\n12"),
      p("源码完全不改，先预测Tool B/2，再用同一命令重新启动并分别输入。2件乘3是6个标签，保留第二组真实记录。同一保存文件因运行时输入不同产生不同结果，不必打开源码改件数，这是相对2.3新增的能力。"),
      output("第二组Tool B / 2 · 仅print结果，6为标签个数","Tool B\n6"),
      p("若自动stdin依次提供Box A和4两行，提示没有换行，实际捕获如下。末尾有换行；这是自动捕获形式，不是真人终端的完整画面，Box A来自print。"),
      output("自动stdin捕获stdout · 无键盘回显","Label: Count: Box A\n12\n"),
    ]},
    {id:"float-conversion",title:"测量有小数，转换成float再计算",navGroup:"calculation",navLabel:"转换后计算",blocks:[
      p("单件物品的质量可能为1.5千克，要算两件总质量。这次允许小数，用Python自带的float将符合要求的数字文本转换为浮点数。mass_text保存输入，mass保存float结果，乘2后仍以千克为单位。"),
      p("新建two_masses.py，先预测1.5这组，再保存完整三行运行。Mass kg: 后只键入1.5、Enter，不附加kg；本轮用小数点而非小数逗号。两件的2固定在源码中，不需要再键入。"),
      sample("mass"),output("输入1.5 · 仅print结果，单位千克","3.0"),
      p("1.5乘2是3.0千克。保留后先预测2.25，不改源码重新运行并输入，实际核对4.5千克。两组都留预测和真实结果，不能把质量写死在源码假装输入。"),
      output("输入2.25 · 仅print结果，单位千克","4.5"),
      p("另建observe_mass.py观察类型，保存下面的完整版本。先预测输入1.5后的四行，再运行；它只观察原值/原类型/新值/新类型，不计算总量。"),
      sample("inspectFloat"),output("输入1.5 · 四条print结果","1.5\n<class 'str'>\n1.5\n<class 'float'>"),
      p("float适合本例测量，但有表示精度限制，不保证任意十进制小数都精确保存。3.0的.0是本次浮点显示，无需为了删掉它再转int；本课先核对计算关系和单位，输出格式留后续。"),
    ]},
    {id:"format-error",title:"输入格式不合要求，留错误再重启",navGroup:"errors",navLabel:"格式与恢复",blocks:[
      p("另建count_format_copy.py受控副本，保留已成功的主例。int不能把任意文本变为件数。先预测four是否符合要求，再保存下面三行，启动后在Count: 提示输入four、Enter。"),
      sample("integerError"),output("输入four · 错误末行示意，完整回溯自己保留","ValueError: invalid literal for int() with base 10: 'four'"),
      p("第2行int(count_text)无法将four解释为整数，因此出现ValueError，后面的print没有执行。保留实际输入、转换行和相关完整回溯。错误来自文本格式，不是环境损坏。"),
      p("异常后程序已经结束，shell重新出现。直接键入7不会交给已结束的程序；要重新执行python count_format_copy.py（macOS用python3），等Count: 后输入7、Enter，核对print显示7并正常结束。这是新启动的一轮恢复。"),
      p("再启动该副本输入4.5，留真实失败。这个小数文本同样不能按本例int的整数文本要求转换，也会ValueError，并不会自动得到4。不用int(float(...))绕过完整件数要求，那会引入另一种转换并改变题意；也不必重装、安装包或改PATH。"),
      p("float也有要求。新建mass_format_copy.py，先预测bad，再保存运行下方副本，输入bad并保留真实ValueError与退出记录。重新启动后输入1.75，核对两件3.5千克且正常结束。"),
      sample("floatError"),output("输入bad · 错误末行示意","ValueError: could not convert string to float: 'bad'"),
      p("本节只识别输入格式与转换位置，终止后重新运行。后续再处理自动校验与重试。int/float已足够完成本题；eval会求值输入表达式并可能执行不可信代码，不用于这里。错误记录属于stderr，不改写成正常输出。"),
    ]},
    {id:"practice",title:"换自己的主题和数据，完成两份新程序",navGroup:"practice",navLabel:"独立练习",blocks:[
      p("先独立写程序，再按需展开提示。基本交付是本人源码和本题真实运行结果；同一会话的环境、文件位置和命令只记一次，后面可引用编号。预测可口述或记一行；边界、改值和恢复题按题干保留必要对照。"),
      {type:"exercise",id:"interactive-label-and-count",title:"自己的物品标签和数量",kind:"代码",
        prompt:"自选新物品/活动、名称与两条提示，独立创建.py。input取得标签及整数数量文本，分步int转换，再乘固定每份用量并print。写清每份和总量单位。为同一源码选两组新合法输入，先预测再在本机终端分别输入运行，不用Box A/4或Tool B/2。交源码、一张两组输入/预测/print结果表和一次命令。另用type实际观察str→int一次即可，留两条类型结果，解释源码不改为何结果变化，区分提示/回显/print。",
        hints:["哪些内容需要原样保留为文字？哪个完整数量需要参与乘法？先看每份用量与总量的单位。","按接收文本、另行转换、计算、显示组织。为同一文件安排两次输入，再用type核对读取的是哪个名称；主题、数值、源码和预测由你决定。"],
        solution:[
  "参考活动入场牌，每组5张。页尾折叠参考区给出event_badges.py，先完成自己程序再展开。它的第1行接收场地，第2行接收组数文本，第3行int建立整数teams。第4行显示场地，第5行乘5算张数并显示。",
  "第一轮Hall C/3先预测Hall C、15张，运行python event_badges.py（macOS用python3）；同源码第二轮Hall D/6先预测Hall D、30张，再重新启动。每次提示后分别输入、Enter，保留本人实际记录；参考数字不能代替你的新输入。",
  "另存观察副本，在所有赋值之后加print(type(venue_name))、print(type(team_text))、print(type(teams))，分别应观察str、str、int。5张/组乘3组为15张，乘6组为30张。",
  "常错是转换后仍用原文本计算、输入附加单位、未保存或运行错文件。沿名称和语句核对，分清提示/回显/print；格式错后重新启动给合法文本。接受其他主题、新整数、合法名、成对单引号及先存结果再print的写法，仍须有本人两轮证据。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric:[
  "本人新.py两次input，分步int后真实乘法，自选情境/名称/提示。",
  "同一源码两组新输入有事前预测与真实print，单位正确，命令只记一次。",
  "至少一次实际type证明str→int，无须每组重复诊断；能区分提示、键入回显和print。"
]},
      {type:"exercise",id:"measure-and-recheck",title:"小数测量与错误格式恢复",kind:"代码",
        prompt:"自选新测量情境、名称、提示、单位及固定件数。新.py用input收测量文本，分步float后乘件数。选两组合法小数，先预测再实跑，type观察str→float一次。另建受控副本，真输入一次无效文本，留完整相关ValueError、转换行和非零退出；重新启动用合法值验证恢复。交源码、两组输入/预测/结果表、一次类型对照、错误→新进程恢复记录；相同命令引用一次编号。不写异常捕获、循环或eval。",
        hints:["区分原始测量文本、转换后数值和总量。单段与总量单位是什么，固定几段才符合情境？","核对float在哪一行、实际文字是否合数字格式；异常终止后怎样重新执行并等提示再输入？保留你选择的数据、预测和最终实现。"],
        solution:[
  "参考4段等长装饰绳，完整cord_lengths.py与受控cord_format_copy.py见页尾。第1行收单段米数文本，第2行float得到length，第3行乘4并print总米数。原值和新值的type分别应是str、float。",
  "1.25米先预测总5.0米，保存后运行python cord_lengths.py（macOS用python3）。同源码第二轮2.5米先预测10.0米，再启动运行。两轮都留本人输入、命令和真实结果，不把参考预测当实跑。",
  "副本输入oops，第2行float失败；保存真实Traceback、ValueError和非零退出，没有总量print。之后再次执行副本，提示出现才输入0.75、Enter，实际核对3.0米、正常结束。恢复来自新进程，不是已经结束的程序自己重试。",
  "常错是把m一起输入、改用int或原字符串计算、丢掉错误、没有重启。按真实输入/转换行检查，不改环境。接受其他测量、新小数、合法名、合理件数和等价已学计算，单位与两轮合法/错误/恢复证据必须齐全。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric:[
  "真实input、分步float及计算，情境/单位合理，一次实际类型对照即可。",
  "两组新合法输入均先预测后运行，源码与真实结果对应，命令可引用。",
  "受控副本真ValueError及非零退出，能指出具体格式条件；重启后合法值真实恢复，无try/循环/eval。"
]},
    ]},
    {id:"reference-programs",title:"完成后再展开：两题完整参考程序",navGroup:"reference",navLabel:"参考程序",tier:"verification",blocks:[
      p("先独立做题再核对。以下是完整参考路径，复制时另存新文件，保留原作；各题解答解释了每行、单位、两组预测和命令。参考代码只用正文已解释的语法。"),sample("ownInteger"),sample("ownMeasure"),sample("measureError"),
      p("event_badges.py每轮收场地和组数两行；cord_lengths.py每轮只收单段米数。受控副本cord_format_copy.py先输入oops观察错误，再重新执行输入0.75核对恢复，不能把一次截图替代这些运行。"),
    ]},
    {id:"next-step",title:"先接住文字，再用真实输入核对计算",navGroup:"finish",navLabel:"回顾与后续",blocks:[
      {type:"summary",points:["input显示提示并等待一行，Enter提交后取得str；提示、终端回显与print来源不同。","原始文本与转换结果分开，用type观察；完整数量用int，小数测量用float，转换后再做数值计算。","同一保存脚本，两组新合法输入先预测再实跑；受控格式错误留回溯，终止后重启用合法值确认恢复。"]},
      p("保留自己的程序、两组新输入、类型行和一次错误恢复记录。能解释为什么计算使用转换后的值，就可以带着这份结果学习输出。"),
      p("下一节2.6将输入、转换、计算与比较整理成带说明和单位的输出，让别人知道结果在回答什么。第5章函数仍需控制流程等中间先修，按课程顺序补齐后再读。"),
    ]},
  ],resources:[],
  references:[
    {title:"input读取一行",href:"https://docs.python.org/3.14/library/functions.html#input",note:"提示无自动换行，返回字符串。"},
    {title:"int与float转换",href:"https://docs.python.org/3.14/library/functions.html#int",note:"本课限定普通整数或小数文本。"},
    {title:"float",href:"https://docs.python.org/3.14/library/functions.html#float",note:"文本必须符合转换要求。"},
    {title:"type观察",href:"https://docs.python.org/3.14/library/functions.html#type",note:"观察类型不同于转换。"},
    {title:"ValueError",href:"https://docs.python.org/3.14/library/exceptions.html#ValueError",note:"结合实际输入与转换语句。"},
    {title:"输入输出",href:"https://docs.python.org/3.14/tutorial/inputoutput.html",note:"后续格式化留下一课。"},
    {title:"浮点表示限制",href:"https://docs.python.org/3.14/tutorial/floatingpoint.html",note:"多数十进制小数的表示为近似。"},
  ],
});
