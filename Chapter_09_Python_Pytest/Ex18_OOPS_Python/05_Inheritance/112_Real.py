class BaseTest:
    def __init__(self,browser):
        self.browser=browser

    def setup(self):
        print(f"launching {self.browser}")
    
class LoginTest(BaseTest):
    def run_Test(self):
        self.setup()
        print("running test run...")

class signupTest(BaseTest):
    def run_Test(self):
        self.setup()
        print("running test run...")

t=LoginTest("Chrome")
t.run_Test()
t1=signupTest("Firefox")
t1.run_Test()
