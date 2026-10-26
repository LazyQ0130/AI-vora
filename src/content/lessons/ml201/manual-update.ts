import { defineMlLesson, p, m, note, links, prep, summary } from "./shared";
export const manualUpdateLesson = defineMlLesson("ML201-C04-L04", {
  subtitle:
    "拿出纸笔，从两个样本算到新参数，再用新的预测证明这一步是否真的改善了训练损失。",
  prerequisites:
    "完成 3.2、3.3 与 4.2，能用 wx+b 预测，理解平均平方误差及两个梯度公式。自查：误差是预测减目标；两个梯度必须使用同一次旧参数预测。",
  prerequisiteLinks: [
    prep.python,
    {
      title: "4.2 梯度下降的数学原理",
      href: "/learn/ML201/ML201-C04-L03",
      note: "若看不懂 2ex 与 2e，先补齐链式法则推导。",
    },
  ],
  objectives: [
    "逐样本计算误差、平方与梯度贡献",
    "完成一次同步参数更新并重新计算损失",
    "用反例定位归一化和顺序更新错误",
  ],
  sections: [
    {
      id: "setup",
      title: "固定实验条件，先算旧损失",
      navGroup: "setup",
      navLabel: "设定",
      blocks: [
        p(
          "为了减少手算量，本节只取前面虚拟传感器数据中的后两个点：(1,3)、(2,5)。这是特意选取的两点教学子集，不是另换一套真实数据。x、y 都是无量纲合成刻度；n=2，初始 w=0、b=0，学习率 η=0.1。目标是核对一次更新，不是证明泛化能力。",
        ),
        m(
          "\\begin{aligned}\\hat y_i&=0x_i+0=0\\\\e_i&=\\hat y_i-y_i\\end{aligned}",
          "所有旧预测均为 0，所以误差是 −3 与 −5。负号表示低估目标，平方后用于计算损失。",
        ),
        {
          type: "table",
          caption: "先固定旧参数 w=b=0，逐行计算",
          columns: ["样本", "x", "y", "预测", "e", "e²", "2ex", "2e"],
          rows: [
            ["1", "1", "3", "0", "−3", "9", "−6", "−6"],
            ["2", "2", "5", "0", "−5", "25", "−20", "−10"],
          ],
        },
        m(
          "L_0=\\frac{9+25}{2}=17",
          "平均的是两个样本的平方误差，分母不是参数个数；在本例中它们恰巧都为 2，换数据时不能混淆。",
        ),
      ],
    },
    {
      id: "gradients",
      title: "把各样本的贡献平均，再同步更新",
      navGroup: "calculate",
      navLabel: "手算",
      blocks: [
        m(
          "\\begin{aligned}d_w&=\\frac{-6-20}{2}=-13\\\\d_b&=\\frac{-6-10}{2}=-8\\end{aligned}",
          "表格已经计算了含系数 2 的贡献，此处只除以 n，不再额外乘 2。两个负梯度提示：这组参数附近，稍微增大 w 和 b 有助于减小损失。",
        ),
        m(
          "\\begin{aligned}w_1&=0-0.1(-13)=1.3\\\\b_1&=0-0.1(-8)=0.8\\end{aligned}",
          "两个更新都从旧值 0 出发，使用刚才的同一份误差。乘学习率后得到参数变化量；−13、−8 本身不是新参数。",
        ),
        p(
          "现在停下来检查符号：减去负数使参数增加。不能因为误差为负，就把新参数也写成负数。更新幅度由梯度和学习率共同决定。",
        ),
      ],
    },
    {
      id: "verify",
      title: "重新预测，不能沿用旧误差",
      navGroup: "calculate",
      navLabel: "手算",
      blocks: [
        {
          type: "table",
          caption: "新参数 w=1.3、b=0.8 下的独立复核",
          columns: ["x", "y", "新预测", "新误差", "新误差²"],
          rows: [
            ["1", "3", "2.1", "−0.9", "0.81"],
            ["2", "5", "3.4", "−1.6", "2.56"],
          ],
        },
        m(
          "L_1=\\frac{0.81+2.56}{2}=1.685<17",
          "训练损失下降，但还不是 0，参数也尚未等于这两个点的精确直线 w=2、b=1。一次更新不是训练完成。",
        ),
        {
          type: "image",
          src: "/learning/ml-v2/first-update.png",
          width: 1200,
          height: 640,
          mobile: {
            src: "/learning/ml-v2/first-update-mobile.png",
            width: 640,
            height: 680,
          },
          alt: "两个合成数据点为一和三、二和五。旧预测是一条零水平线，新预测为一点三乘输入加零点八；新直线更接近两个目标，但仍在目标下方。",
          caption:
            "同一组样本上的前后比较：点是固定目标，线是模型预测。图形帮助检查方向，损失数值仍需按定义计算。",
        },
        {
          type: "quiz",
          id: "new-loss",
          question: "更新后应使用哪组误差计算新损失？",
          options: ["−0.9、−1.6", "−3、−5", "−13、−8"],
          correct: 0,
          explanations: [
            "正确，要用新参数重新预测再减目标。",
            "这是旧误差，无法反映参数更新的效果。",
            "这是两个旧梯度，不是样本误差。",
          ],
        },
        {
          type: "quiz",
          id: "complete",
          question: "L 从 17 降到 1.685 能说明什么？",
          options: [
            "在这两个训练点上，这一步降低了 MSE",
            "模型已能准确预测任意真实传感器",
            "所有后续步长都能保证损失下降",
          ],
          correct: 0,
          explanations: [
            "正确，结论要限定数据、定义和本次更新。",
            "合成训练点没有提供真实数据的泛化证据。",
            "还要考虑后续梯度、步长和数值条件。",
          ],
        },
      ],
    },
    {
      id: "debug",
      title: "两种看似合理、却改变算法的写法",
      navGroup: "debug",
      navLabel: "排错",
      blocks: [
        note(
          "忘记平均，损失下降也未必算对",
          "如果把两个梯度都忘记除以 2，会得到 dw=−26、db=−16，新参数为 2.6、1.6，MSE=2.34。它仍然低于 17，但不等于标准同步更新的 1.685。因此“损失下降”不能独自验证公式。",
        ),
        {
          type: "exercise",
          id: "sequential",
          kind: "计算",
          title: "找出 db 被悄悄换了位置的错误",
          prompt:
            "某人先按正确 dw 得到 w=1.3，却用新 w 和旧 b=0 重算误差，再更新 b。请算这时的误差、db、b 与最终 MSE，并指出差别。",
          hints: [
            "此时两次预测为 1.3、2.6，先减 3、5。",
            "db=2×平均误差，b 从 0 减去 0.1×db。",
          ],
          solution: [
            "新 w、旧 b 对应误差 −1.7、−2.4，db=−4.1，更新得 b=0.41。",
            "最终参数 (1.3,0.41) 的预测为 1.71、3.01，误差 −1.29、−1.99，MSE=(1.6641+3.9601)/2=2.8121。",
            "这不是在同一点求得的两个偏导。若想实现本节同步算法，必须在修改 w 之前保存 dw、db。",
          ],
          rubric: [
            "标明每一组误差对应哪组参数",
            "最终损失使用两个最终参数",
            "能解释算法差异而不只比较大小",
          ],
        },
      ],
    },
    {
      id: "code",
      title: "让程序逐项复算，再自己复述",
      navGroup: "practice",
      navLabel: "练习",
      blocks: [
        {
          type: "code",
          filename: "one_update.py",
          language: "python",
          code: "xs, ys = [1.0, 2.0], [3.0, 5.0]\nw, b, rate = 0.0, 0.0, 0.1\nerrors = [w * x + b - y for x, y in zip(xs, ys)]\nold_loss = sum(e ** 2 for e in errors) / len(xs)\ndw = 2 * sum(e * x for e, x in zip(errors, xs)) / len(xs)\ndb = 2 * sum(errors) / len(xs)\nw, b = w - rate * dw, b - rate * db\nnew_errors = [w * x + b - y for x, y in zip(xs, ys)]\nnew_loss = sum(e ** 2 for e in new_errors) / len(xs)\nprint(dw, db, round(w, 3), round(b, 3), round(new_loss, 6))\nassert old_loss == 17.0\nfor actual, expected in zip([dw, db, w, b, new_loss], [-13, -8, 1.3, 0.8, 1.685]):\n    assert abs(actual - expected) < 1e-12\n",
        },
        p(
          "Python 3.10+，无需第三方库。输出为 −13.0 −8.0 1.3 0.8 1.685（终端负号样式可能不同）。元组赋值右侧先计算完再赋值；new_errors 与 errors 分开命名，避免误用旧预测。断言比较的是未四舍五入的数，并允许浮点微小误差。",
        ),
        {
          type: "exercise",
          id: "repeat-data",
          kind: "迁移",
          title: "数据复制会改变这一步吗？",
          prompt:
            "将这两点各复制一次，得到四个样本，其他设定不变。无需重跑训练，解释第一次更新是否变化，再用程序核对。",
          hints: [
            "每项求和与样本数同时扩大为原来的两倍。",
            "本教材用的是平均损失和平均梯度。",
          ],
          solution: [
            "MSE、dw、db 都不变：分子和分母同比增加。因此第一次新参数仍为 (1.3,0.8)，新 MSE 仍为 1.685。",
            "可将 xs、ys 分别改成原列表重复两次，保留原断言。若梯度变成两倍，说明漏掉平均或又多乘了 n。",
            "复制没有增加独立信息，也不能代替新的测试数据。",
          ],
          rubric: [
            "说明归一化抵消的原因",
            "代码核对仍保留容差与预期值",
            "区分样本条数和独立信息",
          ],
        },
        summary([
          "旧预测→旧误差→两个平均梯度→同步更新→新预测→新损失。",
          "本例标准首步是 (w,b)=(1.3,0.8)，MSE 从 17 降至 1.685。",
          "用已知手算和复制数据不变性，比只看损失下降更能定位实现错误。",
        ]),
        links("继续学习", [
          {
            title: "4.4 使用 NumPy 实现线性回归",
            href: "/learn/ML201/ML201-C04-L05",
            note: "保持同样的数据与首步，把一次更新变成可验证的训练循环。",
          },
        ]),
      ],
    },
  ],
});
