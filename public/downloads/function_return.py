def add_one(value):
    return value + 1

def show_one(value):
    print(value + 1)

result = add_one(3)
shown = show_one(3)
print(result, shown)

# 可选：结果与边界验证
assert result == 4 and shown is None
assert add_one(add_one(3)) == 5
