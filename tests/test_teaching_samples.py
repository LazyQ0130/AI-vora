"""独立核对新增样章的可执行行为、形状、手算结果与 Notebook 一致性。"""
import json
import runpy
import unittest
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]

class TeachingSampleTests(unittest.TestCase):
    def test_python_binding_and_return(self):
        s = runpy.run_path(str(ROOT / "public/downloads/python_functions.py"))
        transform = s["transform"]
        self.assertEqual(transform(3, shift=1), 7)
        self.assertEqual(transform(3, scale=4, shift=1), 13)
        with self.assertRaises(TypeError):
            transform(3, 4, 1)
        with self.assertRaises(TypeError):
            transform(3, value=4)

    def test_defaults_and_mutation_contract(self):
        s = runpy.run_path(str(ROOT / "public/downloads/python_functions.py"))
        append = s["append_item"]
        self.assertEqual(append("x"), ["x"])
        self.assertEqual(append("y"), ["y"])
        original = ["before"]
        self.assertEqual(append("after", original), ["before", "after"])
        self.assertEqual(original, ["before"])
        self.assertIs(s["shared_first"], s["shared_second"])
        self.assertEqual(s["shared_first"], ["A", "B"])

    def test_matrix_values_and_shapes(self):
        s = runpy.run_path(str(ROOT / "public/downloads/vector_matrix.py"))
        np.testing.assert_array_equal(s["A"] + s["B"], [[3, 2], [1, 4]])
        np.testing.assert_array_equal(s["A"].T, [[1, 0], [2, 1]])
        np.testing.assert_array_equal(s["product"], [[4, 5], [2, 3]])
        self.assertEqual(s["dot_product"], 5)
        self.assertEqual((np.ones((2, 3)) @ np.ones((3, 4))).shape, (2, 4))
        self.assertEqual(s["column"].shape, (2, 1))
        self.assertEqual(s["u"].T.shape, (2,))
        with self.assertRaises(ValueError):
            s["M"] @ s["M"]

    def test_new_notebooks_execute_and_match_scripts(self):
        for filename in ("python_functions", "vector_matrix"):
            with self.subTest(filename=filename):
                source = (ROOT / f"public/downloads/{filename}.py").read_text(encoding="utf-8")
                notebook = json.loads((ROOT / f"public/downloads/{filename}.ipynb").read_text(encoding="utf-8"))
                code = "".join(notebook["cells"][1]["source"])
                self.assertEqual(code, source)
                scope = {}
                exec(compile(code, f"{filename}.ipynb", "exec"), scope)
                self.assertEqual(notebook["cells"][1]["outputs"], [])
                self.assertIsNone(notebook["cells"][1]["execution_count"])

if __name__ == "__main__":
    unittest.main()
