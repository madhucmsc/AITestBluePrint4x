class TestSuite:
    def info(self):
        print("Test suite information")
    
class BaseTest(TestSuite):
    def setup(self):
        print("base test information")
    def run(self):
        print("base test execution")

class LoginTest(BaseTest):
    def run(self):
        print("login test execution")

class APITest(BaseTest):
    def run(self):
        print("API test execution")

APITest().run()
APITest().info()
LoginTest().run()
LoginTest().info()