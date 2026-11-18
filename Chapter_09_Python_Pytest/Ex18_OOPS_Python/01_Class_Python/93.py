class Dog:

    name=None
    breed=None
    color=None
    height=None
    weight=None

    def bark(self):
        print("Barking")
        print(f"{self.name} is barking")

    def talk(self):
        print("Talking")
        print(f"{self.name} is talking")

chow=Dog()
chow.name="Chow Chow"
chow.breed="Chow Chow"
chow.color="Brown"
chow.height=20
chow.weight=50
Dog.bark(chow)
Dog.talk(chow)
