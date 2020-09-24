from sys import argv
from time import sleep
from pynput.keyboard import Key, Controller

if __name__ == "__main__":
    keyboard = Controller()
    # Check if the button argument is valid
    if (len(argv) > 1):
        # Check if the argument only is one char
        if (len(argv[1]) == 1):
            keyboard.press(argv[1])
            sleep(0.25)
            keyboard.release(argv[1])
        