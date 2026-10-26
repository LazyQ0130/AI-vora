import numpy as np

A = np.array([[1, 2], [0, 1]])
B = np.array([[2, 0], [1, 3]])
print(A @ B)

# 可选：结果与边界验证
expected = [[4, 6], [1, 3]]
manual = [[sum(int(A[i,k])*int(B[k,j]) for k in range(2)) for j in range(2)] for i in range(2)]
assert manual == expected
assert np.array_equal(A @ B, expected)
assert np.array_equal(B @ A, [[2, 4], [1, 5]])
