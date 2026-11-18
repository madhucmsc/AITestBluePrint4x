class Calc:
    a=None
    b=None
    def sum(self,a,b):
        return a+b
    def sub(self,a,b):
        return a-b
    def mul(self,a,b):
        return a*b
    def div(self,a,b):
        return a/b

a=float(input("Enter the first number: "))
b=float(input("Enter the second number: "))

obj_ref=Calc()
Sum=obj_ref.sum(a,b)
Sub=obj_ref.sub(a,b)    
Mul=obj_ref.mul(a,b)
Div=obj_ref.div(a,b)
print(Sum,Sub,Mul,Div)
