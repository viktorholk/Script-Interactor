from pynput.keyboard import Key, Controller
from os import path, mkdir
from time import sleep
from sys import argv
import json


CONFIG_FILE = 'commands.json'

def create_config(filepath, dict):
    # Create the config in the config folder so we don't compare config json files to script metadata
    configfolder = "config"
    if not path.exists(configfolder):
        mkdir(configfolder)

    # Create the config file
    if not path.exists(filepath):
        with open (path.join(configfolder, CONFIG_FILE), 'w+') as f:
            f.write(json.dumps(dict))
            return True
    return False

def press_key(key):
    keyboard.press(key)
    sleep(0.125)
    keyboard.release(key)

keyboard = Controller()

if __name__ == "__main__":
    # If its the first time the script executes we quit since no commands have been configured
    if create_config(CONFIG_FILE, {
        'chatkey': 't',
        'commands': [
            {
                'name': 'sampleCommand',
                'command': 'sample',
                'type': '/help'
            }
        ]
    }):
        print('Quits: First time configuration')
        quit(0)

    if argv > 1:
        pass