u = [1, 2]
v = [3, 1]
vector_sum = [u[0] + v[0], u[1] + v[1]]
scaled = [2 * u[0], 2 * u[1]]
print(vector_sum, scaled)

# 可选：结果与边界验证
assert vector_sum == [4, 3]
assert scaled == [2, 4]
