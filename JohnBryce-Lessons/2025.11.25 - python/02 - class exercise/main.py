import helpers.count as count
from icecream import ic
# from flask import flask
import json


def welcomeMsg():
    print('welcome!')

file = open('requirements.txt')

if __name__ == '__main__':
    with open("demofile.txt", "a") as f:
        f.write('now the file as more content')
    f = open('demofile.txt')
    welcomeMsg()
    ic(count.countString('hello world'))
    ic(print(file.read()))