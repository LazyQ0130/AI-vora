def double(value):
    return value * 2

result = double(3)
print(result)

# 可选：结果与边界验证
assert result == 6
assert double(4) == 8
assert double(-2) == -4
