nums=[1,2,4,5,6,7,8,9]

def even_numbers(x):
    return x%2==0

even_num=list(filter(even_numbers,nums))
print(even_num)