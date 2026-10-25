import { sampleCode } from "../sample";
import type { LearningResource } from "../models";

export const pythonFunctionsCode = `# Python 3.10+；仅使用标准库
def transform(value: float, scale: float = 2.0, *, shift: float = 0.0) -> float:
    """缩放后平移；shift 必须按关键字传入。"""
    return value * scale + shift


def append_item(item: str, items: list[str] | None = None) -> list[str]:
    # None 作为默认值；传入列表时也复制，避免修改调用者的数据
    result = [] if items is None else list(items)
    result.append(item)
    return result


default_result = transform(3)
keyword_result = transform(3, scale=4, shift=1)
named_result = transform(value=3, shift=-1)
print(default_result, keyword_result, named_result)
assert (default_result, keyword_result, named_result) == (6.0, 13, 5.0)

# 第三个位置实参不合法：shift 是仅限关键字参数
try:
    transform(3, 4, 1)
except TypeError:
    print("keyword-only: TypeError (expected)")
else:
    raise AssertionError("shift 必须拒绝位置传参")

first = append_item("A")
second = append_item("B")
original = ["start"]
copied = append_item("next", original)
assert first == ["A"] and second == ["B"]
assert copied == ["start", "next"] and original == ["start"]
assert first is not second
print(first, second, copied, original)

# 用局部示例观察“默认对象只创建一次”，不要把它当作安全写法
def shared_default_demo(item, items=[]):
    items.append(item)
    return items


shared_first = shared_default_demo("A")
shared_second = shared_default_demo("B")
assert shared_first is shared_second
assert shared_second == ["A", "B"]
print("shared default:", shared_second)
`;
export const vectorMatrixCode = `import numpy as np

# 一维数组不是默认列向量；需要时显式构造二维列向量
u = np.array([1, 2])
v = np.array([3, 1])
vector_sum = u + v
scaled = 2 * u
dot_product = u @ v
column = u[:, None]
assert u.shape == (2,) and u.T.shape == (2,)
assert column.shape == (2, 1)
assert np.array_equal(vector_sum, [4, 3])
assert np.array_equal(scaled, [2, 4])
assert dot_product == 5

A = np.array([[1, 2], [0, 1]])
B = np.array([[2, 0], [1, 3]])
AB, BA = A @ B, B @ A
elementwise = A * B
assert np.array_equal(AB, [[4, 6], [1, 3]])
assert np.array_equal(BA, [[2, 4], [1, 5]])
assert not np.array_equal(AB, BA)
assert np.array_equal(elementwise, [[2, 0], [0, 3]])
assert np.array_equal(A @ u, [5, 2])
assert np.array_equal((A @ B).T, B.T @ A.T)

M = np.array([[1, 2, 3], [0, 1, 2]])
N = np.array([[1, 0], [0, 1], [1, 1]])
product = M @ N
assert M.shape == (2, 3) and N.shape == (3, 2)
assert product.shape == (2, 2)
assert np.array_equal(product, [[4, 5], [2, 3]])

# 用逐行逐列求和做独立对照，不依赖另一次 @ 运算
manual = [[sum(int(M[i, k]) * int(N[k, j]) for k in range(3))
           for j in range(2)] for i in range(2)]
assert np.array_equal(product, manual)
try:
    M @ M  # (2, 3) @ (2, 3)：内部维度 3 和 2 不匹配
except ValueError:
    print("shape mismatch: ValueError (expected)")
else:
    raise AssertionError("不相容的矩阵形状必须报错")

print("sum:", vector_sum, "scaled:", scaled, "dot:", dot_product)
print("A @ B:\\n", AB, "\\nB @ A:\\n", BA)
print("A * B:\\n", elementwise, "\\nM @ N:\\n", product)
`;

export const programs = {
  "linear-regression": {
    filename: "linear_regression",
    title: "线性回归与梯度下降",
    code: sampleCode,
    environment: "Python 3.10+ · NumPy · 确定性合成数据",
  },
  "python-functions": {
    filename: "python_functions",
    title: "Python 函数与参数",
    code: pythonFunctionsCode,
    environment: "Python 3.10+ · 标准库即可",
  },
  "vector-matrix": {
    filename: "vector_matrix",
    title: "向量与矩阵的基本运算",
    code: vectorMatrixCode,
    environment: "Python 3.10+ · NumPy · 整数精确结果",
  },
} as const;
export function resourcesForProgram(
  id: keyof typeof programs,
): LearningResource[] {
  const program = programs[id];
  return [
    {
      id: `${id}-python`,
      title: "Python 源码",
      href: `/downloads/${program.filename}.py`,
      format: "Python",
      description: program.environment,
    },
    {
      id: `${id}-notebook`,
      title: "Notebook",
      href: `/downloads/${program.filename}.ipynb`,
      format: "Notebook",
      description: "与页面完整脚本同源，需在本地运行",
    },
  ];
}
