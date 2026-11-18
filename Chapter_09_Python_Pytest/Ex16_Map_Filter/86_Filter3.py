names=["QA","","automation","","testing",""]
def non_empty(x):
    return x!=""

non_empty_names=list(filter(non_empty,names))
print(non_empty_names)