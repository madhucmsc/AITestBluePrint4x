import os
class VMOLogin:
    def __init__(self, username, password):
        self.username=username
        self.password=password
    
    def loginConfirm(self):
       if self.username=="admin" and self.password=="admin":
           print("Login Successful")
       else:
          print("Login Failed")

username=input("Enter Username:")
password=input("Enter Password:")
vmo=VMOLogin(username, password)
vmo.loginConfirm()
print("Password is:",vmo.password) 
