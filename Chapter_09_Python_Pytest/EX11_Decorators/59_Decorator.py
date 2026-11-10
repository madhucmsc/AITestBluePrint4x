
def add_security(func):
    def wrapper():
        print("Security check passed!")
        func()
        print("Security check completed!")
    return wrapper

@add_security
def sayGreeting():
    print("Hello, welcome to the world of decorators!")
sayGreeting()
