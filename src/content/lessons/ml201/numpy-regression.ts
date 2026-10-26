import { regressionCoreCode } from "../../resources/core-programs";
import { defineMlLesson, p, note, links, prep, refs, summary } from "./shared";
import {
  gradientDescentCode,
  resourcesForProgram,
} from "../../resources/programs";
export const numpyRegressionLesson = defineMlLesson("ML201-C04-L05", {
  subtitle:
    "从两条数组误差到一个短训练循环；工程防护与独立对照按需展开。",
  prerequisites:
    "完成 4.3；会定义 Python 函数、使用循环，理解 NumPy 一维数组、shape、逐元素运算与 mean。自查：两个形状均为 (2,) 的数组相减是什么形状？若不能回答，请先补修数组与广播。",
  prerequisiteLinks: [
    prep.python,
    prep.math,
    prep.arrays,
    prep.data,
    {
      title: "4.3 一次更新的手算",
      href: "/learn/ML201/ML201-C04-L04",
      note: "完整程序第一步必须复现手算，不能只看最终数值。",
    },
  ],
  objectives: [
    "将预测、误差和梯度公式逐项映射到 NumPy",
    "独立补全同步训练循环并核对首步与终点",
    "区分训练损失下降与未见数据上的表现",
  ],
  resources: resourcesForProgram("ml-gradient-descent"),
  references: [refs.numpy, refs.lstsq, refs.d2l],
  sections: [
    {
      id: "environment",
      title: "先让最小预测片段运行起来",
      navGroup: "environment",
      navLabel: "准备",
      blocks: [
        p("在本地 Python 3.10+ 环境运行，先用同一个解释器执行 python -m pip install numpy。网页只展示代码和下载；先确认 MA 3.3 的一维数组知识，再继续。这里固定 x=[1,2]、y=[3,5]、w=b=0，与 4.3 同样两点。"),
        {
          type: "code", filename: "predict_arrays.py", language: "python",
          code: "import numpy as np\n\nx = np.array([1.0, 2.0])\ny = np.array([3.0, 5.0])\nw, b = 0.0, 0.0\nprediction = w * x + b\nerror = prediction - y\nprint(x.shape, prediction, error)\n",
        },
        p("先预测输出，再运行：形状为 (2,)，预测 [0,0]，误差 [-3,-5]。w、b 是标量；* 对每个 x 元素乘 w。小数与空格显示可能不同，数值应一致。安装与环境隔离的排错入口在下方可选区。"),
      ],
    },
    {
      id: "shapes",
      title: "先检查形状，再写训练循环",
      navGroup: "implementation",
      navLabel: "实现",
      blocks: [
        {
          type: "table",
          caption: "公式与 NumPy 的逐项对应",
          columns: ["数学量", "代码", "形状 / 作用"],
          rows: [
            ["xᵢ、yᵢ", "x、y", "(n,)：两个等长、有限数值的一维数组"],
            ["w、b", "w、b", "标量：这一节只有一个输入特征"],
            ["预测 wxᵢ+b", "w*x+b", "(n,)：逐元素预测"],
            ["误差 eᵢ", "prediction-y", "(n,)：预测减目标"],
            ["(2/n)Σeᵢxᵢ", "2*np.mean(error*x)", "标量 dw：mean 已做平均"],
            ["(2/n)Σeᵢ", "2*np.mean(error)", "标量 db：同一份旧误差"],
            ["MSE", "np.mean(error**2)", "标量：每个误差先平方再平均"],
          ],
        },
        p("本节约定 x、y 为等长一维数组。一个样本对应一条预测和误差。循环内依次计算预测、误差、两个梯度，再同步更新。np.mean 是平均；**2 是逐项平方。第一次更新应得到 dw=-13、db=-8，再得到 w=1.3、b=0.8。"),
      ],
    },
    {
      id: "training", title: "核心代码：反复执行同一次更新", navGroup: "implementation", navLabel: "实现",
      blocks: [
        p("range(2000) 让循环执行 2000 次，step 从 0 开始编号。每轮的 dw、db 都由同一份 error 计算；w,b=… 的右侧先求值再赋值，因此同步更新。if step==0 只显示首步；f 字符串里的 .3f、.6f 表示显示 3、6 位小数，不改变内部计算精度；float 把单个 NumPy 数值转成 Python 浮点数。先运行默认设定，再做下方新目标练习。"),
        { type: "code", filename: "train_core.py", language: "python", code: regressionCoreCode },
        p("首步输出 first w=1.300, b=0.800；由 4.3 知首步 MSE=1.685。最后 w≈2、b≈1，MSE<10⁻¹⁰。最后一行必须用新参数重新预测，不能沿用更新前的 error。这些输出只针对默认两点、学习率 0.1 和 2000 步。"),
        note("结果的适用范围", "这两个干净合成点服从 y=2x+1。近零训练损失说明拟合了这两个点；现实任务需要独立数据评价泛化，不能据此说模型对所有输入更准确。"),
      ],
    },
    {
      id: "full-code",
      tier: "verification",
      title: "可选验证：防护、日志与独立求解器",
      navGroup: "implementation",
      navLabel: "实现",
      blocks: [
        note("环境与安装排错", "仍用同一 Python 3.10+ 解释器：python -m pip install numpy，再运行 python ml_gradient_descent.py。遇到 ModuleNotFoundError，先确认安装包与运行脚本用的是同一个 python。若希望隔离项目，可先 python -m venv .venv；Windows 随后统一使用 .venv/Scripts/python.exe，macOS/Linux 使用 .venv/bin/python，分别通过 -m pip 安装并运行脚本。"),
        {
          type: "code",
          filename: "ml_gradient_descent.py",
          language: "python",
          code: gradientDescentCode,
        },
        {
          type: "downloads",
          resourceIds: [
            "ml-gradient-descent-python",
            "ml-gradient-descent-notebook",
          ],
        },
        p(
          "保存为 ml_gradient_descent.py 后运行 python ml_gradient_descent.py；如选用虚拟环境，统一替换解释器路径。Notebook 需要本地 Jupyter 环境，下载文件没有伪造执行输出。它与完整脚本使用同一份代码。",
        ),
        {
          type: "table",
          caption: "默认设定应核对的结果",
          columns: ["检查点", "预期结果", "为什么检查"],
          rows: [
            ["初始", "MSE=17.000000", "数据和初始化与手算一致"],
            [
              "第 1 步",
              "w=1.300，b=0.800，MSE=1.685000",
              "符号、平均与同步更新均可逐项比对",
            ],
            [
              "第 2000 步",
              "w≈2，b≈1，MSE<10⁻¹⁰",
              "与这两点的独立最小二乘解比较",
            ],
            ["历史", "2001 个有限损失值", "初值加 2000 次更新，可回查数值异常"],
          ],
        },
        p(
          "np.column_stack 把 x 和全 1 向量组成两列，分别对应 w 与 b。np.linalg.lstsq 给出独立参考，不靠重复同一梯度循环来自证；本节只用它核对，不要求提前掌握矩阵解析解推导。atol 是绝对容差，rtol=0 明确不额外添加相对容差。",
        ),
        note(
          "保护与断言的范围",
          "非有限值或极大损失会触发保护，帮助发现明显发散；1e12 是本教学脚本的防护阈值，不是通用收敛标准。末尾严格终点断言只适用于默认数据、步长与步数。实验改变设定后，先写出新的检查目标，不能靠删除失败提示宣称成功。",
        ),
        {
          type: "image",
          src: "/learning/ml-v2/training-loss.png",
          width: 1200,
          height: 640,
          mobile: {
            src: "/learning/ml-v2/training-loss-mobile.png",
            width: 640,
            height: 680,
          },
          alt: "同样两个合成样本、初始权重和偏置为零、学习率零点一的训练损失曲线。横轴更新次数从零到二千，纵轴为对数尺度的平均平方误差，曲线下降接近零。",
          caption:
            "用完整脚本相同的更新规则生成。纵轴为对数尺度，只显示正损失；这组干净合成数据的下降不代表所有数据都可拟合到零。",
        },
      ],
    },
    {
      id: "experiment",
      tier: "advanced",
      title: "带着问题改变一个变量",
      navGroup: "experiment",
      navLabel: "实验",
      blocks: [
        p(
          "问题：相同的 200 次更新，η=0.01 与 0.1 对这两点的拟合进度有什么差别？先预测，再运行下面独立的比较程序。数据、初始化、更新次数与公式全部固定，只改变学习率。这个程序记录结果，不套用完整脚本的 2000 步终点断言。",
        ),
        {
          type: "code",
          filename: "compare_rates.py",
          language: "python",
          code: 'import numpy as np\n\nx, y = np.array([1.0, 2.0]), np.array([3.0, 5.0])\nfor rate in (0.01, 0.1):\n    w, b = 0.0, 0.0\n    for _ in range(200):\n        error = w * x + b - y\n        dw, db = 2 * np.mean(error * x), 2 * np.mean(error)\n        w, b = w - rate * dw, b - rate * db\n    loss = float(np.mean((w * x + b - y) ** 2))\n    assert np.isfinite(loss)\n    print(f"rate={rate:.2f}, w={w:.6f}, b={b:.6f}, MSE={loss:.8f}")\n',
        },
        {
          type: "exercise",
          id: "rate-log",
          kind: "实验",
          title: "记录观察，也记录结论边界",
          prompt:
            "运行 compare_rates.py，填写两行学习率、w、b、最终 MSE。它能否证明 0.1 总是最佳学习率？再解释为什么两点上的近零训练误差不能证明现实任务表现好。",
          hints: [
            "比较的是同一数据、同一步数下的结果；没有搜索所有学习率。",
            "这两点没有噪声，也没有独立测试样本。",
          ],
          solution: [
            "η=0.01：w≈1.921161、b≈1.127561、MSE≈0.00164044；η=0.1：w≈1.994416、b≈1.009035、MSE≈0.00000823。显示值已舍入，小幅浮点差异正常。将自己的完整输出保存在实验记录中，不能只写“更好”。",
            "只能说明本例和这两个步长下的固定预算结果，不能推出所有数据都选 0.1。特征尺度、噪声和步数都会影响比较。",
            "近零训练误差仅说明拟合这两个点；真实评估还需要独立数据、合理划分与业务指标。后续教材仍在规划。",
          ],
          rubric: [
            "保留全部控制条件与输出",
            "结论限制在实际比较范围",
            "区分训练拟合与泛化",
          ],
        },
        {
          type: "exercise",
          id: "shape-debug",
          kind: "代码",
          title: "让错误输入明确失败",
          prompt:
            "给完整脚本的 validate_vectors 分别传入 x.reshape(-1,1)、空数组、含 NaN 的数组。每项都应发生什么？再给一维等长有限数组测试正常路径。不要为绕过检查而改函数。",
          hints: [
            "此函数只接受非空、等长的一维数组。",
            "用 try/except ValueError 记录预期错误；若没有抛出，应自行报错。",
          ],
          solution: [
            "二维列向量、空数组和 NaN 都应抛出 ValueError。正常的一维等长有限数组应通过，函数没有返回数据，返回值为 None。",
            "如果二维数组悄悄通过，误差可能被广播成矩阵。输入校验是模型约定的一部分，不只是让程序能够运行。",
          ],
          rubric: [
            "分别测试三个拒绝路径",
            "还检查有效输入",
            "解释错误与数学量的一一对应关系",
          ],
        },
      ],
    },
    {
      id: "review",
      title: "核对理解，再决定是否标记已读完",
      navGroup: "review",
      navLabel: "回顾",
      blocks: [
        {
          type: "quiz",
          id: "mean",
          question: "dw=2*np.mean(error*x) 后，还要除以 n 吗？",
          options: ["不用，mean 已经求平均", "必须再除一次", "应该乘 n"],
          correct: 0,
          explanations: [
            "正确，对照 (2/n)Σex 即可确认。",
            "这样会多除一次，使有效步长变化。",
            "这会改成另一种归一化，与本节 MSE 不对应。",
          ],
        },
        {
          type: "quiz",
          id: "broadcast",
          question: "代码运行完成但 error.shape==(2,2)，该如何处理？",
          options: [
            "先停止训练，检查 x、y 与预测的形状约定",
            "直接求平均，得到数字就算正确",
            "把学习率调小就能修复样本对应关系",
          ],
          correct: 0,
          explanations: [
            "正确，应该先恢复每个样本一条误差的约定。",
            "程序可运行不代表数学含义正确。",
            "步长不会修正广播产生的错误样本配对。",
          ],
        },
        summary([
          "先保证一维数组逐样本对应，再计算误差、两个梯度和同步更新。",
          "核心达标是解释并独立编写短循环；输入拒绝、完整日志与最小二乘对照属于可选验证。",
          "先写实验问题和控制条件，再改参数；阅读完成与实际掌握是两件事。",
        ]),
        links("后续与复习", [
          {
            title: "第 4 章后续规划",
            href: "/courses/ML201#ML201-C04",
            note: "4.5 学习率与收敛实验、4.6 综合练习与实验分析仍为规划，尚无完整正文。",
          },
          {
            title: "回到 3.3：损失如何定义",
            href: "/learn/ML201/ML201-C03-L03",
            note: "若数值不一致，先核对误差符号与归一化约定。",
          },
        ]),
      ],
    },
  ],
});
