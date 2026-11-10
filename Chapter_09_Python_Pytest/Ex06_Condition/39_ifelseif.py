#calculate number is even or odd
num=int(input("Enter a number: ").strip())

if num>0:
    if num%2==0:
        print("The number is even")
    else:
        print("The number is odd")
else:
    print("The number is negative number")