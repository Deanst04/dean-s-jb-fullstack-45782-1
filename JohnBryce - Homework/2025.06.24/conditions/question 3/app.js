const age = +prompt("please enter your age")

alert(`${age >= 17 ? "you can get a driving license" : `you have to wait ${17 - age} years to get a driving license`}`)