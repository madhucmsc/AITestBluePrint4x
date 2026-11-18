class Browser:
    def make_httprequest(self,url):
        print("lets make http request without auth",url)
    
    def make_httprequest(self,url,auth="None"):
        print("lets make http request with auth",url,auth)

t=Browser()
t.make_httprequest("google.com","admin")