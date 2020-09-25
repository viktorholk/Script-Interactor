const path          = require('path');
const fs            = require('fs');
const { exec }      = require('child_process');
const axios         = require('axios');


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
         /* 
            Check if all the nescessary folders and files exists
        */
        // Scripts
        this.CreateFolder(this.scriptsPath);
        // Config
        // Only create the config file if it doesn't exist already, since we dont want to override the config later
        if (!fs.existsSync(this.configPath)){
            this.WriteJson(this.configPath,{
                opts: {
                    identity: {
                        username: '',
                        password: ''
                      },
                    channels: [
                        ''
                    ]
                },
                prefix: '!',
                cooldown: 30,
                execute_config:[
                    {
                        name: 'Executable',
                        ext: '.exe',
                        shell: 'start '
                    },
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
                    Logger.Instance().Log(err,3); 
                } 
                Logger.Instance().Log(_path + ' folder created successfully!', 2); 
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
                Logger.Instance().Log(err,3);
            }
        }
        Logger.Instance().Log(_path + ' Could not read', 3);
        return null;
    }

    // Read json object and write it to file
    WriteJson(_path, data){
        try{
            fs.writeFileSync(_path, JSON.stringify(
                data, null, 4
            ));
            Logger.Instance().Log(_path + ' Wrote ' + data, 2)
        }
        catch (err){
            Logger.Instance().Log(err,3);
        }
    }
    /**
     * Check if all the files in scripts folder is related to a metadata json in the config and the other way around
     */
    ValidateScripts(){
        try {
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
                    new Handler(_file).AppendScript();
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
                    new Handler(_script).RemoveScript();
                }
            } 

        } catch (err){
            Logger.Instance().Log(`ERROR: ${err}`, 3);
        }
    }
}
/**
 *  Our handler uses the Script class to append and remove from the metadata file, and from its extension it will execute it with the Execute() funtion
 */
class Handler{
    constructor(_script){
        this.scriptObject   = new Script(_script);
        this.scriptExt      = path.extname(this.scriptObject['script']);
        this.scriptPath     = path.join('scripts', this.scriptObject['script']);
    }   

    Execute(args=null){
        try {
            let _config = Wrapper.Instance().ReadJson(Wrapper.Instance().configPath);
            // Check if script exists in [scripts]
            let exists = false;
            for (let i in _config['scripts']){
                if (_config['scripts'][i]['script'] === this.scriptObject['script']){
                    exists = true
                }
            }
            if (!exists) {
                Logger.Instance().Log(`EXECUTE: ${this.scriptObject['script']} does not exist`, 3);
                return false;
            };
            //Read config and see what extensions are avaiable
            let method = null;
            for (let i in _config['execute_config']){
                if (_config['execute_config'][i]['ext'] === this.scriptExt){
                    method = _config['execute_config'][i];

                    exec(`${method['shell']} ${this.scriptPath} ` + args != null ? args[1] : '' , (err, stdout, stderr) =>{
                        if (err){
                            Logger.Instance().Log(err, 3);
                        }
                        Logger.Instance().Log(`${this.scriptObject['script']}: ${stdout}`, 4);
                    })
                }
            }
            if (!method){
                Logger.Instance().Log('Not a valid script ' + this.scriptExt, 3);
                return false;
            }
    
            Logger.Instance().Log('EXECUTE: ' + this.scriptObject['script'], 2);
            return true;

        } catch (err){
            Logger.Instance().Log(`ERROR: ${err}`, 3);
        }
        
    }

    AppendScript(){
        try {
            // Dont append json files
            if (path.extname(this.scriptObject['script']) === '.json'){ return }

            let _config = Wrapper.Instance().ReadJson(Wrapper.Instance().configPath);
            // Check if script already exists
            for (let i in _config['scripts']){
                if (_config['scripts'][i]['script'] === this.scriptObject['script']){
                    Logger.Instance().Log(this.scriptObject['script'] + ' already exists', 3)
                    return;
                }
            }
            //Check if there already is a "script".json in the scripts folder that contains the default metadata for the script provided
            const defaultMetadata = path.join(Wrapper.Instance().scriptsPath, path.basename(this.scriptObject['script'], path.extname(this.scriptObject['script'])) + '.json');
            if (fs.existsSync(defaultMetadata)){
                    this.scriptObject = Wrapper.Instance().ReadJson(defaultMetadata);
                    let __script = new Script('');
                    for (let i in __script){
                        // If the required key doesnt exist
                        const key = i;
                        if (!this.scriptObject[i]){
                            this.scriptObject[i] = __script[i];
                        }
                    }
            }
            if (this.scriptObject === null) {return}
    
            _config['scripts'].push(this.scriptObject);
            Wrapper.Instance().WriteJson(Wrapper.Instance().configPath, _config);
            Logger.Instance().Log('Added ' + this.scriptObject['script'] + ' metadata to [scripts]', 2);
        }
        catch(err){
            Logger.Instance().Log(`ERROR: ${err}`, 3);
        }
    }

    RemoveScript(){
        try {
            let _config = Wrapper.Instance().ReadJson(Wrapper.Instance().configPath);
            for (let i in _config['scripts']){
                if (_config['scripts'][i]['script'] === this.scriptObject['script']){
                    const index =  _config['scripts'].indexOf(_config['scripts'][i]);
                    if (index > -1){
                        _config['scripts'].splice(index,1)
                    }
    
                    Wrapper.Instance().WriteJson(Wrapper.Instance().configPath, _config);
                    Logger.Instance().Log('Removed ' + this.scriptObject['script'] + ' from metadata [scripts]',2);
                    return;
                }
            }
            Logger.Instance().Log('Could not find ' + this.scriptObject['script'] + ' in [scripts]');

        } catch (err){
            Logger.Instance().Log(`ERROR: ${err}`, 3);
        }
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
        // get username
        const opts = Wrapper.Instance().ReadJson(Wrapper.Instance().configPath)['opts'];
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

/**
 * Script class 
 */
class Script{
    constructor(_scriptName){
        this.enabled        = false,
        this.name           = '',
        this.script         = _scriptName,
        this.scriptCommand  = '',
        this.requireArgs    = false
        this.cooldown       = 0,
        this.followerOnly   = true,
        this.subscriberOnly = false,
        this.modOnly        = false
    }
}

module.exports = {
    Wrapper: Wrapper,
    Handler: Handler,
    Logger: Logger,
    API: API
}