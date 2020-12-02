# Includes
This folder is for packages and other stuff that can be used by the integrated scripts. <br >
Some of the scripts that is used, requires a config file to read and write data to. <br >
* **ConfigHandler** <br >

   The ``ConfigHandler`` python package helps python scripts to store their config files in the same folder and their structure as the other scripts, 
   and provides features such as reading and writing to them. <br >
   **Usage:** <br >
    To prevent the top level package error in relative import error, you will have to use theses 3 lines in the start of your script to import the package. <br >
    ````
    import sys
    sys.path.append('../includes')
    import ConfigHandler
    import ...
    ````
    You can then create a object with the ConfigHandler.Handler class <br >
    The class takes in 2 arguments. A string and a dict. The string is the config file name and the dict is a optional way to set the default data
    
    ````
    handler = ConfigHandler.Handler('config_file', {'type': 'default_data'})
    or
    handler = ConfigHandler.Handler('config_file')
    ````
    <br >

    * ``handler.read_config()`` <br >
        Returns the data in a json format
    To write to the config
    * ``handler.write_config(data)`` <br > 
        Writes to the json config file with the new data <br >
    Example on how to write to the config:
    ````
    handler = ConfigHandler.Handler('config_file', {'message': 'Hello, World!'})
    config = handler.read_config()
    config['message'] = 'New message'
    # Write to the config
    handler.write_json(config)
    
    ````
        
