def scale(value, factor=2):
    return value * factor

print(scale(3))
print(scale(3, factor=4))

# 可选：结果与边界验证
assert scale(3) == 6
assert scale(3, 4) == 12
assert scale(3, factor=0) == 0
