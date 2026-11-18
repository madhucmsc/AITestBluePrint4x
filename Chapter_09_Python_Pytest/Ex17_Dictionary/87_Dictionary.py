my_dict = {
    "name": "madhu",
    "age": 30,
    "Sex": "male",
    "role": "QA"
    }
print(my_dict)
print(my_dict["name"])
print(my_dict["role"])

my_dict["role"]="Sdet"
print(my_dict)

del my_dict["Sex"]
print(my_dict)


for key,value in my_dict.items():
    print(key,value)