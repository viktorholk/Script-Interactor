from sys import argv
from os import mkdir, path
from time import sleep
import json
import ctypes

# These are direct input scan codes. Which means that these keys will be able to be used in games, since the games except a different key code then we usually uses
KEY_CODES = {
# Alphabetic
"A":        0x1E,
"B":        0x30,
"C":        0x2E,
"D":        0x20,
"E":        0x12,
"F":        0x21,
"G":        0x22,
"H":        0x23,
"I":        0x17,
"J":        0x24,
"K":        0x25,
"L":        0x26,
"M":        0x32,
"N":        0x31,
"O":        0x18,
"P":        0x19,
"Q":        0x10,
"R":        0x13,
"S":        0x1F,
"T":        0x14,
"U":        0x16,
"V":        0x2F,
"W":        0x11,
"X":        0x2D,
"Y":        0x15,
"Z":        0x2C,
# Numbers
"1":        0x02,
"2":        0x03,
"3":        0x04,
"4":        0x05,
"5":        0x06,
"6":        0x07,
"7":        0x08,
"8":        0x09,
"9":        0x0A,
"0":        0x0B,
# Special keys
"ESC":      0x01,
"ENTER":    0x1C,
"TAB":      0x0F,
".":        0x33,
",":        0x34,
"/":        0x35,
" ":        0x39
} # for more key codes http://ionicwind.com/guides/emergence/appendix_a.htm

SendInput = ctypes.windll.user32.SendInput

# C Struct redifinitions
PUL = ctypes.POINTER(ctypes.c_ulong)
class KeyBdInput(ctypes.Structure):
    _fields_ = [("wVk", ctypes.c_ushort),
                ("wScan", ctypes.c_ushort),
                ("dwFlags", ctypes.c_ulong),
                ("time", ctypes.c_ulong),
                ("dwExtraInfo", PUL)]

class HardwareInput(ctypes.Structure):
    _fields_ = [("uMsg", ctypes.c_ulong),
                ("wParamL", ctypes.c_short),
                ("wParamH", ctypes.c_ushort)]

class MouseInput(ctypes.Structure):
    _fields_ = [("dx", ctypes.c_long),
                ("dy", ctypes.c_long),
                ("mouseData", ctypes.c_ulong),
                ("dwFlags", ctypes.c_ulong),
                ("time",ctypes.c_ulong),
                ("dwExtraInfo", PUL)]

class Input_I(ctypes.Union):
    _fields_ = [("ki", KeyBdInput),
                 ("mi", MouseInput),
                 ("hi", HardwareInput)]

class Input(ctypes.Structure):
    _fields_ = [("type", ctypes.c_ulong),
                ("ii", Input_I)]

# Actuals Functions
def PressKey(hexKeyCode):
    extra = ctypes.c_ulong(0)
    ii_ = Input_I()
    ii_.ki = KeyBdInput( 0, hexKeyCode, 0x0008, 0, ctypes.pointer(extra) )
    x = Input( ctypes.c_ulong(1), ii_ )
    ctypes.windll.user32.SendInput(1, ctypes.pointer(x), ctypes.sizeof(x))

def ReleaseKey(hexKeyCode):
    extra = ctypes.c_ulong(0)
    ii_ = Input_I()
    ii_.ki = KeyBdInput( 0, hexKeyCode, 0x0008 | 0x0002, 0, ctypes.pointer(extra) )
    x = Input( ctypes.c_ulong(1), ii_ )
    ctypes.windll.user32.SendInput(1, ctypes.pointer(x), ctypes.sizeof(x))

def press(key, sleepTime=0.10):
    key = KEY_CODES[key.upper()]
    if not key:
        return
    
    PressKey(key)
    sleep(sleepTime)
    ReleaseKey(key)

def typer(message):
    for i in message:
        press(i, 0)



CONFIG_FOLDER   = 'config'
COMMANDS_JSON   = path.join(CONFIG_FOLDER, 'commands.json')


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
        
        press('t')
        typer('penis')
        press('enter')
        
        # # Type
        # keyboard.type(_type)
        # sleep(SLEEP_TIME)
        # # Enter
        # keyboard.press(Key.enter)
        # sleep(0.15)
        # keyboard.release(Key.enter)


