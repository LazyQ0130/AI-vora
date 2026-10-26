// 正文与完整下载共用核心源码；验证语句只在完整版追加。
export const corePrograms = {
  "function-basics": {
    filename: "function_basics", title: "定义和调用函数", environment: "Python 3.10+ · 标准库",
    core: `def double(value):
    return value * 2

result = double(3)
print(result)
`,
    checks: `assert result == 6
assert double(4) == 8
assert double(-2) == -4
`,
  },
  "function-binding": {
    filename: "function_binding", title: "位置与关键字绑定", environment: "Python 3.10+ · 标准库",
    core: `def scale(value, factor):
    return value * factor

print(scale(3, 4))
print(scale(factor=4, value=3))
`,
    checks: `assert scale(3, 4) == scale(factor=4, value=3) == 12
assert scale(2, factor=5) == 10
`,
  },
  "function-return": {
    filename: "function_return", title: "返回值与显示", environment: "Python 3.10+ · 标准库",
    core: `def add_one(value):
    return value + 1

def show_one(value):
    print(value + 1)

result = add_one(3)
shown = show_one(3)
print(result, shown)
`,
    checks: `assert result == 4 and shown is None
assert add_one(add_one(3)) == 5
`,
  },
  "function-scope": {
    filename: "function_scope", title: "局部变量", environment: "Python 3.10+ · 标准库",
    core: `value = 10

def add_two(value):
    result = value + 2
    return result

print(add_two(3))
print(value)
`,
    checks: `assert value == 10
assert add_two(3) == 5
assert "result" not in globals()
`,
  },
  "function-defaults": {
    filename: "function_defaults", title: "简单默认参数", environment: "Python 3.10+ · 标准库",
    core: `def scale(value, factor=2):
    return value * factor

print(scale(3))
print(scale(3, factor=4))
`,
    checks: `assert scale(3) == 6
assert scale(3, 4) == 12
assert scale(3, factor=0) == 0
`,
  },
  "vector-basics": {
    filename: "vector_basics", title: "向量加法与数乘", environment: "Python 3.10+ · 标准库",
    core: `u = [1, 2]
v = [3, 1]
vector_sum = [u[0] + v[0], u[1] + v[1]]
scaled = [2 * u[0], 2 * u[1]]
print(vector_sum, scaled)
`,
    checks: `assert vector_sum == [4, 3]
assert scaled == [2, 4]
`,
  },
  "vector-dot": {
    filename: "vector_dot", title: "内积与求和符号", environment: "Python 3.10+ · 标准库",
    core: `u = [1, 2]
v = [3, 1]
dot = u[0] * v[0] + u[1] * v[1]
print(dot)
`,
    checks: `assert dot == 5
assert dot == sum(a * b for a, b in zip(u, v))
`,
  },
  "matrix-shape": {
    filename: "matrix_shape", title: "矩阵形状与转置", environment: "Python 3.10+ · 标准库",
    core: `A = [[1, 2, 3], [4, 5, 6]]
transpose = [[A[0][j], A[1][j]] for j in range(3)]
print(transpose)
`,
    checks: `assert len(A) == 2 and len(A[0]) == 3
assert transpose == [[1, 4], [2, 5], [3, 6]]
assert [list(row) for row in zip(*transpose)] == A
`,
  },
  "matrix-product": {
    filename: "matrix_product", title: "逐格计算矩阵乘法", environment: "Python 3.10+ · NumPy（先 python -m pip install numpy）",
    core: `import numpy as np

A = np.array([[1, 2], [0, 1]])
B = np.array([[2, 0], [1, 3]])
print(A @ B)
`,
    checks: `expected = [[4, 6], [1, 3]]
manual = [[sum(int(A[i,k])*int(B[k,j]) for k in range(2)) for j in range(2)] for i in range(2)]
assert manual == expected
assert np.array_equal(A @ B, expected)
assert np.array_equal(B @ A, [[2, 4], [1, 5]])
`,
  },
  "numpy-shapes": {
    filename: "numpy_shapes", title: "NumPy 数组形状", environment: "Python 3.10+ · NumPy（先 python -m pip install numpy）",
    core: `import numpy as np

u = np.array([1, 2])
column = u.reshape(2, 1)
print(u.shape, u.T.shape)
print(column.shape, column.T.shape)
print(u @ np.array([3, 1]))
`,
    checks: `assert u.shape == u.T.shape == (2,)
assert column.shape == (2, 1) and column.T.shape == (1, 2)
assert u @ np.array([3, 1]) == 5
`,
  },
} as const;

// 同一更新核嵌入主代码与完整脚本，避免两个实现逐渐分叉。
// 手算课只呈现计算链；同一核心片段也嵌入可选的完整断言复核。
export const manualUpdateCoreCode = `xs, ys = [1.0, 2.0], [3.0, 5.0]
w, b, rate = 0.0, 0.0, 0.1
errors = [w * x + b - y for x, y in zip(xs, ys)]
old_loss = sum(e ** 2 for e in errors) / len(xs)
dw = 2 * sum(e * x for e, x in zip(errors, xs)) / len(xs)
db = 2 * sum(errors) / len(xs)
w, b = w - rate * dw, b - rate * db
new_errors = [w * x + b - y for x, y in zip(xs, ys)]
new_loss = sum(e ** 2 for e in new_errors) / len(xs)
print(dw, db, round(w, 3), round(b, 3), round(new_loss, 6))
`;
export const manualUpdateChecks = `assert old_loss == 17.0
for actual, expected in zip([dw, db, w, b, new_loss], [-13, -8, 1.3, 0.8, 1.685]):
    assert abs(actual - expected) < 1e-12
`;

export const regressionStepCode = `prediction = w * x + b
error = prediction - y
dw = 2.0 * np.mean(error * x)
db = 2.0 * np.mean(error)
w, b = w - learning_rate * dw, b - learning_rate * db`;
export const regressionCoreCode = `import numpy as np

x = np.array([1.0, 2.0])
y = np.array([3.0, 5.0])
w, b = 0.0, 0.0
learning_rate = 0.1

for step in range(2000):
${regressionStepCode.split("\n").map((line) => `    ${line}`).join("\n")}
    if step == 0:
        print(f"first w={w:.3f}, b={b:.3f}")

final_loss = float(np.mean((w * x + b - y) ** 2))
print(f"final w={w:.6f}, b={b:.6f}, MSE={final_loss:.10f}")
`;
