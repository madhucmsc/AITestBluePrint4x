mylist=[1,2,3,4,5]
myfrozenset=frozenset(mylist)
print(myfrozenset)
myfrozenset.add(6) #frozenset is immutable, it does not allow to add or remove elements.
print(myfrozenset)