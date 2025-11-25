import count
from icecream import ic

def welcomeMsg():
    print('welcome')

if __name__ == '__main__':
    welcomeMsg()
    ic(count.countString('hello world'))