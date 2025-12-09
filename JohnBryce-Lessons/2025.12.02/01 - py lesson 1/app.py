from enum import Enum
import json
import os


class Actions(Enum):
    ADD = 1
    KILL = 2
    UPDATE = 3
    DISPLAY = 4
    EXIT = 5


contacts = []


def display_menu():
    for item in Actions:
        print(f"{item.value} - {item.name}")
    return Actions(int(input("select from the menu...")))

    # print("1. Add new contact")
    # print("2. kill a contact")
    # print("3. update contact")
    # print("4. display all contacts")


def add_contact():
    first_name = input("your name?")
    last_name = input("your last name?")
    contacts.append({"first": first_name, "last": last_name})


def display_contact():
    print(contacts)


# def update_contact():


if __name__ == "__main__":
    if not os.path.exists("contacts.json"):
        with open("contacts.json", "w") as f:
            json.dump([], f)

        with open("contacts.json", "r") as f:
            contacts = json.load(f)
    while True:
        user_selection = display_menu()
        if user_selection == Actions.ADD:
            add_contact()
        if user_selection == Actions.KILL:
            print("kill...")
        if user_selection == Actions.DISPLAY:
            display_contact()
        if user_selection == Actions.UPDATE:
            print("update...")
        if user_selection == Actions.EXIT:
            with open("contacts.json", "w") as f:
                json.dump(contacts, f, indent=4)
            exit()
