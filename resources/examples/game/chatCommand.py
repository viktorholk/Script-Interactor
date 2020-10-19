from pynput.keyboard import Key, Controller
from os import path, mkdir
from time import sleep
from sys import argv
import json



def create_config( dict):
    # Create the config in the config folder so we don't compare config json files to script metadata
    configfolder    = "config"
    if not path.exists(configfolder):
        mkdir(configfolder)

    configPath      = path.join(configfolder, 'commands.json')
    # Create the config file
    if not path.exists(configPath):
        with open (configPath, 'w+') as f:
            f.write(json.dumps(dict, indent=4))
            return True
    return False

def press_key(key):
    keyboard.press(key)
    sleep(0.125)
    keyboard.release(key)

keyboard = Controller()

if __name__ == "__main__":
    # If its the first time the script executes we quit since no commands have been configured
    if create_config({
        'chatkey': 't',
        'commands': [
            {
                'command': 'sample',
                'type': '/help'
            }
        ]
    }):
        print('Quits: First time configuration')
        quit(0)

    if len(argv) > 1:
        //