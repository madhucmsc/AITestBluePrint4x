class Car:
    name=None
    model=None
    color=None
    def __init__(self, o_name, o_model, o_color):
        self.name=o_name
        self.model=o_model
        self.color=o_color

    def startEngine(self):
        print(f"{self.name} engine is starting")
        print(f"{self.name} model is {self.model}")
        print(f"{self.name} color is {self.color}")

lamborghini=Car("Lamborghini", "Aventador", "Yellow")
lamborghini.startEngine()
MGhero=Car("MG Hero", "MG 2024", "Red")
MGhero.startEngine()