import { z } from "zod";
import { lessonSchema, type ContentBlock } from "../models";
import { corePrograms } from "../resources/core-programs";
import { programs, resourcesForProgram, pythonFunctionsCode, vectorMatrixCode } from "../resources/programs";

type Section = z.input<typeof lessonSchema>["sections"][number];
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const m = (latex: string, explanation: string): ContentBlock => ({ type: "math", latex, explanation });
const table = (caption: string, columns: string[], rows: string[][]): ContentBlock => ({ type: "table", caption, columns, rows });
const link = (id: string, title: string, note: string) => ({ title, href: `/learn/${id.split("-")[0]}/${id}`, note });
const navLabels: Record<string,string> = { concept: "概念", binding: "参数", defaults: "默认值", return: "返回值", scope: "作用域", vectors: "向量", dot: "内积", matrices: "矩阵", multiply: "乘法", shapes: "形状", code: "代码", quiz: "练习", verification: "验证", "legacy-validation": "旧例验证", summary: "总结" };
const section = (id: string, title: string, blocks: ContentBlock[]): Section => ({ id, title, navGroup: id, navLabel: navLabels[id] ?? title, blocks });
const exercise = (id: string, title: string, kind: "理解" | "计算" | "代码" | "迁移", prompt: string, hints: string[], solution: string[], rubric: string[]): ContentBlock => ({ type: "exercise", id, title, kind, prompt, hints, solution, rubric });
const quick = (id: string, question: string, options: string[], correct: number, explanations: string[]): ContentBlock => ({ type: "quiz", id, question, options, correct, explanations });
type Spec = {
  id: string; title: string; subtitle: string; prerequisites: string;
  previous?: ReturnType<typeof link>; next?: ReturnType<typeof link>;
  objectives: string[]; program: keyof typeof corePrograms;
  sections: Section[]; exercises: ContentBlock[]; quizzes: ContentBlock[];
  summary: string[]; time: [number, number, number, number, number, number];
};

const specs: Spec[] = [
  {
    id: "PY101-C05-L01", title: "Python 函数与参数", subtitle: "5.1 聚焦函数基础：把重复步骤命名，再用一个输入完成一次调用。",
    prerequisites: "会变量、数值乘法与缩进。自查：value=3 后，value*2 是多少？答 6 即可继续。",
    objectives: ["按执行顺序解释定义与调用", "独立编写一个接收数值并返回两倍的函数"],
    next: link("PY101-C05-L02", "5.2 参数如何绑定", "先掌握一次调用，再增加第二个输入。"),
    program: "function-basics", time: [6, 10, 8, 12, 5, 10],
    sections: [
      section("concept", "先定义，再调用", [p("你需要把 3、4 和 7 分别乘 2。每次重复写同样的步骤容易漏改；可以先把“乘 2”这件事命名为 double。def 定义这份步骤，尚未为某个数字计算。double(3) 才会进入函数体执行。"), table("跟踪 double(3)", ["步骤", "发生什么"], [["定义", "记住 double 的函数体"], ["调用", "输入 3 交给名字 value"], ["执行", "计算 3×2=6"], ["返回", "return 把 6 交回 result"]]), p("定义括号里的 value 叫形参，是接收输入的名字；调用中的 3 叫实参，是这次给出的值。return 交回结果。先把它当作一次完整流程，5.3 再比较返回与显示。")]),
      section("binding", "一次输入对应一个名字", [p("double(4) 会让这次调用中的 value 为 4，因此返回 8。下一次 double(7) 使用新的输入 7，返回 14。多个输入如何按位置或名字对应，见 5.2；本节无需先学默认值、星号或类型注解。")]),
      section("defaults", "接下来再增加接口规则", [{ type: "reading-links", title: "原默认值书签的衔接入口", links: [link("PY101-C05-L05", "5.5 默认参数", "先学简单数字默认值。"), link("PY101-C05-L06", "5.6 可选高级陷阱", "旧版共享列表、注解与异常内容移至这里。基础达标不要求完成。")] }]),
    ],
    exercises: [exercise("define-double", "自己写一个函数", "代码", "合上示例，定义 double(value)，返回 value 的两倍。用 4 和 -2 调用并写出预期结果，再说明 def 与调用分别何时执行。", ["定义行以 def 开始；函数体需要缩进。", "函数体写 return value * 2；调用要在函数体外。"], ["定义 double(value)，函数体为 return value * 2。double(4)=8，double(-2)=-4。", "执行 def 只创建函数；执行 double(4) 才计算该次结果。"], ["输入名称与计算一致", "使用 return 交回数值", "两个新输入结果正确", "区分定义和执行"] )],
    quizzes: [quick("binding-check", "double(5) 的形参和实参分别是什么？", ["value 和 5", "5 和 value"], 0, ["value 是定义的名字，5 是调用给出的值。", "定义名字是形参，具体输入是实参。"]), quick("defaults-check", "仅执行 def double(value): … 时会算出 double(3) 吗？", ["不会，还需要调用", "会自动以 3 调用"], 0, ["定义保留步骤，调用才执行。", "定义没有指定这个实参。"] )],
    summary: ["定义保存步骤，调用执行步骤。", "形参是名字，实参是这次输入。", "本节能写一个数值函数即可达标；多个参数留到下一节。"],
  },
  {
    id: "PY101-C05-L02", title: "位置与关键字参数绑定", subtitle: "只增加一个技能：把两个实参交给正确的形参。",
    prerequisites: "能定义并调用 double(value)。自查：double(4) 返回 8。", previous: link("PY101-C05-L01", "5.1 函数基础", "复习定义与调用。"), next: link("PY101-C05-L03", "5.3 返回值", "用调用的结果继续计算。"),
    objectives: ["为位置和关键字调用写出绑定表", "编写两种等价的双参数调用"], program: "function-binding", time: [6, 10, 8, 12, 5, 10],
    sections: [section("binding", "先把名字和值配对", [p("把 3 放大 4 倍，需要两个输入。scale(value, factor) 中，第一个位置给 value，第二个位置给 factor；也可以明确写 value=3、factor=4。关键字调用按名字配对，因此名字明确时可以交换书写顺序。"), table("三次调用，都得到 12", ["调用", "value", "factor"], [["scale(3,4)", "3", "4"], ["scale(3,factor=4)", "3", "4"], ["scale(factor=4,value=3)", "3", "4"]]), p("每个形参只接收一个值；普通调用中位置实参写在关键字实参之前。这里先掌握合法调用，复杂报错与仅限关键字参数留在可选 5.6。")])],
    exercises: [exercise("bind-scale", "换一组输入", "代码", "不改函数体，用位置方式和全关键字方式分别计算 2×5。逐项写出 value、factor 的值，并解释两种调用为什么等价。", ["位置方式按定义顺序。", "关键字方式明确给 value=2、factor=5。"], ["scale(2,5) 与 scale(factor=5,value=2) 都返回 10。", "两次的绑定都是 value=2、factor=5，执行同一个乘法。"], ["两种调用合法", "结果 10", "解释绑定而非只说答案相同"] )],
    quizzes: [quick("order", "scale(4,3) 中 factor 是多少？", ["3", "4"], 0, ["factor 是第二个形参。", "4 绑定给第一个形参 value。"]), quick("named", "哪种调用等价于 scale(2,5)？", ["scale(factor=5,value=2)", "scale(value=5,factor=2) 的绑定完全相同"], 0, ["绑定相同。", "乘积碰巧相同，但绑定已经交换。"] )], summary: ["位置按顺序，关键字按名字。", "判断调用是否等价，先比较绑定，再比较计算。"],
  },
  {
    id: "PY101-C05-L03", title: "返回值与 print 的区别", subtitle: "让一个函数的结果成为下一步的输入。", prerequisites: "能写双参数调用，理解赋值。自查：result=3+1 后 result 是 4。", previous: link("PY101-C05-L02", "5.2 参数绑定", "复习实参进入函数的过程。"), next: link("PY101-C05-L04", "5.4 作用域", "分清函数内外的名字。"),
    objectives: ["区分屏幕输出和函数返回值", "用返回值继续计算"], program: "function-return", time: [6, 10, 8, 12, 5, 10],
    sections: [section("return", "屏幕上的 4，能否继续参与计算？", [p("add_one(3) 的 return 把 4 交回调用处。show_one(3) 在屏幕打印 4，但没有带值的 return，因此交回 None。None 是表示没有结果值的特殊对象，不是数值 0。"), table("跟踪赋值", ["语句", "屏幕", "变量中的值"], [["result=add_one(3)", "无", "4"], ["shown=show_one(3)", "4", "None"], ["print(result,shown)", "4 None", "变量不变"]]), p("return 执行时结束当前函数调用；同一路径下它后面的语句不再执行。要组合计算，可先把返回值存入变量，再作为另一次调用的实参。")])],
    exercises: [exercise("return-chain", "连续加两次一", "代码", "用 add_one 从 5 得到 7，写出两次调用及中间值。再说明如果把第一次改成 show_one(5)，中间变量是什么，为什么不能直接用于加法。", ["第一次返回 6，第二次以 6 为输入。", "mid=add_one(5)；result=add_one(mid)。show_one 没有带值返回。"], ["mid=6，result=7；可以写 mid=add_one(5)，result=add_one(mid)。", "改成 show_one 后屏幕打印 6，mid 为 None；None 不是可加一的数值。"], ["两次输入输出可追踪", "明确 None 与打印的 6 不同", "没有用 print 替代返回"] )],
    quizzes: [quick("printed", "print(4) 本身的返回值是什么？", ["None", "4"], 0, ["显示 4，返回 None。", "显示内容不等于返回值。"]), quick("exit", "同一路径下 return 后面的语句会执行吗？", ["不会", "会"], 0, ["当前调用已经结束。", "return 立即结束当前调用。"] )], summary: ["print 显示内容，return 交回值。", "没有带值的 return 就返回 None。", "用中间变量追踪组合调用。"],
  },
  {
    id: "PY101-C05-L04", title: "函数内外的变量与作用域", subtitle: "先理解局部名字，再讨论修改共享对象。", prerequisites: "会返回值和变量赋值。自查：return value+2 表示交回计算结果。", previous: link("PY101-C05-L03", "5.3 返回值", "复习结果如何交给调用处。"), next: link("PY101-C05-L05", "5.5 默认参数", "在简单数值接口中增加省略规则。"),
    objectives: ["跟踪形参和局部变量的取值", "解释数值形参赋值为何不改外部同名变量"], program: "function-scope", time: [6, 10, 8, 12, 5, 10],
    sections: [section("scope", "两个同名 value，分别在哪？", [p("脚本中 value=10，调用 add_two(3) 后，函数内的形参 value 是 3；局部 result 为 5。函数交回 5，不会自动将外部 value 改成 5。作用域说明一个名字在哪段代码中可直接使用。"), table("本例的两个区域", ["位置", "value", "result"], [["函数外", "10", "未定义"], ["这次函数调用内", "3", "5"]]), p("本节只讨论数值与局部赋值。不能把它扩大为“函数永远不会改调用者的数据”：列表可原地修改，共享对象的区别放在可选 5.6。基础阶段优先通过参数输入、return 输出表达意图。")])],
    exercises: [exercise("scope-trace", "换输入，保留外部变量", "理解", "把外部 value 改成 20，调用仍为 add_two(4)。写出两行输出、函数内 value 和 result，并说明外部 value 是否改变。", ["先只看调用里的 4。", "函数内 4+2=6；外部名字仍绑定 20。"], ["两行输出依次为 6、20。函数内 value=4、result=6。", "外部 value 仍为 20；局部名字不会因同名自动写回外部。"], ["区分两个作用域", "追踪返回值", "没有泛化到列表原地修改"] )],
    quizzes: [quick("local", "本例函数里的 result 可直接在外部使用吗？", ["不可以，需接收返回值", "可以，同一脚本所有名字共享"], 0, ["局部名字属于调用。", "局部名字不是自动创建的全局名字。"]), quick("outer", "add_two(3) 后外部 value 是多少？", ["10", "5"], 0, ["本例未修改外部绑定。", "5 是返回结果。"] )], summary: ["形参和函数体内赋值的名字属于本次调用。", "用返回值跨过函数边界；同名不表示自动写回。"],
  },
  {
    id: "PY101-C05-L05", title: "简单默认参数", subtitle: "只学数字默认值：省略时使用，提供时替换。", prerequisites: "会位置与关键字绑定、数值返回。自查：scale(3,4) 计算 12。", previous: link("PY101-C05-L04", "5.4 作用域", "分清函数内外的名字。"), next: link("PY101-C05-L06", "5.6 可选高级陷阱", "列表默认对象、仅限关键字、注解与异常，不计基础达标。"),
    objectives: ["解释默认值在省略实参时的作用", "编写省略和覆盖默认值的调用"], program: "function-defaults", time: [5, 8, 8, 12, 5, 10],
    sections: [section("defaults", "常用倍率写一次", [p("多数时候把输入放大 2 倍，偶尔放大 4 倍。定义 scale(value,factor=2)，表示调用者省略 factor 时使用 2，主动提供时使用给出的值。它不会把默认值与新值相加。"), table("默认值如何选择", ["调用", "factor", "结果"], [["scale(3)", "2", "6"], ["scale(3,factor=4)", "4", "12"], ["scale(3,factor=0)", "0", "0"]]), p("普通参数列表中，没有默认值的必需参数写在有默认值的参数前。本节使用数字默认值。列表等可变对象在定义时只创建一次，可能共享；需要此类接口时再学 5.6，不要照搬数字规则到列表。")])],
    exercises: [exercise("default-calls", "先预测，再覆盖", "代码", "写出 scale(5)、scale(5,factor=3)、scale(5,factor=0) 的结果，再独立写出这个函数。解释为什么最后一个结果不是 10。", ["省略 factor 才使用 2。", "显式提供 0 会覆盖 2；5×0=0。"], ["结果依次为 10、15、0。定义为 def scale(value,factor=2):，缩进体为 return value*factor。", "0 是明确给出的实参，不表示省略。"], ["默认值条件准确", "三个结果正确", "能独立写函数及调用"] )],
    quizzes: [quick("replace", "scale(3,factor=4) 会使用哪个倍率？", ["4", "2+4"], 0, ["提供的实参替代默认值。", "默认值不参与额外相加。"]), quick("required", "哪种普通定义顺序正确？", ["scale(value,factor=2)", "scale(factor=2,value)"], 0, ["必需参数在前。", "默认参数后不能直接放普通必需参数。"] )], summary: ["省略时用默认值，提供时用实参。", "数字接口已足够完成基础练习；可变对象另学。"],
  },
  {
    id: "MA101-C02-L01", title: "向量、加法与数乘", subtitle: "先用两段位移理解有顺序的分量。", prerequisites: "会实数加法乘法与二维坐标。自查：从 (0,0) 向右 1、向上 2，到 (1,2)。",
    next: link("MA101-C02-L02", "2.2 内积", "从保留两个分量到得到一个数。"), objectives: ["按分量计算向量加法和数乘", "用位移解释向量和"], program: "vector-basics", time: [8, 12, 10, 15, 3, 6],
    sections: [section("vectors", "先走 u，再走 v", [p("从原点出发，u=(1,2) 表示右移 1、上移 2；再走 v=(3,1)，终点是 (4,3)。向量是一组有顺序的分量，(1,2) 与 (2,1) 通常不同。两个同维向量按对应位置相加；数乘把每个分量乘同一个数。"), { type: "image", src: "/learning/vector-addition.png", width: 1200, height: 700, mobile: { src: "/learning/vector-addition-mobile.png", width: 640, height: 720 }, alt: "u 从原点到 (1,2)，v 为 (3,1)，把 v 平移到 u 的终点，合位移到 (4,3)，坐标轴使用相同比例。", caption: "计算核对：(1+3,2+1)=(4,3)；平移箭头不改变位移。" }, m("u+v=(1+3,2+1)=(4,3),\\qquad 2u=(2\\times1,2\\times2)=(2,4)", "括号内顺序是第一、第二分量；u、v 是向量名，2 是标量（一个数）。加法需要维度相同。")])],
    exercises: [exercise("vector-new", "手算并解释路径", "计算", "取 a=(2,-1)、b=(1,3)，求 a+b、3a，并用先走 a 再走 b 解释和的终点。", ["每个位置分别相加或乘 3。", "第一分量 2+1，第二分量 -1+3。"], ["a+b=(3,2)，3a=(6,-3)。", "从原点走 a 到 (2,-1)，再走 b 到 (3,2)，与和向量终点相同。"], ["按位置运算", "负号正确", "路径与数值一致"] )],
    quizzes: [quick("dimension", "二维向量与三维向量可按本节定义直接相加吗？", ["不可以", "可以，忽略多余分量"], 0, ["维度必须相同。", "忽略分量会改问题。"]), quick("order", "(1,2) 和 (2,1) 相同吗？", ["不同", "相同"], 0, ["分量位置有含义。", "顺序不可随意交换。"] )], summary: ["同维向量按分量相加；数乘逐项缩放。", "分量顺序与坐标图必须一致。"],
  },
  {
    id: "MA101-C02-L02", title: "内积与求和符号", subtitle: "对应相乘再相加：从具体的 5 认识 Σ。", prerequisites: "会向量分量、数乘和加法。自查：(1,2)+(3,1)=(4,3)。", previous: link("MA101-C02-L01", "2.1 向量", "先复习分量顺序。"), next: link("MA101-C03-L01", "3.1 矩阵与转置", "先学行列，再使用转置记号。"), objectives: ["计算同维实数向量的内积", "把求和记号展开成逐项运算"], program: "vector-dot", time: [8, 12, 10, 15, 3, 6],
    sections: [section("dot", "把两组对应数压成一个数", [p("两种商品的数量为 u=(1,2)，单价为 v=(3,1)，总价为 1×3+2×1=5。这个“对应相乘，再把乘积加起来”的运算叫内积，结果是标量，不再是两个分量的向量。本节限定同维实数向量。"), table("逐项算内积", ["分量编号", "u 的分量", "v 的分量", "乘积"], [["1", "1", "3", "3"], ["2", "2", "1", "2"], ["合计", "—", "—", "5"]]), p("用 i 表示分量编号；u₁=1、u₂=2，下标只是取第几个分量。n 表示总分量数，这里 n=2。大写希腊字母 Σ（求和号）表示把指定编号的各项相加，下界 i=1 表示从第 1 项开始，上界 n 表示到第 n 项结束。"), m("u\\cdot v=\\sum_{i=1}^{n}u_i v_i= u_1v_1+u_2v_2=1\\times3+2\\times1=5", "点号表示内积，不是保留各项的逐元素乘法。这里把 n=2 代入一般记号。暂时无需转置；下一章再把列向量内积写为 uᵀv。")])],
    exercises: [exercise("dot-new", "展开三项求和", "计算", "a=(2,0,-1)、b=(3,4,2)，写出 n、每个 aᵢbᵢ，再计算 Σaᵢbᵢ；说明结果是向量还是标量。", ["n 是分量个数 3。", "三个乘积是 6、0、-2。"], ["n=3；a₁b₁+a₂b₂+a₃b₃=2×3+0×4+(-1)×2=4。", "结果 4 是标量，Σ 把三个乘积加成一个数。"], ["上下界对应三项", "负号正确", "结果类型准确"] )],
    quizzes: [quick("scalar", "内积的结果是？", ["一个标量", "原维度向量"], 0, ["乘积被求和了。", "保留各项是另一种运算。"]), quick("index", "u₂ 表示什么？", ["u 的第二个分量", "u 的平方"], 0, ["下标取分量。", "平方用上标 2。"] )], summary: ["内积先对应相乘，再求和。", "i 为分量编号，n 为分量数，Σ 把编号范围内的项相加。"],
  },
  {
    id: "MA101-C03-L01", title: "向量与矩阵的基本运算", subtitle: "3.1 聚焦矩阵形状与转置；向量回顾和后续乘法通过链接衔接。", prerequisites: "会向量分量与内积。自查：(1,2)·(3,1)=5；若不会，先读 2.1–2.2。", previous: link("MA101-C02-L02", "2.2 内积", "内积不依赖转置知识。"), next: link("MA101-C03-L02", "3.2 矩阵乘法", "用行与列的内积逐格计算。"), objectives: ["读取矩阵的形状与指定元素", "手算转置并解释行列交换"], program: "matrix-shape", time: [8, 12, 10, 15, 5, 8],
    sections: [
      section("vectors", "先修回顾：有顺序的数", [p("向量和内积已在 2.1、2.2 学过；这里只回顾：分量有顺序，内积把对应乘积加成一个数。本节只增加矩阵的行列与转置。")]),
      section("matrices", "两行三列的数据表", [p("把两次记录各自的三项读数排成表：第一行 [1,2,3]，第二行 [4,5,6]。这就是一个 2×3 矩阵，形状先写行数，再写列数。用 A 命名矩阵，aᵢⱼ 表示第 i 行、第 j 列的数；i、j 从 1 开始数。这里 a₂₃=6。"), m("A=\\begin{bmatrix}1&2&3\\\\4&5&6\\end{bmatrix},\\quad A^{\\mathsf T}=\\begin{bmatrix}1&4\\\\2&5\\\\3&6\\end{bmatrix}", "上标 T（转置）是一种操作记号，不是乘方。A 的每行变成 Aᵀ 的每列：a₂₃=6 移到转置的第 3 行第 2 列；2×3 变成 3×2。"), table("把坐标位置交换", ["A 中位置", "数值", "转置中位置"], [["(1,1)", "1", "(1,1)"], ["(1,2)", "2", "(2,1)"], ["(2,3)", "6", "(3,2)"]]), p("一般说 m×n 矩阵，就是 m 行 n 列；m、n 为正整数。转置后 n×m。列向量是只有一列的矩阵，例如 u=[1,2]ᵀ 是 2×1，uᵀ 是 1×2；此时 uᵀv 的行列乘法将在 3.2 解释。数学中的第 1 行在 Python 列表用下标 0 访问，别把两套编号混用。")]),
      section("multiply", "乘法另开一节", [{ type: "reading-links", title: "原乘法锚点的衔接入口", links: [link("MA101-C03-L02", "3.2 矩阵乘法", "先学会形状与转置，再学行列内积。"), link("MA101-C03-L03", "3.3 NumPy 表示", "@、* 与一维/二维形状在此集中比较。")]}]),
    ],
    exercises: [exercise("transpose-new", "用新数字转置", "计算", "B 的两行为 [2,0]、[-1,3]。写出形状、b₂₁、Bᵀ，以及原 b₂₁ 在转置中的位置。", ["先数行和列。", "原第 2 行第 1 列 -1，转置后在第 1 行第 2 列。"], ["B 为 2×2，b₂₁=-1。Bᵀ 的两行为 [2,-1]、[0,3]。", "元素的 (2,1) 变为 (1,2)。方阵转置形状相同，但内容不一定相同。"], ["形状与下标正确", "转置的四个位置正确", "能说明形状相同不代表矩阵未变"] )],
    quizzes: [quick("shape-check", "2×3 矩阵转置后的形状？", ["3×2", "2×3"], 0, ["交换行列。", "只有方阵才保持形状。"]), quick("operator-check", "a₂₃ 是什么？", ["第 2 行第 3 列", "第 3 行第 2 列"], 0, ["先行后列。", "这是转置后的位置。"] )], summary: ["形状先行后列；元素下标也是先行后列。", "转置交换位置 i、j；上标 T 不是平方或逆序。"],
  },
  {
    id: "MA101-C03-L02", title: "矩阵乘法：行与列的内积", subtitle: "每次只算一个格子，再归纳形状规则。", prerequisites: "会内积、矩阵形状与下标。自查：矩阵第 1 行与向量 (2,1) 的内积如何算？", previous: link("MA101-C03-L01", "3.1 形状与转置", "读取行列位置。"), next: link("MA101-C03-L03", "3.3 NumPy 表示", "把已学规则映射到数组。"), objectives: ["用内部维度判断能否相乘及结果形状", "逐格手算矩阵乘积"], program: "matrix-product", time: [10, 15, 12, 20, 5, 10],
    sections: [section("multiply", "一行与一列决定一个格子", [p("取 A 的两行 [1,2]、[0,1]，B 的两行 [2,0]、[1,3]。左上格取 A 第 1 行 [1,2] 与 B 第 1 列 [2,1]，内积为 1×2+2×1=4。不要把两个左上元素单独相乘就结束。"), table("算完四个格子", ["结果位置", "行与列的内积", "结果"], [["(1,1)", "1×2+2×1", "4"], ["(1,2)", "1×0+2×3", "6"], ["(2,1)", "0×2+1×1", "1"], ["(2,2)", "0×0+1×3", "3"]]), m("AB=\\begin{bmatrix}4&6\\\\1&3\\end{bmatrix},\\quad c_{ij}=\\sum_{k=1}^{n}a_{ik}b_{kj}", "C=AB，cᵢⱼ 是结果第 i 行第 j 列。k 为配对位置，从 1 到内部维度 n；固定 i=1、j=2、n=2，得到 c₁₂=a₁₁b₁₂+a₁₂b₂₂=1×0+2×3=6。"), p("若 A 为 m×n，B 为 n×p，则 AB 为 m×p：内部 n 必须匹配，结果取外侧行列。此处 m、n、p 都是正整数，字母 p 不是概率。比如 (2×3)(3×4) 得到 2×4；(2×3)(2×3) 内部 3、2 不同，没有定义。交换乘法顺序往往改变结果，本例 BA=[[2,4],[1,5]]。代码首次使用 NumPy：先运行 python -m pip install numpy；np.array 把逐行列表存成数组，@ 对应刚才的矩阵乘法。完整数组形状课在 3.3。")])],
    exercises: [exercise("product-new", "换矩阵，算每个格子", "计算", "M 两行为 [1,0,2]、[0,1,1]；N 三行为 [1,2]、[3,0]、[2,1]。先写形状，再逐格求 MN。另判断 NM 是否有定义及其形状。", ["M 为 2×3，N 为 3×2。", "MN 第一行两格分别为 1+0+4、2+0+2。"], ["MN 为 2×2，两行为 [5,4]、[5,1]。每格是三项乘积的和。", "NM 内部 2 匹配，结果为 3×3；两种乘积形状不同，不能声称可交换。"], ["形状先检查", "四个格子演算正确", "NM 形状正确"] )],
    quizzes: [quick("inner", "(2×3)(3×4) 的结果形状？", ["2×4", "3×3"], 0, ["外侧 2、4 决定结果。", "3 为内部求和维度。"]), quick("swap", "矩阵乘法一般满足 AB=BA 吗？", ["不满足", "满足"], 0, ["本例给出反例。", "本例 AB 与 BA 不同。"] )], summary: ["一格是一行与一列的内积。", "内部维度匹配，外侧维度决定结果。", "数学手算与代码 @ 对应；* 留待下节比较。"],
  },
  {
    id: "MA101-C03-L03", title: "NumPy 表示与数组形状", subtitle: "把已学数学放进数组：分清 (2,)、(2,1)、@ 和 *。", prerequisites: "会 Python 列表、import、基本矩阵运算；本地 Python 3.10+，先 python -m pip install numpy。自查：2×1 转置后是 1×2。", previous: link("MA101-C03-L02", "3.2 矩阵乘法", "先学运算含义。"), next: link("ML201-C04-L05", "ML 4.4 训练代码", "还需先完成 ML 3.1–4.3；这个链接不是跳过 ML 先修的捷径。"), objectives: ["区分一维数组与二维列向量的形状和转置", "在 NumPy 中选择 @ 或 * 实现指定运算"], program: "numpy-shapes", time: [8, 12, 10, 15, 8, 12],
    sections: [section("shapes", "相同的两个数，不同的轴", [p("np.array([1,2]) 得到一维数组 u，shape=(2,) 表示只有一个轴、长度 2。逗号是单元素元组的语法，不能省略成二维形状。u.reshape(2,1) 保留两个数，按两行一列排成二维 column；转置 .T 交换二维的行列。"), table("形状变化图", ["写法", "形状", "含义"], [["u", "(2,)", "一个轴，两个数"], ["u.T", "(2,)", "一维没有行列轴可交换"], ["u.reshape(2,1)", "(2,1)", "两行一列"], ["column.T", "(1,2)", "一行两列"]]), p("对于二维数组，A@B 做矩阵乘法，A*B 做对应位置相乘。若 A=[[1,2],[0,1]]、B=[[2,0],[1,3]]，A@B=[[4,6],[1,3]]，A*B=[[2,0],[0,3]]。两个同长一维实数数组的 @ 返回内积标量，例如 [1,2]@[3,1]=5。这里所有 * 例子均同形；不同形状的广播留在可选验证，先保证每个数对应正确样本。")])],
    exercises: [exercise("array-choose", "从要求选择写法", "代码", "给 u=np.array([2,3])、v=np.array([4,1])，写出内积与逐项乘积的代码和结果，再写出把 u 变成列向量和行矩阵后的 shape。", ["@ 求内积，* 保留每项乘积。", "2×4+3×1=11；reshape(2,1) 后 .T。"], ["u@v 得到 11，u*v 得到 [8,3]。", "column=u.reshape(2,1) 为 (2,1)；column.T 为 (1,2)。u.T 仍为 (2,)。"], ["运算符与意图一致", "数值和返回类型正确", "三个形状正确"] )],
    quizzes: [quick("one-d", "u.shape=(2,) 时 u.T 的形状？", ["(2,)", "(2,1)"], 0, ["转置不增加轴。", "需要显式 reshape。"]), quick("ops", "二维矩阵乘法用什么运算符？", ["@", "*"], 0, ["与行列内积规则对应。", "* 是逐元素运算。"] )], summary: ["先数轴，再读每轴长度。", "一维转置不增加轴；二维转置交换行列。", "@ 与 * 的选择取决于数学意图。"],
  },
];

const figures: Record<string, ContentBlock> = {
  "PY101-C05-L01": { type: "image", src: "/learning/v2-1/function-flow.png", width: 1200, height: 500, mobile: { src: "/learning/v2-1/function-flow-mobile.png", width: 640, height: 900 }, alt: "double(3) 把实参 3 绑定给形参 value，执行 value 乘 2 得到 6，再通过 return 交给调用处的 result。", caption: "本图只追踪一个数值调用：输入 3，返回 6；没有提前引入默认参数或高级语法。" },
  "MA101-C03-L02": { type: "image", src: "/learning/v2-1/matrix-product.png", width: 1200, height: 720, mobile: { src: "/learning/v2-1/matrix-product-mobile.png", width: 640, height: 1080 }, alt: "矩阵乘法逐格展示：第一行两个内积分别为 1乘2加2乘1等于4、1乘0加2乘3等于6；第二行结果为1和3。", caption: "四个格子的表达式由 A、B 对应行列实际生成，并与 NumPy 矩阵乘积 [[4,6],[1,3]] 核对。" },
  "MA101-C03-L03": { type: "image", src: "/learning/v2-1/array-shapes.png", width: 1200, height: 560, mobile: { src: "/learning/v2-1/array-shapes-mobile.png", width: 640, height: 900 }, alt: "相同的两个数在一维数组、二维列向量和二维行矩阵中分别具有 (2,)、(2,1)、(1,2) 的形状；一维数组转置仍为 (2,)。", caption: "图中形状已由实际 NumPy 数组核对；reshape 增加了二维表示，转置本身不会为一维数组增加轴。" },
};
const codeWalkthroughs: Record<keyof typeof corePrograms, string> = {
  "function-basics": "value 接收这次输入，result 接收返回值。输出为 6；改用 double(4) 前先预测 8。",
  "function-binding": "两个 print 分别调用一次函数；factor=4 与 value=3 按名字绑定。两行都输出 12。",
  "function-return": "先由 show_one 打印 4，再由最后一行打印 4 None。result 是可继续计算的数值，shown 是 None。",
  "function-scope": "函数内 result 是局部名字；两个 print 分别输出 5、10。外部 value 没有被写回。",
  "function-defaults": "第一行省略 factor 输出 6；第二行明确 factor=4 输出 12。",
  "vector-basics": "列表下标 0、1 对应数学第 1、2 个分量。输出向量和 [4,3] 与数乘 [2,4]；没有使用列表直接相加（那会拼接列表）。",
  "vector-dot": "两个乘积先相加，dot 接收标量 5。这里不用 Σ 的代码缩写，以便逐项与手算对应。",
  "matrix-shape": "Python 下标从 0 开始；j 依次为 range(3) 给出的 0、1、2。每次取原矩阵同一列的两个数，组成转置的一行。输出 [[1,4],[2,5],[3,6]]。代码需要基础列表与循环；数学转置不依赖列表推导式。",
  "matrix-product": "A、B 按行存入二维数组。输出两行为 [4,6]、[1,3]，每个格子都能回到上方四行内积表核对。",
  "numpy-shapes": "前两行输出依次为 (2,) (2,) 与 (2,1) (1,2)，第三行内积为 5。u 保持一维，column 是显式二维表示。",
};
function makeLesson(spec: Spec) {
  const sample = corePrograms[spec.program];
  const complete = programs[spec.program];
  const courseId = spec.id.split("-")[0];
  const [r0, r1, p0, p1, c0, c1] = spec.time;
  const exercises = spec.exercises.filter((b) => b.type === "exercise");
  return lessonSchema.parse({
    id: spec.id, courseId, chapterId: spec.id.slice(0, -4), contentVersion: 1,
    title: spec.title, subtitle: spec.subtitle, prerequisites: spec.prerequisites,
    prerequisiteLinks: spec.previous ? [spec.previous] : [],
    objectives: spec.objectives,
    assessmentMap: spec.objectives.map((_, index) => ({ objective: index + 1, exerciseIds: exercises.map((e) => e.id) })),
    learningTime: { reading: [r0,r1], practice: [p0,p1], coding: [c0,c1], basis: "editorial-estimate" },
    sections: [
      ...spec.sections.map((part,index) => index === 0 && figures[spec.id] ? { ...part, blocks: [...part.blocks, figures[spec.id]] } : part),
      section("code", "最小代码：先预测再运行", [p(`${sample.environment}。以下片段可单独保存运行；先按前面的步骤预测输出，再用终端 python ${sample.filename}.py 核对。数学课代码部分需基础 Python 的列表、下标和循环；可先手算，再补修后运行。`), { type: "code", code: sample.core, filename: `${sample.filename}.py`, language: "python" }, p(codeWalkthroughs[spec.program])]),
      section("quiz", "基础达标：独立完成", [...spec.exercises, ...spec.quizzes]),
      { ...section("verification", "完整代码与独立检查", [p("此处只追加结果检查，不改变正文算法。断言、循环对照与边界检查是可选验证；基础达标按上方开放练习自查。"), { type: "code", code: complete.code, filename: `${complete.filename}.py`, language: "python" }, { type: "downloads", resourceIds: [`${spec.program}-python`, `${spec.program}-notebook`] }]), tier: "verification" },
      section("summary", "本节总结与下一步", [{ type: "summary", points: spec.summary }, ...(spec.next ? [{ type: "reading-links" as const, title: "继续学习", links: [spec.next] }] : [])]),
    ],
    resources: resourcesForProgram(spec.program),
    references: [{ title: courseId === "PY101" ? "Python 官方教程：函数" : "NumPy 官方教程：数组基础", href: courseId === "PY101" ? "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" : "https://numpy.org/doc/stable/user/absolute_beginners.html", note: "用于核对接口与数组规则；正文算例、练习与解释为原创。" }],
  });
}
export const foundationLessons = specs.map(makeLesson);

// 旧完整下载及高级语法保留在可选课，基础课不承担这些验收目标。
export const pythonAdvancedLesson = lessonSchema.parse({
  id: "PY101-C05-L06", courseId: "PY101", chapterId: "PY101-C05", contentVersion: 1,
  title: "可选进阶：共享对象与接口陷阱", subtitle: "完成基础后再读：默认列表、仅限关键字参数、注解与异常。", optionalLesson: true,
  prerequisites: "已完成 5.1–5.5，理解列表 append、对象共享与 is。自查：列表原地修改会被同一对象的其他引用看到。",
  prerequisiteLinks: [link("PY101-C05-L05", "5.5 默认参数", "数字默认值的基础规则。")],
  learningTime: { reading: [12,18], practice: [15,25], coding: [10,20], basis: "editorial-estimate" },
  objectives: ["解释可变默认对象共享并实现隔离调用", "识别仅限关键字参数和类型注解的边界"],
  assessmentMap: [{ objective: 1, exerciseIds: ["safe-list"] }, { objective: 2, exerciseIds: ["interface-rules"] }],
  sections: [
    { ...section("defaults", "默认列表何时创建", [p("def 执行时，默认表达式求值一次。items=[] 因而被省略实参的多次调用共享。先预测 collect('A')、collect('B') 是否独立，再运行例子。None 表示未提供；函数体每次创建新列表。显式传入列表是否复制是另一个约定。"), { type: "code", filename: "shared_default.py", language: "python", code: "def collect(item, items=[]):\n    items.append(item)\n    return items\n\na = collect('A')\nb = collect('B')\nprint(a, b, a is b)\n" }, p("输出为 ['A','B']、['A','B']、True（空格依 Python 显示）。第一次拿到的 a 也指向同一列表。完整版的 append_item 使用 None，并复制显式传入的列表，遵守不修改调用者列表的约定。")]), tier: "advanced" },
    { ...section("binding", "接口规则单独检查", [p("transform(value,scale=2,*,shift=0) 中，星号后的 shift 只能写 shift=…；transform(3,4,1) 会发生 TypeError。transform(3,value=4) 也会重复绑定。value: float 与 -> float 是类型注解，不会自动运行输入验证。"), { type: "image", src: "/learning/python-function-call.png", width: 1200, height: 600, mobile: { src: "/learning/python-function-call-mobile.png", width: 640, height: 1040 }, alt: "transform(3,shift=1) 将 value 设为 3、默认 scale 为 2、shift 为 1，先计算 3 乘 2 再加 1，返回 7。", caption: "图中实际参数绑定：3×2+1=7；完整脚本还有仅限关键字与列表共享检查。" }]), tier: "advanced" },
    { ...section("code", "完整接口与异常验证", [{ type: "code", filename: "python_functions.py", language: "python", code: pythonFunctionsCode }]), tier: "verification" },
    { ...section("quiz", "可选挑战", [exercise("safe-list", "隔离两次调用", "代码", "实现 append_item(item,items=None)，省略列表时创建新列表，提供列表时复制它。验证两个省略调用独立且原列表未变。", ["在函数体中创建或复制。", "result=[] if items is None else list(items)，再 append。"], ["使用上述 result 初始化，result.append(item)，return result。", "append_item('A') 与 append_item('B') 分别得到 ['A']、['B']；传入 ['start'] 不应改变原列表。"], ["两个省略调用独立", "显式传入列表保持不变"]), exercise("interface-rules", "逐项判断接口", "理解", "解释 transform(3,4,1) 与 transform(3,value=4) 为何报错；float 注解能否自动阻止字符串输入？", ["分别检查仅限关键字与重复绑定。", "注解供工具使用，运行时检查需另写。"], ["第一种给 shift 位置实参，第二种重复给 value。", "float 注解不自动执行类型检查；具体操作仍可能报错。"], ["两类错误原因区分", "注解与运行时行为区分"]), quick("shared", "默认列表每次调用新建吗？", ["否", "是"], 0, ["定义时创建一次。", "函数体内创建才是每次调用。"]), quick("annotation", "注解会自动复制列表吗？", ["不会", "会"], 0, ["复制需显式操作。", "注解不执行复制。"])]), tier: "advanced" },
    section("summary", "按需应用", [{ type: "summary", points: ["共享默认对象、显式传入对象与局部名字是不同问题。", "接口规则和验证单独设计；本节不计第 5 章基础达标要求。"] }]),
  ], resources: resourcesForProgram("python-functions"), references: [{ title: "Python 官方教程：更多函数定义", href: "https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions", note: "默认值、参数规则与注解。" }],
});

// MA 旧下载路径保留，完整验证集中在 NumPy 课。
const numpy = foundationLessons.find((lesson) => lesson.id === "MA101-C03-L03")!;
numpy.sections.splice(numpy.sections.length - 1, 0, {
  ...section("legacy-validation", "原向量矩阵完整验证", [p("保留旧脚本：独立行列求和、非交换性、形状不匹配与广播风险属于可选验证。请先完成当前基础练习。"), { type: "code", filename: "vector_matrix.py", language: "python", code: vectorMatrixCode }]), tier: "verification",
});
numpy.resources.push(...resourcesForProgram("vector-matrix"));
