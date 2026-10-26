value = 10

def add_two(value):
    result = value + 2
    return result

print(add_two(3))
print(value)

# 可选：结果与边界验证
assert value == 10
assert add_two(3) == 5
assert "result" not in globals()
