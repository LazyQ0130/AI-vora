"""作者侧真实Jupyter消息取证；不作为学生语法先修。"""
import datetime
import importlib.metadata
import json
import os
from pathlib import Path
import re
import sys

import nbformat
from jupyter_client import KernelManager

payload = json.load(sys.stdin)
cwd = Path(payload["cwd"])
notebook = nbformat.from_dict(payload["notebook"])
nbformat.validate(notebook)
file = cwd / "review-note.ipynb"
nbformat.write(notebook, file)
notebook = nbformat.read(file, as_version=4)
steps = [{"operation": "open-new-exercise-file", "filename": file.name, "formatValid": True}]
manager = KernelManager(kernel_name="python3")
manager.start_kernel(cwd=str(cwd))
client = manager.client()
client.start_channels()
client.wait_for_ready(timeout=60)


def run(label, source, expected=None, error=None):
    message_id = client.execute(source)
    outputs, statuses = [], []
    execution_count = None
    while True:
        message = client.get_iopub_msg(timeout=60)
        if message.get("parent_header", {}).get("msg_id") != message_id:
            continue
        kind, content = message["msg_type"], message["content"]
        if kind == "stream":
            outputs.append(nbformat.v4.new_output("stream", name=content["name"], text=content["text"]))
        elif kind == "error":
            outputs.append(nbformat.v4.new_output("error", ename=content["ename"], evalue=content["evalue"], traceback=[re.sub(r"\x1b\[[0-9;]*m", "", line) for line in content["traceback"]]))
        elif kind == "execute_input":
            execution_count = content["execution_count"]
        elif kind == "status":
            statuses.append(content["execution_state"])
            if content["execution_state"] == "idle":
                break
    errors = [out for out in outputs if out.output_type == "error"]
    stdout = "".join(out.text for out in outputs if out.output_type == "stream" and out.name == "stdout")
    if error:
        assert len(errors) == 1 and errors[0].ename == error, errors
        assert "batch_label" in errors[0].evalue, errors
    else:
        assert not errors, errors
    if expected is not None:
        assert stdout.replace("\r\n", "\n") == expected, (label, stdout)
    steps.append({"label": label, "source": source, "outputs": outputs, "statuses": statuses, "executionCount": execution_count})
    return stdout, outputs, execution_count


def restart(label):
    global client
    client.stop_channels()
    manager.restart_kernel(now=False)
    client = manager.client()
    client.start_channels()
    client.wait_for_ready(timeout=60)
    steps.append({"label": label, "operation": "restart_kernel", "clean": True})


try:
    identity = run("actual-kernel-identity", payload["code"]["kernelProbe"])[0].strip()
    assert os.path.normcase(identity) == os.path.normcase(sys.executable), identity
    restart("clean-before-deliberate-disorder")
    run("first-display-real-error", notebook.cells[2].source, "", "NameError")
    run("restore-provider", notebook.cells[1].source, "")
    run("restore-display", notebook.cells[2].source, "Checked F3\n")
    for phase in ["restart-and-run-all", "save-reopen-and-restart-run-all"]:
        if phase.startswith("save"):
            notebook = nbformat.read(file, as_version=4)
            nbformat.validate(notebook)
            steps.append({"operation": "reopen-saved-file", "savedOutputIsNotExecutionProof": True})
        restart(phase)
        # 再次故障取证证明新内核未保留名字，不只依赖执行计数。
        run(phase + ":verify-cleared-name", notebook.cells[2].source, "", "NameError")
        restart(phase + ":fresh-after-state-proof")
        for cell in notebook.cells:
            if cell.cell_type == "code":
                expected = "Checked F3\n" if cell.id == "show-label" else "" if cell.id == "set-label" else None
                stdout, cell.outputs, cell.execution_count = run(phase + ":" + cell.id, cell.source, expected)
                if cell.id == "kernel-probe":
                    assert os.path.normcase(stdout.strip()) == os.path.normcase(sys.executable)
        nbformat.write(notebook, file)
        reopened = nbformat.read(file, as_version=4)
        nbformat.validate(reopened)
        assert reopened.cells[2].outputs[0].text == "Checked F3\n"
        assert all(not any(out.output_type == "error" for out in c.outputs) for c in reopened.cells if c.cell_type == "code")
        steps.append({"operation": "saved-and-reread", "filename": file.name, "formatValid": True, "finalErrorOutputs": 0})
finally:
    client.stop_channels()
    manager.shutdown_kernel(now=False)

report = {"checkedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "python": sys.version.split()[0], "packages": {name: importlib.metadata.version(name) for name in ["notebook", "ipykernel", "jupyter_client", "nbformat"]}, "kernelInterpreter": identity, "steps": steps, "savedNotebook": notebook, "kernelShutdown": not manager.is_alive(), "scope": "真实jupyter_client/IPython内核与磁盘文件；非GUI、同伴或跨机器试学"}


def redact(value):
    if isinstance(value, str):
        return value.replace(str(cwd), "<P5-LAB>/notebook-lab").replace(str(Path.home()), "<USER>")
    if isinstance(value, dict):
        return {key: redact(item) for key, item in value.items()}
    if isinstance(value, list):
        return [redact(item) for item in value]
    return value


print(json.dumps(redact(report), ensure_ascii=False, indent=2))
