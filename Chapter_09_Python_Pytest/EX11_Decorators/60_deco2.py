
def before_after_ui_test(func):
    def wrapper():
        print("Before UI test")
        func()
        print("After UI test")
    return wrapper

@before_after_ui_test
def test_ui():
    print("UI test executed")

    test_ui()