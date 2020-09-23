//Module to work with folders and files
const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');
const logger = new Logger().Instance();

const Handler = require('./Handler').default;
const Script = require('./Script');

class Wrapper {
    constructor(){
        this.scriptsPath    = 'scripts'
        this.configPath     = 'config.json'
        /* 
            Check if all the nescessary folders and files exists
        */
        // Scripts
        this.CreateFolder(this.scriptsPath);
        // Config
        // Only create the config file if it doesn't exist already, since we dont want to override the config later
        if (!fs.existsSync(this.configPath)){
            this.WriteJson(this.configPath,{
                username: 'tactoctical',
                token:    'oauth:3amvpcglyxc1xxqlr8iirm1no524i3',
                prefix: '/',
                error_messages:{
                    followerError: 'You have to be a follower to use this command',
                    subscriberError: 'You have to be a subscriber to use this command',
                    modError: 'You have to be a mod to use this command'
                },
                execute_config:[
                    {
                        name: "python",
                        ext: ".py",
                        shell: "python "
                    }
                ],
                scripts:[]
            });
        }
       }

    CreateFolder(_path){
        if (!fs.existsSync(_path)){
            fs.mkdir(_path, (err) => { 
                if (err) { 
                    logger.Log(err,3); 
                } 
                logger.Log(_path + ' folder created successfully!', 2); 
            }); 
        }
    }

    ReadJson(_path){
        if (fs.existsSync(_path)){
            try{
                return JSON.parse(fs.readFileSync(_path))
            }
            catch (err){
                logger.Log(err,3);
            }
        }
        logger.Log(_path + ' Could not read', 3);
        return null;
    }

    WriteJson(_path, data){
        try{
            fs.writeFileSync(_path, JSON.stringify(
                data, null, 4
            ));
            logger.Log(_path + ' Wrote ' + data, 2)
        }
        catch (err){
            logger.Log(err,3);
        }
    }
    /**
     * Check if all the files in scripts folder is related to a metadata json in the config and the other way around
     */
    
    ValidateScripts(){
        let _config = this.ReadJson(this.configPath);
        let files = fs.readdirSync(this.scriptsPath);

        for (let i in files){
            let _file = files[i];
            // Compare all file names to script names in config
            let exists = false;
            for (let j in _config['scripts']){
                if (_config['scripts'][j]['script'] === _file){
                    exists = true;
                }
            }
            if (!exists){
                new Handler(new Script(_file)).AppendScript();
            }
        } 

        for (let i in _config['scripts']){
            let _script = _config['scripts'][i]['script'];

            for (let j in files){
                let _file = files[j];
                if (_script === _file){
                    continue;
                }
            }
            //_obj = new ScriptHandler(new Script(_file)).RemoveScript();
        }
    }
}

class Singleton{
    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new Wrapper();
        }
    }
  
    Instance() {
        return Singleton.instance;
    }
}
module.exports = Singleton;