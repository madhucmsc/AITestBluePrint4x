class BaseMethod():
    def baseMethod(self):
        print("Base method details")

class A(BaseMethod):
    def Asetup(self):
        print("A method details")

class B(BaseMethod):
    def Bsetup(self):
        print("B method details")

class C(A,B):
    def Csetup(self):
        print("C method details")
       
obj=C()
obj.Csetup()
obj.Bsetup()
obj.Asetup()
obj.baseMethod()