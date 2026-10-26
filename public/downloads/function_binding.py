def scale(value, factor):
    return value * factor

print(scale(3, 4))
print(scale(factor=4, value=3))

# 可选：结果与边界验证
assert scale(3, 4) == scale(factor=4, value=3) == 12
assert scale(2, factor=5) == 10
