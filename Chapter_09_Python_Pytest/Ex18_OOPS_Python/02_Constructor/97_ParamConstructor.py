class Dog:
    name = None
    breed = None
    height = None
    weight = None
    def __init__(self,name,breed,height,weight):
        print("parameterized constructor is called")
        self.name=name
        self.breed=breed
        self.height=height
        self.weight=weight
    def bark(self):
        print("Barking")
        print(f"{self.name} is barking")
    def talk(self):
        print("Talking")
        print(f"{self.name} is talking")
dog1=Dog("Chow Chow","Chow Chow",20,50)
dog1.bark()

