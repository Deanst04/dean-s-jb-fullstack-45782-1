import json
import sys
from enum import Enum


class Actions(Enum):
    ADD = 1
    KILL = 2
    UPDATE = 3
    DISPLAY = 4
    EXIT = 5


# contacts=[{'age':20,'name':'aaa'},{'age':20,'name':'aaa'}]


def display_menu():
    for item in Actions:
        print(f"{item.value}  - {item.name}")
    user_selection = Actions(int(input("Select from the menu...")))
    return user_selection


def add_contact(file):
    first_name = input("Your name?")
    last_name = input("Your last name?")
    file.append({"first": first_name, "last": last_name})
    with open("contacts.json", "w") as f:
        json.dump(file, f, indent=4)


def display_contact(file):
    print("contacts: ")
    for i, c in enumerate(file):
        print(f"user {i + 1}: {c['first']} {c['last']}")


def update_contact(file):
    for i, c in enumerate(file):
        print(f"user {i + 1}: {c}")
    user_to_update = int(input("which user you want to update? "))
    what_to_change = input(
        "do you want to change? enter 'first' for first name, 'last' for last name: "
    )
    val_to_change = input("enter the replacement value: ")
    file[user_to_update - 1][what_to_change] = val_to_change
    with open("contacts.json", "w") as f:
        json.dump(file, f, indent=4)


def kill_contact(file):
    for i, c in enumerate(file):
        print(f"user {i + 1}: {c}")
    user_to_kill = int(input("which user you want to kill? "))
    file.pop(user_to_kill - 1)
    with open("contacts.json", "w") as f:
        json.dump(file, f, indent=4)


def exit_menu(file):
    with open("contacts.json", "w") as f:
        json.dump(file, f, indent=4)
    sys.exit()


if __name__ == "__main__":
    with open("contacts.json") as f:
        contacts = json.load(f)
    while True:
        user_selection = display_menu()
        if user_selection == Actions.ADD:
            add_contact(contacts)
        if user_selection == Actions.UPDATE:
            update_contact(contacts)
        if user_selection == Actions.KILL:
            kill_contact(contacts)
        if user_selection == Actions.DISPLAY:
            display_contact(contacts)
        if user_selection == Actions.EXIT:
            exit_menu(contacts)
