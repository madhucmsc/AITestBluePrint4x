class Dog:
    name=None
    breed=None
    def __init__(self,nameGiven):
        self.name=nameGiven
        self.breed="Dog Breed"

chow=Dog("Bobby")
bow=Dog("Bow")

print(chow.name)
print(bow.name)
        
