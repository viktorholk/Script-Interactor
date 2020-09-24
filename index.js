const path          = require('path');
const fs            = require('fs');
const { exec }      = require('child_process');
const axios         = require('axios');
const tmi           = require('tmi.js');

/**
 *  Our Wrapper function does everything from creating the nescessary folders and files to read write and validation of the scripts.
 */
class Wrapper {
    // With this static instance function, we can make the class a singleton class so we only have to initiate it once.
    static _INSTANCE = null;

    static Instance(){
        // If the class have not been yet create new else return existing.
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
                username: '',
                token:    '',
                prefix: '!',
                cooldown: 30,
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

       // Create a folder with the logger class
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

    // Read and return json object
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

    // Read json object and write it to file
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
            // If the metadata doesn't exist create it
            if (!exists){
                new Handler(new Script(_file)).AppendScript();
            }
        } 

        // If there is a metadata script for a file that doesn't exist delete it
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
/**
 *  Our handler uses the Script class to append and remove from the metadata file, and from its extension it will execute it with the Execute() funtion
 */
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
/**
 * Logger prints colorful text in a format
 */
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
/**
 * Script class 
 */
class Script{
    constructor(_scriptName){
        this.enabled        = false,
        this.name           = '',
        this.script         = _scriptName,
        this.scriptCommand  = '',
        this.cooldown       = 0,
        this.followerOnly   = true,
        this.subscriberOnly = false,
        this.modOnly        = false
    }
}
/**
 * API class connects to the api.tactoctical.com and gets a OAuth token from the Script-interacter client-id and secret and returns it
 * It can also connect to the Twitch API to check if a user is following or not
 */
class API{
    // Singleton class
    static _INSTANCE = null;

    static Instance(){
        if (this._INSTANCE === null){
            this._INSTANCE = new API();
        }
        return this._INSTANCE;
    }

    constructor(){
        this.api    = 'https://api.twitch.tv/helix/'
        this.token  = null;
        // Create axios instance with client id in common header
        this.axios  = axios.create({
            headers:{
                common:{
                    'Client-Id': 'm47mvaevmze4cnkb8ziotc10dct21y'
                }
            }
        });

        this.axios.interceptors.response.use(this.handleSuccess, this.handleError);
    }

    handleSuccess(response){
        return response
    }

    handleError(error){
        return Promise.reject(
            Logger.Instance().Log(`ERROR: ${error}`, 3)
        );
    }

    validateToken(){
        // Returns the token from api.tactoctical.com
        // Check if there already is a token, then check if it is valid and if it is not return a new token
        if (this.token !== null){
            return this.axios.get('https://id.twitch.tv/oauth2/validate', { headers: { Authorization: `OAuth ${this.token}`}}).then(
                (response) => {  Logger.Instance().Log('Bearer token is valid', 1); return this.token}
            ).catch(
                (err) => {
                    return this.axios.get('https://api.tactoctical.com/twitch-app/token').then(
                        (response) => { 
                            this.token = response.data['results']['access_token'];
                            // Set the token in the header
                            this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                            Logger.Instance().Log('Updated bearer token', 1);
                            return this.token;
                        });
                 });
        }
        // return a new token
        return this.axios.get('https://api.tactoctical.com/twitch-app/token').then(
            (response) => { 
                this.token = response.data['results']['access_token'] ;
                // Set the token in the header
                this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                Logger.Instance().Log('Applied bearer token', 2);
                return this.token;
            });
    }


    async get(path, callback){
        // Validate token
        await this.validateToken();
        // Get the full path
        path = this.api + path;
        //make request and use callback
        return this.axios.get(path).then(
            (response) => callback(response.status, response.data)
        );
    }

    async isFollowing(userid){
        // Check if a userid is a follower to the broadcaster channel
        return this.get(`users/follows?from_id=${userid}`, (status, response) => {
            let _isFollowing = false;
            for (let i in response['data']){
                //console.log(response['data'][i]);
                let to_name = response['data'][i]['to_name'];
                if (to_name === opts.identity.username){
                    _isFollowing = true;
                    break;
                }
            }
            return _isFollowing;
        })
    }
}
/// Main program
// Validate scripts and create the necessary folders and files.
Wrapper.Instance().ValidateScripts();
// Import the config from config.json with our wrapper
let config = Wrapper.Instance().ReadJson(Wrapper.Instance().configPath);

// Twitch options
const opts = {
    identity: {
        username: config.username,
        password: config.token
      },
    channels: [
        config.username
    ]
}

// Client
const client = new tmi.client(opts);

// Events
client.on('connecting', (address, port) => {
    Logger.Instance().Log(`Connecting ${address}:${port}`, 1);
})

client.on('connected', () => {
    Logger.Instance().Log(`Connected`)
})

client.on('disconnected', (reason) => {
    Logger.Instance().Log(`Lost Connection - ${reason}`, 3);
})

client.on('reconnect', () => {
    Logger.Instance().Log('Reconnecting', 1);
})

client.on('logon', () => {
    Logger.Instance().Log('Ready', 2);
});

client.on('join', (channel, username, self) => {
    if (self) { return }
    Logger.Instance().Log(`${username} joined`, 1);
})

client.on('part', (channel, username, self) => {
    if (self) { return }
    Logger.Instance().Log(`${username} left`, 1);
})

client.on('message', onMessageHandler);
// Connect
client.connect();

// Our cache that holds the date from when a script last was executed
let cache   = {
    scripts:    [] 
}

async function  onMessageHandler (target, context, msg, self){
    // Check if the message is a command
    if (msg.charAt(0) === config.prefix){
        // Print the command
        Logger.Instance().Log(`CHAT: ${context['username']} ${msg}`, 4);

        // get the command without the prefix
        const message_list = msg.replace('!', '').split(' ');
        const cmd   = message_list[0];
        let args = null;

        if (message_list.length > 1){
            args  = message_list.slice(1);
        }
        // Find the script
        for (let i in config['scripts']){
            const _script = config['scripts'][i];
            // Make sure the user isn't on cooldown
            if (_script['scriptCommand'] !== '' && _script['enabled'] !== false  && _script['scriptCommand'] === cmd){
                // Check if user is following
                context['isFollowing'] = await API.Instance().isFollowing(context['user-id']);

                //Check if script is follow only
                if (_script['followerOnly'] && !context['isFollowing']){
                    client.say(target, `@${context['username']}, Sorry! this script is follower only.`)
                    return;
                }
                //Check if script is sub only
                if (_script['subscriberOnly'] && !context['subscriber']){
                    client.say(target, `@${context['username']}, Sorry! this script is subscriber only.`)
                    return;
                }

                //Check if script is mod only
                if (_script['modOnly'] && !context['mod']){
                    client.say(target, `@${context['username']}, Sorry! this script is moderator only.`)
                    return;
                }

                const _date = new Date().getTime();
                // See if the script already is in the cache
                let __script = null;
                for (let j in cache['scripts']){
                    if (cache['scripts'][j]['name'] === _script['script']){
                        __script = cache['scripts'][j];
                    }
                }
                // If there is no script push it to the cache with a date
                if (__script === null){
                    __script = {
                        name: _script['script'],
                        date: _date
                    }
                    cache['scripts'].push(__script);
                }

                // Calculate the times
                const scriptCooldownTotal       = parseInt(config['cooldown']) + parseInt(_script['cooldown']);
                const scriptCooldownSinceLast   = (_date - __script['date']) / 1000;
                const scriptCooldownRemaining   = scriptCooldownTotal - scriptCooldownSinceLast;

                console.log(scriptCooldownTotal);
                console.log(scriptCooldownSinceLast);
                console.log(scriptCooldownRemaining);

                // Check if the script is on cooldown, we check if its 0 since we want to execute the first command typed
                if (scriptCooldownSinceLast < scriptCooldownTotal && scriptCooldownSinceLast !== 0){
                    client.say(target, `@${context['username']}, Sorry! the script is on cooldown ${scriptCooldownRemaining.toFixed(1)} s`)
                }else{
                    // Print the script name if it isn't empty else script command
                    client.say(target, `@${context['username']}, Executing ${_script['name'] !== '' ? _script['name'] : _script['scriptCommand']}`);
                    new Handler(new Script(_script['script'])).Execute();
                    // Update the date
                    cache['scripts'][cache['scripts'].indexOf(__script)]['date'] = new Date().getTime();
                    return;
                }
            }
        }
    }
}   
