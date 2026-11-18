class ExcelReader:
    @staticmethod
    def readExcelFile():
        print("reading from excel ")
    
class MYSQLDBConnection:
    @staticmethod
    def readMySQLFile():
        print("reading from MYSQL")
    
class TC1:
    def runTC1(self):
        ExcelReader.readExcelFile()
        MYSQLDBConnection.readMySQLFile()
        print("hello")

class TC2:
    def runTC1(self):
        ExcelReader.readExcelFile()
        MYSQLDBConnection.readMySQLFile()
        print("hello")

t1=TC1()
t2=TC2()
t1.runTC1()
t2.runTC1()

