class BaseTest:
    driver="chrome"
    __driver2="firefox"

    def setup(self):
        print("Base setup")

class LoginTest(BaseTest):
    def run(self):
        self.setup()
        print("running TC")
t= LoginTest()
t.run()