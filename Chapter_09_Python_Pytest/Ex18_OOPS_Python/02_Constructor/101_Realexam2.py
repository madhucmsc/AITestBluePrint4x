class Bobby:
    name=None
    def __init__(self, nameGiven):
        self.name=nameGiven
    
    def printName(self):
        print(f"My name is {self.name}")

Booby=Bobby("Bobby")
Booby.printName()
b2=Bobby("Bobby2")
b2.printName()
