
from abc import ABC, abstractmethod

class Father(ABC):

    def __init__(self,name):
        self.name=name
    @abstractmethod
    def loan(self):
        pass

class Madhu(Father):

    def loan(self):
        print("Loan!")

ma=Madhu("Madhusudan")
ma.loan()
