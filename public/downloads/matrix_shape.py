A = [[1, 2, 3], [4, 5, 6]]
transpose = [[A[0][j], A[1][j]] for j in range(3)]
print(transpose)

# 可选：结果与边界验证
assert len(A) == 2 and len(A[0]) == 3
assert transpose == [[1, 4], [2, 5], [3, 6]]
assert [list(row) for row in zip(*transpose)] == A
