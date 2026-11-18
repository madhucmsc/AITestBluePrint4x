class MathClass:
    def add(self,a,b):
        return a+b
    
    def add(self,a,b,c=10):
        return a+b+c

obj_ref=MathClass()
print(obj_ref.add(2,3))
print(obj_ref.add(8,6))