from abc import ABC, abstractmethod

class GearBox(ABC):
    @abstractmethod
    def startgear(self):
        pass

class Engine:
    @abstarctmethod
    def start(self):
        pass
    
     @abstarctmethod
    def stop(self):
        pass

class Car(GearBox,Engine):
    def startgear(self):
        print("Gear box setup is ready")
    
    def start(self):
        print("engine is starting:")
    
    def stop(self):
        print("engine is stopping")

    def drive(self):
        drive.startgear()
        drive.start()
        drive.stop()


tesla=car()
tesla.drive()

