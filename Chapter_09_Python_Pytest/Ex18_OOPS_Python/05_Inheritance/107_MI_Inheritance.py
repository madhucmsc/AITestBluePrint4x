class APIBase:
    def api_auth(self):
        print("Authentication in API")

class DBBase:
    def db_connect(self):
        print("connecting to the DB")

class TestHybrid(APIBase,DBBase):
    def run(self):
        self.api_auth()
        self.db_connect()
        print("test case is running")

t1=TestHybrid()
t1.run()