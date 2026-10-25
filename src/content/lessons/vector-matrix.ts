import { lessonSchema } from "../models";
import { vectorMatrixCode, resourcesForProgram } from "../resources/programs";

export const vectorMatrixLesson = lessonSchema.parse({
  id: "MA101-C03-L01",
  courseId: "MA101",
  chapterId: "MA101-C03",
  contentVersion: 1,
  title: "向量与矩阵的基本运算",
  subtitle:
    "先看形状，再做运算：从向量相加走到矩阵乘法，建立公式与数组之间的对应。",
  durationMinutes: 30,
  prerequisites:
    "了解实数运算、坐标和求和符号。代码部分需要基础 Python 与 NumPy；公式推导可独立阅读。",
  objectives: [
    "计算向量加法、数乘与内积",
    "用形状判断矩阵乘法是否成立并手算结果",
    "区分 NumPy 的 @ 与 *，识别一维数组和列向量的区别",
  ],
  sections: [
    {
      id: "vectors",
      title: "向量：一组有顺序的分量",
      navGroup: "vectors",
      navLabel: "向量",
      blocks: [
        {
          type: "paragraph",
          text: "本节讨论实数向量与矩阵。向量的分量有固定顺序；同维向量按对应位置相加，数乘则把每个分量乘上同一个标量。在二维坐标中，可以把向量画成从原点出发的箭头。分量列表与几何箭头是同一个向量的两种表示。",
        },
        {
          type: "math",
          latex:
            "u=\\begin{bmatrix}1\\\\2\\end{bmatrix},\\quad v=\\begin{bmatrix}3\\\\1\\end{bmatrix},\\qquad u+v=\\begin{bmatrix}4\\\\3\\end{bmatrix},\\quad 2u=\\begin{bmatrix}2\\\\4\\end{bmatrix}",
          explanation:
            "加法要求相同维度；结果仍是二维向量。数乘中的 2 是标量。",
        },
        {
          type: "image",
          src: "/learning/vector-addition.png",
          width: 1200,
          height: 700,
          mobile: {
            src: "/learning/vector-addition-mobile.png",
            width: 640,
            height: 720,
          },
          alt: "坐标图中 u 从原点指向 (1,2)，v 指向 (3,1)。将 v 平移到 u 的终点后，首尾相接得到 u+v=(4,3)。",
          caption:
            "平移不改变向量。沿 u 再沿 v，终点与直接沿 u+v 相同。坐标轴使用相同比例。",
        },
        { type: "heading", text: "内积的结果是标量" },
        {
          type: "math",
          latex:
            "u^{\\mathsf T}v=\\sum_{i=1}^{n}u_i v_i,\\qquad u^{\\mathsf T}v=1\\times3+2\\times1=5",
          explanation:
            "这里 u、v 写作 n×1 列向量；转置 uᵀ 为 1×n，乘积为 1×1，可视作标量。它不是逐元素相乘后保留向量。",
        },
      ],
    },
    {
      id: "matrices",
      title: "矩阵的形状是运算的前提",
      navGroup: "matrices",
      navLabel: "矩阵",
      blocks: [
        {
          type: "paragraph",
          text: "m×n 矩阵有 m 行、n 列，先行后列。A 的元素 aᵢⱼ 位于第 i 行、第 j 列。矩阵相加要求形状相同，对应元素相加；标量乘矩阵则逐元素缩放。转置会交换行列，因此 m×n 的 A 转置后为 n×m。",
        },
        {
          type: "math",
          latex:
            "A=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix},\\quad B=\\begin{bmatrix}2&0\\\\1&3\\end{bmatrix},\\quad A+B=\\begin{bmatrix}3&2\\\\1&4\\end{bmatrix},\\quad A^{\\mathsf T}=\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}",
          explanation:
            "A 与 B 均为 2×2，因此可以相加；转置不是把所有数倒序，而是将第 i 行第 j 列交换到第 j 行第 i 列。",
        },
        {
          type: "callout",
          title: "数学定义与数组广播要分清",
          text: "本节矩阵加法按线性代数定义要求形状相同。NumPy 还支持广播，可能让不同形状数组完成逐元素运算；那是数组库额外的规则，不能据此放宽矩阵乘法的内部维度条件。",
        },
      ],
    },
    {
      id: "multiply",
      title: "矩阵乘法：行与列的内积",
      navGroup: "matrices",
      navLabel: "矩阵",
      blocks: [
        {
          type: "math",
          latex:
            "A\\in\\mathbb{R}^{m\\times n},\\ B\\in\\mathbb{R}^{n\\times p}\\quad\\Longrightarrow\\quad C=AB\\in\\mathbb{R}^{m\\times p},\\qquad c_{ij}=\\sum_{k=1}^{n}a_{ik}b_{kj}",
          explanation:
            "内部维度 n 必须一致。结果的第 i 行第 j 列，是 A 第 i 行与 B 第 j 列的内积；结果形状取外侧的 m 与 p。",
        },
        {
          type: "paragraph",
          text: "用上一段的 A、B，乘积左上角为 1×2+2×1=4，右上角为 1×0+2×3=6。第二行同理得到 1 和 3。交换顺序后，计算使用的行、列都变了；即使两种顺序都合法，结果也通常不同。",
        },
        {
          type: "math",
          latex:
            "AB=\\begin{bmatrix}4&6\\\\1&3\\end{bmatrix}\\ne BA=\\begin{bmatrix}2&4\\\\1&5\\end{bmatrix},\\qquad Au=\\begin{bmatrix}5\\\\2\\end{bmatrix}",
          explanation:
            "矩阵乘法一般不满足交换律。A 乘列向量 u=(1,2)ᵀ，则每一行分别与 u 做内积，结果仍是列向量。",
        },
        {
          type: "callout",
          title: "先做形状检查，再做数值计算",
          text: "(2×3)(3×4) 可以相乘，结果为 2×4；(2×3)(2×3) 的内部维度 3 和 2 不同，矩阵乘法没有定义。可乘不要求两个矩阵同形，相加也不等于相乘。",
        },
      ],
    },
    {
      id: "code",
      title: "把公式与 NumPy 一一对应",
      navGroup: "code",
      navLabel: "代码",
      blocks: [
        {
          type: "paragraph",
          text: "使用 Python 3.10+，先安装 NumPy，再运行下载的 vector_matrix.py。对本例二维 ndarray，@ 是矩阵乘法，* 是逐元素乘法；不要用 * 代替公式中的 AB。脚本用明确整数结果和逐行逐列求和双重校验。",
        },
        {
          type: "code",
          filename: "vector_matrix.py",
          language: "python",
          code: vectorMatrixCode,
        },
        {
          type: "callout",
          title: "一维 ndarray 既不是行矩阵也不是列矩阵",
          text: "np.array([1,2]) 的 shape 是 (2,)，对它转置仍是 (2,)。u[:, None] 才显式得到 (2,1) 列向量。两个一维实数数组 u @ v 返回标量，而二维 A @ u 返回一维数组。比较公式与代码时，要把这层约定说清楚。",
        },
        {
          type: "paragraph",
          text: "核对输出：向量和为 [4,3]，2u 为 [2,4]，内积为 5；M @ N 为 [[4,5],[2,3]]。练习：手算 (M @ N) 的右上角 1×0+2×1+3×1=5，再改动 N 的一个元素，预测受影响的结果列。",
        },
      ],
    },
    {
      id: "quiz",
      title: "用维度和数值共同自查",
      navGroup: "quiz",
      navLabel: "练习",
      blocks: [
        {
          type: "quiz",
          id: "shape-check",
          question: "M 的形状为 2×3，N 的形状为 3×4，MN 的形状是什么？",
          options: ["2×4", "3×3", "2×3，结果总与左矩阵同形"],
          correct: 0,
          explanations: [
            "正确。内部维度 3 匹配，外侧维度 2 和 4 决定结果形状。",
            "3 是被求和的内部维度，不是结果的行列数。",
            "结果行数来自左矩阵，列数来自右矩阵，不必与左矩阵同形。",
          ],
        },
        {
          type: "quiz",
          id: "operator-check",
          question: "对本节二维 ndarray A、B，哪一种理解正确？",
          options: [
            "A * B 与 A @ B 永远相等",
            "A @ B 做矩阵乘法；A * B 做逐元素乘法",
            "u.T 会把 shape (2,) 自动变为 (2,1)",
          ],
          correct: 1,
          explanations: [
            "本例 A*B=[[2,0],[0,3]]，而 A@B=[[4,6],[1,3]]，二者不同。",
            "正确。二维数组的 @ 对应矩阵乘法；* 是数组的逐元素乘法。",
            "一维数组转置后形状不变。显式列向量可以使用 u[:, None] 或 reshape(2,1)。",
          ],
        },
      ],
    },
    {
      id: "summary",
      title: "把形状写在公式旁边",
      navGroup: "quiz",
      navLabel: "练习",
      blocks: [
        {
          type: "summary",
          points: [
            "向量加法与数乘按分量进行；内积将对应乘积求和，结果为标量。",
            "矩阵先行后列，相加需同形；转置交换行列。",
            "m×n 乘 n×p 得到 m×p，每个元素来自一行与一列的内积。",
            "矩阵乘法通常不可交换；NumPy 的 @、* 与一维形状约定要分别检查。",
          ],
        },
      ],
    },
  ],
  resources: resourcesForProgram("vector-matrix"),
  references: [
    {
      title: "NumPy 官方教程：数组的基本运算",
      href: "https://numpy.org/doc/stable/user/quickstart.html#basic-operations",
      note: "核对二维 ndarray 的逐元素乘法与矩阵乘法。",
    },
    {
      title: "NumPy matmul：形状与一维数组约定",
      href: "https://numpy.org/doc/stable/reference/generated/numpy.matmul.html",
      note: "核对 @ 的内部维度约束与一维输入的特殊处理。",
    },
  ],
});
