"""制作阶段真实IPython内核校验；不在学生教材中引入客户端/自动化知识。"""
import json
import os
import sys
from pathlib import Path
from jupyter_client import KernelManager
import nbformat

payload = json.load(sys.stdin)
steps = []
manager = KernelManager(kernel_name="python3")
manager.start_kernel(cwd=payload["cwd"])
client = manager.client()
client.start_channels()
client.wait_for_ready(timeout=60)

def run(label, code, expected=None, error=None):
    message_id = client.execute(code)
    stdout, errors = "", []
    while True:
        message = client.get_iopub_msg(timeout=60)
        if message.get("parent_header", {}).get("msg_id") != message_id:
            continue
        kind, content = message["msg_type"], message["content"]
        if kind == "stream":
            stdout += content["text"]
        elif kind == "error":
            errors.append({"name": content["ename"], "value": content["evalue"]})
        elif kind == "status" and content["execution_state"] == "idle":
            break
    if error:
        assert len(errors) == 1 and errors[0]["name"] == error, errors
    else:
        assert not errors, errors
    if expected is not None:
        assert stdout.replace("\r\n", "\n") == expected, (label, stdout, expected)
    steps.append({"label": label, "source": code, "stdout": stdout, "errors": errors})
    return stdout

def restart(label):
    global client
    client.stop_channels()
    manager.restart_kernel(now=False)
    client = manager.client()
    client.start_channels()
    client.wait_for_ready(timeout=60)
    steps.append({"label": label, "operation": "restart_kernel", "clean": True})

def save_reopen_clean(label, define, show, expected):
    file = Path(payload["cwd"]) / (label + ".ipynb")
    notebook = nbformat.v4.new_notebook(cells=[nbformat.v4.new_markdown_cell("独立练习制作核验"), *(nbformat.v4.new_code_cell(source) for source in [define, show, codes["kernelProbe"]])])
    nbformat.write(notebook, file)
    reopened = nbformat.read(file, as_version=4)
    nbformat.validate(reopened)
    steps.append({"label": label, "operation": "save-reopen-file", "filename": file.name, "formatValid": True})
    restart(label + "-fresh")
    run(label + "-define", reopened.cells[1].source, "")
    run(label + "-show", reopened.cells[2].source, expected)
    observed = run(label + "-identity", reopened.cells[3].source).strip()
    assert os.path.normcase(os.path.realpath(observed)) == os.path.normcase(os.path.realpath(sys.executable))

try:
    codes = payload["code"]
    actual = run("kernel-identity", codes["kernelProbe"]).strip()
    assert os.path.normcase(os.path.realpath(actual)) == os.path.normcase(os.path.realpath(sys.executable)), actual
    run("draft-assignment-no-output", codes["setDraft"], "")
    run("draft-display", codes["showMarker"], "Draft A\n")
    steps.append({"label": "edited-not-executed", "sourceOnScreen": codes["setReady"], "operation": "edit-text-only"})
    run("still-old-state", codes["showMarker"], "Draft A\n")
    run("ready-assignment-no-output", codes["setReady"], "")
    run("ready-display", codes["showMarker"], "Ready B\n")
    restart("restart-before-wrong-order")
    run("wrong-order-name-error", codes["showMarker"], "", "NameError")
    run("recover-assignment", codes["setReady"], "")
    run("recover-display", codes["showMarker"], "Ready B\n")
    for document in payload["documents"]:
        notebook = nbformat.from_dict(document["notebook"])
        nbformat.validate(notebook)
        restart("clean-run-" + document["filename"])
        for cell in notebook.cells:
            if cell.cell_type == "code":
                run(document["filename"] + "/" + cell.id, cell.source)
        expected = "Ready B\n" if document["filename"] == "first-notebook" else "Packed C7\n"
        assert steps[-2]["stdout"] == expected
    restart("exercise-fresh-error")
    run("delivery-wrong-order", codes["showDelivery"], "", "NameError")
    run("delivery-repair-define", codes["setDelivery"], "")
    run("delivery-repair-show", codes["showDelivery"], "Packed C7\n")
    variant = codes["setDelivery"].replace('"Packed C7"', '"Packed New E6"')
    steps.append({"label": "delivery-text-edited-not-executed", "operation": "edit-text-only", "sourceOnScreen": variant})
    run("delivery-still-old-state", codes["showDelivery"], "Packed C7\n")
    run("delivery-new-assignment", variant, "")
    run("delivery-new-display", codes["showDelivery"], "Packed New E6\n")
    save_reopen_clean("exercise-verification-delivery", variant, codes["showDelivery"], "Packed New E6\n")
    restart("independent-own-exercise")
    run("own-define", 'plan_text = "Sketch D8"', "")
    run("own-display", 'print(plan_text)', "Sketch D8\n")
    save_reopen_clean("exercise-verification-own", 'plan_text = "Sketch D8"', 'print(plan_text)', "Sketch D8\n")
finally:
    client.stop_channels()
    manager.shutdown_kernel(now=False)

lab = str(Path(payload["cwd"]))
raw = json.dumps({"checkedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(), "python": sys.version.split()[0], "kernelInterpreter": actual, "steps": steps, "kernelShutdown": not manager.is_alive(), "scope": "真实jupyter_client/IPython内核；不是GUI证据，文本编辑步骤为驱动计划。"}, ensure_ascii=False, indent=2)
raw = raw.replace(lab.replace("\\", "\\\\"), "<NOTEBOOK_LAB>").replace(str(Path.home()).replace("\\", "\\\\"), "<USER>")
print(raw)
