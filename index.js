const path          = require('path');
const fs            = require('fs');
const request       = require('request');
const { exec }      = require('child_process');
const got           = require('got');
const tmi           = require('tmi.js');

class Wrapper {
    static _INSTANCE = null;

    static Instance(){
        if (this._INSTANCE == null){
            this._INSTANCE = new Wrapper();
        }
        return this._INSTANCE;
    }

    constructor(){
        this.scriptsPath    = 'scripts'
        this.configPath     = 'config.json'
        this.logger         = Logger.Instance();
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
                channel: 'tactoc',
                prefix: '!',
                cooldown: 30,
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
                    this.logger.Log(err,3); 
                } 
                this.logger.Log(_path + ' folder created successfully!', 2); 
            }); 
        }
    }

    ReadJson(_path){
        if (fs.existsSync(_path)){
            try{
                return JSON.parse(fs.readFileSync(_path))
            }
            catch (err){
                this.logger.Log(err,3);
            }
        }
        this.logger.Log(_path + ' Could not read', 3);
        return null;
    }

    WriteJson(_path, data){
        try{
            fs.writeFileSync(_path, JSON.stringify(
                data, null, 4
            ));
            this.logger.Log(_path + ' Wrote ' + data, 2)
        }
        catch (err){
            this.logger.Log(err,3);
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
            // Compare all file names to script names in config
            let exists = false;
            for (let j in files){
                if (_script === files[j]){
                    exists = true;
                }
            }
            if (!exists){
                new Handler(new Script(_script)).RemoveScript();
            }
        } 
    }
}

class Handler{
    constructor(_script){
        this.scriptObject   = _script;
        this.scriptExt      = path.extname(_script['script']);
        this.scriptPath     = path.join('scripts', this.scriptObject['script']);
        this.wrapper        = Wrapper.Instance();
        this.logger         = Logger.Instance();
    }   

    Execute(){
        
        let _config = this.wrapper.ReadJson(this.wrapper.configPath);
        // Check if script exists in [scripts]
        let exists = false;
        for (let i in _config['scripts']){
            if (_config['scripts'][i]['script'] === this.scriptObject['script']){
                exists = true
            }
        }
        if (!exists) {
            this.logger.Log(`EXECUTE: ${this.scriptObject['script']} does not exist`, 3);
            return;
        };
        //Read config and see what extensions are avaiable
        let method = null;
        for (let i in _config['execute_config']){
            if (_config['execute_config'][i]['ext'] === this.scriptExt){
                method = _config['execute_config'][i];
                exec(`${method['shell']} ${this.scriptPath}`, (err, stdout, stderr) =>{
                    if (err){
                        this.logger.Log(err, 3);
                        return;
                    }
                    this.logger.Log(`${this.scriptObject['script']}: ${stdout}`, 4);
                })
            }
        }
        if (!method){
            this.logger.Log('Not a valid script ' + this.scriptExt);
            return;
        }

        this.logger.Log('EXECUTE: ' + this.scriptObject['script'], 2);
    }

    AppendScript(){
        let _config = this.wrapper.ReadJson(this.wrapper.configPath);
        // Check if script already exists
        for (let i in _config['scripts']){
            if (_config['scripts'][i]['script'] === this.scriptObject['script']){
                this.logger.Log(this.scriptObject['script'] + ' already exists', 3)
                return;
            }
        }
        _config['scripts'].push(this.scriptObject);
        this.wrapper.WriteJson(this.wrapper.configPath, _config);
        this.logger.Log('Added ' + this.scriptObject['script'] + ' metadata to [scripts]', 2);
    }

    RemoveScript(){
        let _config = this.wrapper.ReadJson(this.wrapper.configPath);
        for (let i in _config['scripts']){
            if (_config['scripts'][i]['script'] === this.scriptObject['script']){
                const index =  _config['scripts'].indexOf(_config['scripts'][i]);
                if (index > -1){
                    _config['scripts'].splice(index,1)
                }

                this.wrapper.WriteJson(this.wrapper.configPath, _config);
                this.logger.Log('Removed ' + this.scriptObject['script'] + ' from metadata [scripts]',2);
                return;
            }
        }
        this.logger.Log('Could not find ' + this.scriptObject['script'] + ' in [scripts]');
    }
}

class Logger{
    static _INSTANCE = null;

    static Instance(){
        if (this._INSTANCE == null){
            this._INSTANCE = new Logger();
        }
        return this._INSTANCE;
    }
    constructor(){
        this.logs = []
        // Types
        // 1 : Information
        // 2 : Success
        // 3 : Failure
        // 4 : Data
        this.color = {
            reset: '\x1b[0m',
            types: {
                1: '\x1b[33m',
                2: '\x1b[32m',
                3: '\x1b[31m',
                4: '\x1b[35m'
            }
        }
    }

    Log(msg,type=1){
        const color = this.color.types[type];
        const date = new Date().toTimeString().split(' ')[0];
        const log = date + ' : ' + color + msg + this.color.reset;
        console.log(log);
        this.logs.push(log)
    }
}

class Script{
    constructor(_scriptName){
        this.enabled        = false,
        this.script         = _scriptName,
        this.scriptCommand  = '',
        this.cooldown        = 0,
        this.cost           = 0,
        this.followerOnly   = true,
        this.subscriberOnly = false,
        this.modOnly        = false
    }
}

class API{
    static _INSTANCE = null;

    static Instance(){
        if (this._INSTANCE === null){
            this._INSTANCE = new API();
        }
        return this._INSTANCE;
    }

    constructor(){
        this.url = 'https://api.twitch.tv/helix'
    }

    get(){
        got(
            'https://api.twitch.tv/helix/users??id=44322889',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Client-ID': 'vfn9l9kikr77duyv6cpu1tz7i0dqtj'
                },
                gzip: true
            }
        )
        .then(resp => {
            return resp.body;
        }).catch(err =>{
            Logger.Instance().Log(`ERROR: ${err}`, 4);
        });
    }
}


Wrapper.Instance().ValidateScripts();
let config = Wrapper.Instance().ReadJson(Wrapper.Instance().configPath);

const opts = {
    identitiy: {
        username: config.username,
        password: config.token
    },
    channels: [
        config.channel
    ]
}

const client = new tmi.client(opts);

//client.on('message', onMessageHandler)

client.connect();

API.Instance().get();

function onMessageHandler (target, context, msg, self){
    if (self) { return;}

    // Check if the message is a command
    if (msg.charAt(0) === config.prefix){

        let username = context['username']

        Logger.Instance().Log(`CHAT: ${username} ${msg}`, 4);
    }
    
}   

            // // We will register all the users who uses a command and keeps track of when he last executed a command and checks if it was too recently
            // let cache   = {
            //     scripts:    [] 
            // }
            // if (message.message.charAt(0) === config.prefix){
            //     const cmd = message.message.split(config.prefix)[1];

            //     // Find the script
            //     for (let i in config['scripts']){
            //         const _script = config['scripts'][i];
            //         // Make sure the user isn't on cooldown
            //         if (_script['scriptCommand'] !== '' && _script['enabled'] !== false  && _script['scriptCommand'] === cmd){
            //             const _date = new Date().getTime();

            //             const username = message.username;

            //             let __script = null;
            //             for (let j in cache['scripts']){
            //                 if (cache['scripts'][j]['name'] === _script['script']){
            //                     __script = cache['scripts'][j];
            //                 }
            //             }
            //             if (__script === null){
            //                 __script = {
            //                     name: _script['script'],
            //                     date: _date
            //                 }
            //                 cache['scripts'].push(__script);
            //             }



            //             const scriptCooldownTotal       = parseInt(config['cooldown']) + parseInt(_script['cooldown']);
            //             const scriptCooldownSinceLast   = getDiffInSec(__script['date'], _date);

            //             const scriptCooldownRemaining   = scriptCooldownTotal - scriptCooldownSinceLast;

            //             // Check if the script is on cooldown, we check if its 0 since we want to execute the first command typed
            //             if (scriptCooldownSinceLast < scriptCooldownTotal && scriptCooldownSinceLast !== 0){
            //                 chat.say(channel, `@${username}, Sorry! the script is on cooldown ${scriptCooldownRemaining.toFixed(1)} s`)
            //             }else{
            //                 new Handler(new Script(_script['script'])).Execute();
            //                 // Update the date
            //                 cache['scripts'][cache['scripts'].indexOf(__script)]['date'] = new Date().getTime();
            //                 return;
            //             }



            //             console.log(scriptCooldownTotal);
            //             console.log(scriptCooldownSinceLast);

            //             console.log(scriptCooldownRemaining);



            //         }
            //     }
            // }

function getDiffInSec(oldTime, newTime){
    return diff = (newTime - oldTime) / 1000;
}