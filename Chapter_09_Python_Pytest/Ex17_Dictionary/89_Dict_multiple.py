Student_info1={
    "name":"madhu",
    "age":30,
    "Sex":"male",
    "address":{
        "street":"xyz",
        "city":"mumbai", 
        "state":"MH"
    }
}

Student_info2={
    "name":"shreyansh",
    "age":24,
    "Sex":"male",
    "address":{
        "street":"xyz",
        "city":"pune", 
        "state":"MH"
    }
}

Stu_list=[Student_info1,Student_info2]
print(Stu_list)
print(Stu_list[0]["name"])
print(Stu_list[0]["address"]["city"])

