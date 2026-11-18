from abc import ABC, abstractmethod

class ExcelReader(ABC):

    @abstractmethod
    def readexcel(self):
        pass

class Browser(ExcelReader):
    @abstractmethod
    def startBrowser(self):
        pass
    
    @abstractmethod
    def stopBrowser(self):
        pass

class TC(Browser):
    def startBrowser(self):
        print("starting")

    def stopBrowser(self):
        print("stopping")
    
    def runtest(self):
        self.startBrowser()
        self.stopBrowser()

t=TC()
t.runtest()