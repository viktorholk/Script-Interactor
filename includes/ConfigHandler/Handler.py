import os
import random
import json

CONFIG_FOLDER = 'config'
real_path       = os.path.realpath('.')
real_path_list  = real_path.split(os.path.sep)
class Handler(object):
    DEBUG = True
    folder_path     = None
    def __init__(self, _config_name, _default_data=None):
        self.config_name    = _config_name + '.json'
        # Since our scripts is getting executed from our src/ folder we will assure that our config files gets to the top level of the project
        try:
            index = real_path_list.index('src')
            self.folder_path    = os.path.join(os.path.sep.join(real_path_list[:index]), CONFIG_FOLDER)
            self.file_path      = os.path.join(self.folder_path, self.config_name)
        except ValueError:
            self.folder_path    = CONFIG_FOLDER
            self.file_path      = os.path.join(self.folder_path, self.config_name)
        
        # create the folders and config files if they do not exist
        if not os.path.exists(self.folder_path):
            os.mkdir(self.folder_path)
            self.log(f'Created folder {self.folder_path}')
        
        if not os.path.exists(self.file_path):
            # create the file and if there is some default data there should be there on init write it
            with open(self.file_path, 'w+') as f:
                self.log(f'Created config {self.file_path}')
                if _default_data:
                    f.write(json.dumps(_default_data, indent=4))
                    self.log('Wrote default data')
    
    def read_config(self):
        with open(self.file_path, 'r', encoding='utf-8') as f:
            self.log('Read config')
            return  json.load(f)
    
    def write_config(self, data):
        with open (self.file_path, 'w+', encoding='utf-8') as f:
            f.write(json.dumps(data, indent=4, ensure_ascii=False))
            self.log('Wrote config')

    
    def log(self, message):
        if Handler.DEBUG:
            print(message)


