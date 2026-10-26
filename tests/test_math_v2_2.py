"""新向量课的独立数学对照：核心例题、开放题和几何关系。"""
from fractions import Fraction as F
import unittest

class VectorLessonTests(unittest.TestCase):
    def test_displacement_and_translation(self):
        delta=lambda a,b:tuple(y-x for x,y in zip(a,b))
        self.assertEqual(delta((0,0),(3,2)),delta((1,1),(4,3)))
        self.assertEqual(delta((3,2),(0,0)),(-3,-2))
        self.assertEqual(delta((5,-1),(7,2)),(2,3))
        self.assertEqual(delta((1,1),(7,5)),(6,4))

    def test_addition_hand_exercises_and_units(self):
        cases=[((3,2),(-1,1),(2,3)),((-2,3),(4,-1),(2,2)),((2,-1),(-3,4),(-1,3))]
        for a,b,expected in cases:
            self.assertEqual(tuple(x+y for x,y in zip(a,b)),expected)
            self.assertEqual(tuple(y+x for x,y in zip(a,b)),expected)
        # 按北、东给出的厘米记录，先换序再换成米。
        north,east=100,-200
        converted=(F(east,100),F(north,100))
        self.assertEqual(tuple(x+y for x,y in zip((1,2),converted)),(-1,3))

    def test_scalar_values_and_geometry(self):
        u=(F(3),F(2))
        for c in [F(-2),F(-1),F(0),F(1,2),F(2),F(3)]:
            result=tuple(c*x for x in u)
            self.assertEqual(sum(x*x for x in result),c*c*sum(x*x for x in u))
            self.assertEqual(u[0]*result[1]-u[1]*result[0],0)
            dot=sum(x*y for x,y in zip(u,result))
            self.assertEqual((dot>0)-(dot<0),(c>0)-(c<0))
        a=(2,-1)
        self.assertEqual(tuple(3*x for x in a),(6,-3))
        self.assertEqual(tuple(F(-1,2)*x for x in a),(-1,F(1,2)))

    def test_one_scalar_and_distributivity(self):
        self.assertNotEqual(F(6,3),F(2,2))  # (6,2) 无统一倍数
        self.assertEqual(tuple(-2*x for x in (3,2)),(-6,-4))
        for c in range(-5,6): self.assertNotEqual((c*0,c*2),(1,4))
        a,b,c=(2,-1),(-1,3),2
        left=tuple(c*(x+y) for x,y in zip(a,b))
        right=tuple(c*x+c*y for x,y in zip(a,b))
        self.assertEqual(left,right);self.assertEqual(left,(2,4))

if __name__=="__main__": unittest.main()
