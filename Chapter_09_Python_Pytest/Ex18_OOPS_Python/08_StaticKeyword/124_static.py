#static=belong to class
class AI4X:
    coursename="AITB"
    mentor="Promod"

    def __init__(self,name):
        self.name=name
    
    def display(self):
        print("Hi:",self.name,"Your mentor",AI4X.mentor)
    
    @staticmethod
    def display2():
        print("static")

s1=AI4X("CMSC")
s2=AI4X("ghud")

s1.display()
s2.display()
AI4X.display2()