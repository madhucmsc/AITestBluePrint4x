class Person:
    name=None
    age=None
    role=None
    phone=None
    def __init__(self):
        print("Lets take the user input for the person class")
        self.name=input("Enter the name of the person: ")
        self.age=input("Enter the age of the person: ")
        self.role=input("Enter the role of the person: ")
        self.phone=input("Enter the phone number of the person: ")

    def display(self):
        print(f"Name: {self.name}")
        print(f"Age: {self.age}")
        print(f"Role: {self.role}")
        print(f"Phone: {self.phone}")
cmsc=Person()
cmsc.display()