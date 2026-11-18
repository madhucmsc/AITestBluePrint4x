class TestSuite:
    def info(self):
        print("this is GF -- setup")

class BaseTest(TestSuite):
    def setup(self):
        print("this is Base--setup")

class SecondTest(TestSuite):
    def secondSetup(self):
        print("second setup test:")

BaseTest().setup()
BaseTest().info()
SecondTest().secondSetup()
SecondTest().info()
