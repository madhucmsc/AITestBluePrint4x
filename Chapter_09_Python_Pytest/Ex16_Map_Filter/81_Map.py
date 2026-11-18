numbers=[1,2,3,4,5,6,7,8,9]
def square(x):
    return x**2

squared_numbers=list(map(square,numbers))
print(squared_numbers)