g=10 #global variable
class Person:
    i=20 #class variable
    def __init__(self):
        l=30 #local variable
        self.l=30 #instance variable
        print("local Variable:",l)
        print("Class Variable:",Person.i)
        print("Global Variable:",globals()['g'])

ba=Person()