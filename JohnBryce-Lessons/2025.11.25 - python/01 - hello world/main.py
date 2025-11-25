import hello
import baga
import module1
import module2
from icecream import ic

def ggg():
    print('gggggggggggg')

if __name__ == '__main__':
    ic(hello.mult(3, 2))
    ic(baga.div(6, 3))
    ic(module1.add(6, 4), "from module1")
    ic(module2.sub(10, 3), "from module2")
    ggg()