import numpy as np

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
print("A @ B:\n", AB, "\nB @ A:\n", BA)
print("A * B:\n", elementwise, "\nM @ N:\n", product)
