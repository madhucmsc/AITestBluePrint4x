class Father1:
    def Money(self):
        print("F1 Money")

class Father2:
    def Money(self):
        print("F2 Money")

#Method resoultion order(MRO)
class Child(Father1,Father2):
    def self_money(self):
        self.Money()
        print("child money")

c=Child()
c.self_money()