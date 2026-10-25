# Python 3.10+；仅使用标准库
def transform(value: float, scale: float = 2.0, *, shift: float = 0.0) -> float:
    """缩放后平移；shift 必须按关键字传入。"""
    return value * scale + shift


def append_item(item: str, items: list[str] | None = None) -> list[str]:
    # None 作为默认值；传入列表时也复制，避免修改调用者的数据
    result = [] if items is None else list(items)
    result.append(item)
    return result


default_result = transform(3)
keyword_result = transform(3, scale=4, shift=1)
named_result = transform(value=3, shift=-1)
print(default_result, keyword_result, named_result)
assert (default_result, keyword_result, named_result) == (6.0, 13, 5.0)

# 第三个位置实参不合法：shift 是仅限关键字参数
try:
    transform(3, 4, 1)
except TypeError:
    print("keyword-only: TypeError (expected)")
else:
    raise AssertionError("shift 必须拒绝位置传参")

first = append_item("A")
second = append_item("B")
original = ["start"]
copied = append_item("next", original)
assert first == ["A"] and second == ["B"]
assert copied == ["start", "next"] and original == ["start"]
assert first is not second
print(first, second, copied, original)

# 用局部示例观察“默认对象只创建一次”，不要把它当作安全写法
def shared_default_demo(item, items=[]):
    items.append(item)
    return items


shared_first = shared_default_demo("A")
shared_second = shared_default_demo("B")
assert shared_first is shared_second
assert shared_second == ["A", "B"]
print("shared default:", shared_second)
