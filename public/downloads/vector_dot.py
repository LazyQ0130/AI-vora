u = [1, 2]
v = [3, 1]
dot = u[0] * v[0] + u[1] * v[1]
print(dot)

# 可选：结果与边界验证
assert dot == 5
assert dot == sum(a * b for a, b in zip(u, v))
