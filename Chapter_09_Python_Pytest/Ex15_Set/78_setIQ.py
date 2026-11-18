IQ=("Madhu","shiva","shreyansh","Madhu")
print(IQ)
print(set(IQ))

empty=set()
print(type(empty))

mixed={1,2,3,4,5,"Madhu",True,False}
for i in mixed:
    print(i)
mixed.add("shiva")
print(mixed)
mixed.remove("shiva")
print(mixed)