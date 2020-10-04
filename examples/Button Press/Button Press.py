from sys import argv
from time import sleep
from pynput.keyboard import Key, Controller


if __name__ == "__main__":
    keyboard = Controller()
    # Check if the button argument is valid
    if (len(argv) > 1):
        # Check if the argument only is one char
        key = argv[1].lower()
        # Special key inputs
        get_keycodes = {
            'space': Key.space,
            'enter': Key.enter,
            'esc': Key.esc
        }
        key = get_keycodes.get(key, key)
        try:
            keyboard.press(key)
            sleep(0.25)
            keyboard.release(key)
            print(f'Pressed {key}')
        except:
            print(f'{key} is not a valid key')
    else:
        print('No button argument')
        