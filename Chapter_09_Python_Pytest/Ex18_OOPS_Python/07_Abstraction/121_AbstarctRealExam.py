from abc import ABC, abstractmethod

class BrowserManager(ABC):
    @abstractmethod
    def start(self):
        pass

    def stop(self):
        print("stop command, common")

class ChromeBrowser(BrowserManager):
    def start(self):
        print("we are starting chrome browser")

c=ChromeBrowser()
c.start()
c.stop()