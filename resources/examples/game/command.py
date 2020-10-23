from sys import argv
from os import mkdir, path
from time import sleep
import json
import win32api
import win32con

VK_CODE = {'backspace':0x08,
           'tab':0x09,
           'clear':0x0C,
           'enter':0x0D,
           'shift':0x10,
           'ctrl':0x11,
           '0':0x30,
           '1':0x31,
           '2':0x32,
           '3':0x33,
           '4':0x34,
           '5':0x35,
           '6':0x36,
           '7':0x37,
           '8':0x38,
           '9':0x39,
           'a':0x41,
           'b':0x42,
           'c':0x43,
           'd':0x44,
           'e':0x45,
           'f':0x46,
           'g':0x47,
           'h':0x48,
           'i':0x49,
           'j':0x4A,
           'k':0x4B,
           'l':0x4C,
           'm':0x4D,
           'n':0x4E,
           'o':0x4F,
           'p':0x50,
           'q':0x51,
           'r':0x52,
           's':0x53,
           't':0x54,
           'u':0x55,
           'v':0x56,
           'w':0x57,
           'x':0x58,
           'y':0x59,
           'z':0x5A,
}

CONFIG_FOLDER   = 'config'
COMMANDS_JSON   = path.join(CONFIG_FOLDER, 'commands.json')
SLEEP_TIME      = 0.15

def press(key):
    win32api.keybd_event(VK_CODE[key], 0,0,0)
    sleep(.05)
    win32api.keybd_event(VK_CODE[key],0, win32con.KEYEVENTF_KEYUP, 0)

def typer(_str):
    pass

if __name__ == "__main__":
    # Create necessary folder and files
    # * Config [ FOLDER ]
    #   * - commands [ JSON ]  - store the commands here
    if not path.exists(CONFIG_FOLDER):
        mkdir(CONFIG_FOLDER)
    if not path.exists(COMMANDS_JSON):
        with open (COMMANDS_JSON, 'w+') as f:
            f.write(json.dumps({
                'chat_key': 't',
                'commands': [
                    {
                        'command': 'help',
                        'type': '/help'
                    }
                ]
            }, indent=4))

    # Check if we have a argument passed in the progran, which is the command to execute
    if len(argv) > 1:
        sleep(2)
        # Get the json data from commands.json
        with open (COMMANDS_JSON, 'r') as f:
            data = json.load(f)

        cmd             = argv[1]
        chat_key        = data['chat_key']
        print(chat_key)
        item            = [i for i in data['commands'] if i['command'] == cmd]
        if not item:
            print(f'{cmd} is not a valid command')
            quit(0)
        # item is returning list with a dict, but we only need the dict
        item = item[0]
        
        # Get the command and what we have to type from the item found by the argumented command
        _cmd    = item['command']
        _type   = item['type']

        print(f'Typing {_cmd} command')
        
        #Press the chat key
        press(chat_key)

        
        # # Type
        # keyboard.type(_type)
        # sleep(SLEEP_TIME)
        # # Enter
        # keyboard.press(Key.enter)
        # sleep(0.15)
        # keyboard.release(Key.enter)


