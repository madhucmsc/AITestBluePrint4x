test_result=["pass","fail","pass","fail","pass","skip","pass"]

Pass_result=list(filter(lambda x:x=="pass",test_result))
print(Pass_result)