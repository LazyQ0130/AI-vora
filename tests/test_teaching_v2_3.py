"""精修涉及的数值与新答案独立核对；不评价真实教学效果。"""
from fractions import Fraction as F
import unittest

class EditingMathTests(unittest.TestCase):
    def test_components_dimensions_and_directions(self):
        a, b = (4, 0), (4, 0, 0)
        self.assertEqual((len(a), a[0], a[1]), (2, 4, 0))
        self.assertEqual(len(b), 3)
        east_north = [(0, 3), (2, -1), (-2, 3)]
        self.assertEqual([(x > 0, x < 0, y > 0, y < 0) for x, y in east_north],
                         [(False, False, True, False), (True, False, False, True), (False, True, True, False)])

    def test_explicit_ordered_ratio_and_similar_triangle(self):
        east, north = F(3), F(2)
        self.assertEqual(F(east, north), F(3, 2))
        for factor in [F(1, 2), F(2)]:
            x, y = factor * east, factor * north
            self.assertEqual(x / y, F(3, 2))
            self.assertEqual(x*x + y*y, factor*factor*(east*east + north*north))
        self.assertEqual((2*east, 2*north), (6, 4))

    def test_added_calculations_and_unit_conversion(self):
        self.assertEqual(tuple(x+y for x, y in zip((1, 2, 0), (3, -1, 4))), (4, 1, 4))
        self.assertEqual(F(1) + F(50, 100), F(3, 2))
        self.assertEqual(3+3, 6)  # 往返路程
        self.assertEqual(3-3, 0)  # 东西方向的整体位移

    def test_scaling_error_analysis_and_new_length_answer(self):
        u = (3, 2)
        self.assertEqual(tuple(2*x for x in u), (6, 4))
        self.assertEqual(tuple(x+2 for x in u), (5, 4))
        self.assertNotEqual((2*u[0], u[1]), tuple(2*x for x in u))
        self.assertEqual(F(5)*abs(F(-2)), 10)
        self.assertEqual(tuple(2*x for x in (1, -2, 0)), (2, -4, 0))

if __name__ == "__main__":
    unittest.main()
