class Person:
    def say_name(self,name):
        print("Hi",name)
    
    def say_name(self,name,lastname="chowdary"):
        print("Hi",name,lastname)

t=Person()
t.say_name("Madhusudan")