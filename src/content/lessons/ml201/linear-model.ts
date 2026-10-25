import {
  defineMlLesson,
  p,
  m,
  note,
  links,
  prep,
  refs,
  summary,
} from "./shared";
export const linearModelLesson = defineMlLesson("ML201-C03-L02", {
  subtitle: "让一条直线变成可执行的规则，逐个计算输入、权重、偏置与预测。",
  durationMinutes: 25,
  prerequisites:
    "完成 3.1，理解特征与目标；能进行乘法、加法并调用 Python 函数。检查：输入 x=1、目标 y=3 时，预测值是否一定等于 3？答案是否定的，它取决于模型参数。",
  prerequisiteLinks: [
    {
      title: "3.1 从现实问题认识回归",
      href: "/learn/ML201/ML201-C03-L01",
      note: "复习本组教材的配对合成读数。",
    },
    prep.python,
  ],
  objectives: [
    "用给定 w、b 计算预测值",
    "解释改变权重与偏置的不同影响",
    "区分固定数据、待选参数和预测输出",
  ],
  references: [refs.google, refs.d2l],
  sections: [
    {
      id: "model",
      title: "把增量关系写成一条规则",
      navGroup: "model",
      navLabel: "模型",
      blocks: [
        p(
          "上一节看到输入每增加 1，目标增加 2。先用一个候选规则计算：把输入乘以 2，再加 1。给 x=1.5，结果为 4。我们把“乘多少”和“再加多少”分开，才能讨论其他可能的直线。",
        ),
        m(
          "\\hat y=wx+b",
          "x 是输入，ŷ 是预测；w 是权重，决定直线的斜率；b 是偏置，决定 x=0 时的预测。本例所有数值均无量纲。对第 i 个样本，把 x 换成 xᵢ 即得 ŷᵢ。",
        ),
        p(
          "w=2、b=1 是一个候选参数组合。x、y 是已有数据，选择参数不会改变已知目标；调整 w、b 才会改变预测。训练就是按某个准则挑选参数，而不是把每个 y 改成模型已经输出的数。",
        ),
        note(
          "为什么叫线性回归？",
          "这里只讨论对输入为直线的一维模型。含 b 的映射在严格线性代数中是仿射映射，机器学习通常仍称其为线性回归；不要把“线性模型”误解为任何数据都天然线性。",
        ),
      ],
    },
    {
      id: "calculate",
      title: "用三行手算区分三组参数",
      navGroup: "calculate",
      navLabel: "手算",
      blocks: [
        {
          type: "table",
          caption: "同一输入，不同参数产生不同预测",
          columns: ["x", "目标 y", "w=2,b=1", "w=1,b=1", "w=2,b=0"],
          rows: [
            ["0", "1", "1", "1", "0"],
            ["1", "3", "3", "2", "2"],
            ["2", "5", "5", "3", "4"],
          ],
        },
        p(
          "以 x=2 为例，第一组为 2×2+1=5，第二组为 1×2+1=3，第三组为 2×2+0=4。降低 w 会改变输入增加时的预测增量；保持 w 不变而把 b 减少 1，会让每个预测都减少 1。",
        ),
        {
          type: "image",
          src: "/learning/ml-v2/parameter-lines.png",
          width: 1200,
          height: 640,
          mobile: {
            src: "/learning/ml-v2/parameter-lines-mobile.png",
            width: 640,
            height: 680,
          },
          alt: "三组候选直线分别为 y=2x+1、y=x+1 和 y=2x。第二条斜率较小，第三条与第一条平行且向下偏移1。",
          caption:
            "改变 w 是改变斜率；只改变 b 是平移直线。三个标出的点仍是同一组固定的合成目标。",
        },
        {
          type: "exercise",
          id: "model-calculate",
          kind: "计算",
          title: "先算数值，再描述几何变化",
          prompt:
            "给 w=1.5、b=0.5，计算 x=0、1、2 的三个预测。再把 b 改为 1.5，说明三个预测分别改变多少。",
          hints: [
            "对每个 x 分别执行 1.5×x+0.5。",
            "第二次只让 b 增加 1，w 和 x 都不变。",
          ],
          solution: [
            "原预测为 0.5、2.0、3.5。",
            "新预测为 1.5、3.0、4.5，每项都增加 1；斜率未变。",
          ],
          rubric: ["三个输入都独立代入", "说明平移而不是斜率变大"],
        },
      ],
    },
    {
      id: "code",
      title: "把参数留在接口中",
      navGroup: "code",
      navLabel: "代码",
      blocks: [
        {
          type: "code",
          filename: "linear_prediction.py",
          language: "python",
          code: "def predict(x, w, b):\n    return w * x + b\n\nxs = [0.0, 1.0, 2.0]\nvalues = [predict(x, w=2.0, b=1.0) for x in xs]\nprint(values)\nassert values == [1.0, 3.0, 5.0]\nassert predict(1.5, 2.0, 1.0) == 4.0\n",
        },
        p(
          "predict 接收三个数，返回一个数；列表推导式对每个输入调用一次，得到 [1.0, 3.0, 5.0]。把 w、b 作为形参，可以用同一函数比较参数。这个程序只做预测和核验，尚没有自动选参数的步骤。",
        ),
        {
          type: "exercise",
          id: "model-code",
          kind: "代码",
          title: "用断言检查修改是否符合意图",
          prompt:
            "把程序中的 w 改成 1.0、b 仍为 1.0。先写出新的 values，再说明原断言为何失败、应该怎样修改。",
          hints: [
            "逐一计算 x+1，而不是只改最后一个结果。",
            "断言描述预期行为；参数变了，预期数组也应相应改变。",
          ],
          solution: [
            "values 变为 [1.0, 2.0, 3.0]。",
            "原断言要求 [1.0,3.0,5.0]，与新候选模型不符。应把预期值改成新结果，同时保留独立手算作为依据；不能简单删掉全部断言。",
          ],
          rubric: ["预测数组正确", "能解释失败原因与参数改变的关系"],
        },
      ],
    },
    {
      id: "check",
      title: "数据与参数不要混淆",
      navGroup: "check",
      navLabel: "自查",
      blocks: [
        {
          type: "quiz",
          id: "parameters",
          question: "对固定训练样本，训练通常要选择什么？",
          options: [
            "改变 w 和 b",
            "把所有目标 y 改成当前预测",
            "删除预测不准确的输入以保证正确",
          ],
          correct: 0,
          explanations: [
            "正确。本节模型族由参数 w、b 决定。",
            "这会破坏监督信号，而不是学到对目标的拟合。",
            "无依据地删去难例会改变问题并掩盖误差，不是参数优化。",
          ],
        },
        {
          type: "quiz",
          id: "bias",
          question: "w 固定，只把 b 增加 2，会发生什么？",
          options: [
            "所有预测都增加 2",
            "斜率变成原来的 2 倍",
            "只有 x=0 的预测改变",
          ],
          correct: 0,
          explanations: [
            "正确，ŷ 的变化为 Δb=2，与 x 无关。",
            "斜率由 w 决定，此处没有改变 w。",
            "b 加在所有输入的 w×x 后，因此每个预测都会改变。",
          ],
        },
        note(
          "拟合已知点仍然不是现实保证",
          "w=2、b=1 恰好通过合成示例，是因为我们有意制作了这种数据。对于未知设备、噪声或非线性关系，需要独立数据与任务检查；直线也不是唯一可能通过有限样本的函数族。",
        ),
      ],
    },
    {
      id: "summary",
      title: "下一步：什么叫拟合得更好？",
      navGroup: "check",
      navLabel: "自查",
      blocks: [
        summary([
          "ŷ 是输出、x 是输入，w 与 b 是参数；三者的角色不同。",
          "w 改变斜率，b 对所有预测做相同平移。",
          "候选参数需要可比较的误差准则，不能只凭图看起来接近。",
        ]),
        links("继续学习", [
          {
            title: "3.3 预测误差、MAE 与 MSE",
            href: "/learn/ML201/ML201-C03-L03",
            note: "对每个预测算误差，再聚合为一个可比较的损失。",
          },
        ]),
      ],
    },
  ],
});
