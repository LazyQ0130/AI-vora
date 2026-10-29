import { sampleCode } from "../sample";
import type { LearningResource } from "../models";
import { corePrograms, firstRunProgram, regressionStepCode } from "./core-programs";

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

export const lossComparisonCode = `# Python 3.10+；无第三方依赖，全部数值是合成刻度
targets = [1.0, 3.0, 5.0]
predictions = [2.0, 2.0, 2.0]  # w=0, b=2
assert len(targets) == len(predictions) and len(targets) > 0
errors = [prediction - target for prediction, target in zip(predictions, targets)]
n = len(errors)
mae = sum(abs(error) for error in errors) / n
mse = sum(error ** 2 for error in errors) / n
print("errors:", errors)
print(f"MAE={mae:.6f}, MSE={mse:.6f}")
assert errors == [1.0, -1.0, -3.0]
assert abs(mae - 5.0 / 3.0) < 1e-12
assert abs(mse - 11.0 / 3.0) < 1e-12
`;
export const gradientDescentCode = `import numpy as np


def validate_vectors(x, y):
    # 拒绝 (n, 1) 与 (n,) 意外广播成 (n, n)
    if x.ndim != 1 or y.ndim != 1 or x.shape != y.shape or x.size == 0:
        raise ValueError("x and y must be equal-length, nonempty 1-D arrays")
    if not np.isfinite(x).all() or not np.isfinite(y).all():
        raise ValueError("all input values must be finite")


# 与 4.3 手算完全相同的两个无量纲合成样本
x = np.array([1.0, 2.0])
y = np.array([3.0, 5.0])
validate_vectors(x, y)
w, b = 0.0, 0.0
learning_rate = 0.1
losses = [float(np.mean((w * x + b - y) ** 2))]
first_step = None

for step in range(2000):
${regressionStepCode.split("\n").map((line) => `    ${line}`).join("\n")}
    current_loss = float(np.mean((w * x + b - y) ** 2))
    if not np.isfinite(current_loss) or current_loss > 1e12:
        raise FloatingPointError("loss diverged; check learning rate and data scale")
    losses.append(current_loss)
    if step == 0:
        first_step = (float(w), float(b), current_loss)

final_loss = losses[-1]
print(f"initial MSE={losses[0]:.6f}")
print(f"first w={first_step[0]:.3f}, b={first_step[1]:.3f}, MSE={first_step[2]:.6f}")
print(f"final w={w:.6f}, b={b:.6f}, MSE={final_loss:.10f}")

# 第一轮核对手算；最后一轮核对独立的最小二乘解
assert np.allclose(first_step, [1.3, 0.8, 1.685], atol=1e-12, rtol=0)
design = np.column_stack((x, np.ones_like(x)))
reference, *_ = np.linalg.lstsq(design, y, rcond=None)
assert np.allclose([w, b], reference, atol=1e-7, rtol=0)
assert final_loss < 1e-10
assert np.isfinite(losses).all()
`;

export const programs = {
  ...Object.fromEntries(Object.entries(corePrograms).map(([id, sample]) => [id, {
    ...sample, code: sample.core + "\n# 可选：结果与边界验证\n" + sample.checks,
  }])) as unknown as Record<keyof typeof corePrograms, { filename: string; title: string; environment: string; code: string }>,
  "first-run": { ...firstRunProgram, code: firstRunProgram.core },
  "ml-losses": {
    filename: "ml_losses",
    title: "预测误差、MAE 与 MSE",
    code: lossComparisonCode,
    environment: "Python 3.10+ · 标准库 · 无量纲合成刻度",
  },
  "ml-gradient-descent": {
    filename: "ml_gradient_descent",
    title: "使用 NumPy 实现线性回归",
    code: gradientDescentCode,
    environment: "Python 3.10+ · NumPy · 与 4.3 相同的两个合成样本",
  },
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
