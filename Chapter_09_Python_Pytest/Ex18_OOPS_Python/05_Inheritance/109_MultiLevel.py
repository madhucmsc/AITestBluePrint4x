class TestSuite:
    def info(self):
        print("this is GF -- setup")

class BaseTest(TestSuite):
    def setup(self):
        print("this is Base--setup")
    
class UITest(BaseTest):
    def run(self):
        self.info()
        self.setup()
        print("running the child test case")

UI=UITest()
UI.run()