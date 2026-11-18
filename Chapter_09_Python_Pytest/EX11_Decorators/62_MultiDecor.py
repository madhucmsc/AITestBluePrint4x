def Decor1(func):
    def wrapper():
        print("Before UI test")
        func()
        
    return wrapper

def Decor2(func):
    def wrapper():
        print("Before API test")
        func()
        print("After API test")
    return wrapper

    @Decor1
     @Decor2
    def Say_Hello():
        print("Hello World")
        
        Say_Hello()
