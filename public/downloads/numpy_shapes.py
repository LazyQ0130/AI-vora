import numpy as np

u = np.array([1, 2])
column = u.reshape(2, 1)
print(u.shape, u.T.shape)
print(column.shape, column.T.shape)
print(u @ np.array([3, 1]))

# 可选：结果与边界验证
assert u.shape == u.T.shape == (2,)
assert column.shape == (2, 1) and column.T.shape == (1, 2)
assert u @ np.array([3, 1]) == 5
