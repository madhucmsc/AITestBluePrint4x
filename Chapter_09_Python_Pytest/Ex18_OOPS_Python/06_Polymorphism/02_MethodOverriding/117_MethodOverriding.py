class BaseTest:
    def run(self):
        print("running base Test")

class LoginTest(BaseTest):
    def run(self):
        print("running login test")

t=LoginTest()
t.run()