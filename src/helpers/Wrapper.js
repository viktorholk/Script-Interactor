const Logger = require('./Logger');
const path = require('path');
const fs = require('fs');
class Wrapper{
    static scriptsFolder;
    static configFile;
    static obsFile;
    static path;
 
    constructor(){
        // Check if the project is getting executed from /src or project directory
        const _path     = fs.realpathSync('.');
        const _list     = _path.split(path.sep);
        const _index    = _list.indexOf('src');

        // Paths
        Wrapper.path = (_index > -1) ? _list.splice(0, _index).join(path.sep) : _path;

        Wrapper.scriptsFolder   = path.join(Wrapper.path, 'scripts');
        Wrapper.configFile      = path.join(Wrapper.path, 'config.json');
        Wrapper.obsFile         = path.join(Wrapper.path, 'obs.txt');


        // Create scripts folder
        this.createFolder(Wrapper.scriptsFolder);

        // Only create the config folder if it doesnt exist
        if (!fs.existsSync(Wrapper.configFile)){
            this.writeJson(Wrapper.configFile, {
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
                        name: "AutoHotkey",
                        ext: ".ahk",
                        shell: "C:\\Program Files\\AutoHotkey\\autohotkey.exe "
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
        
        // Obs file used to import into your stream to see which script is playing
        if (!fs.existsSync(Wrapper.obsFile)){
            fs.writeFileSync(Wrapper.obsFile, '', (err) => {
                if (err){
                    Logger.Instance().log(err,3);
                }
            });
            Logger.Instance().log(`${Wrapper.obsFile} created successfully!`, 2)
        }
    }
    // Get the config
    getConfig(){
        return this.readJson(Wrapper.configFile);
    }

    // Create folder
    createFolder(_path){
        if (!fs.existsSync(_path)){
            fs.mkdirSync(_path, (err) => {
                if (err){
                    Logger.Instance().log(err, 3);
                    return;
                }
            });
            Logger.Instance().log(`${_path} created successfully!`);
        }
    }
    // Read and return json object
    readJson(_path){
        if (fs.existsSync(_path)){
            try{
                return JSON.parse(fs.readFileSync(_path));
            }
            catch (err){
                Logger.Instance().log(err, 3);
            }
        }
        Logger.Instance().log(`${_path} could not read`, 3);
        return null;
    }

    writeJson(_path, _data){
        try{
            fs.writeFileSync(_path, JSON.stringify(
                _data, null, 4
            ));
            Logger.Instance().log(`${_path} wrote ${_data}`, 2)
        }catch (err){
            Logger.Instance().log(err,3)
        }
    }


        /**
     * Check if all the files in scripts folder is related to a metadata json in the config and the other way around
     */
    ValidateScripts(){
        let config      = this.getConfig();
        const entries   = fs.readdirSync(Wrapper.scriptsFolder);

        // Go through all the files and compare them to the scripts
        for (const i in entries){
            const file      = entries[i];
            const filePath  = path.join(Wrapper.scriptsFolder, entries[i])
            // Skip if folder
            if (fs.lstatSync(filePath).isDirectory()) { continue }
            // Skip if json (we will check later for default metadata)
            if (path.extname(file) == '.json') { continue }

            // Go through all the scripts in the config and compare
            let exists = false;
            for (const j in config['scripts']){
                if (config['scripts'][j]['file'] === file){
                    exists = true;
                }
            }
            if (!exists){
                let script = new Script(file);
                
                // Check if there is default metadata with the script (etc other json file with same name)
                try {
                    const defaultMetadata = path.join(Wrapper.scriptsFolder, path.basename(file, path.extname(file)) + '.json');
                    if (fs.existsSync(defaultMetadata)){
                        const metadata = this.readJson(defaultMetadata);
                        for (const j in metadata){
                            if (!script[j]){
                                script[j] = metadata[j];
                            }
                        }
                        fs.unlinkSync(defaultMetadata);
                    }
                } catch (err){
                    console.log(err);
                    Logger.Instance().log(`Invalid default metadata for ${file}`);
                }
                config['scripts'].push(script);
                this.writeJson(Wrapper.configFile, config);
                Logger.Instance().log(`Added ${file} metadata to [scripts]`, 1)
            }
        }

        // Go through all the scripts and compare them to the files
        for (const i in config['scripts']){
            const script = config['scripts'][i];
            // Compare all file names to script names in config
            let exists = false;
            for (const j in entries){
                if (script['file'] == entries[j]){
                    exists = true;
                }
            }
            if (!exists){
                for (const j in config['scripts']){
                    if (config['scripts'][j]['file'] === script['file']){
                        const index = config['scripts'].indexOf(config['scripts'][j]);
                        if (index > -1){
                            config['scripts'].splice(index,1);
                        }

                        this.writeJson(Wrapper.configFile, config);
                        Logger.Instance().log(`Removed ${script['file']} from metadata`,2);
                    }
                }
            }
        }
    }
}

/**
 * Script class 
 */
class Script{
    constructor(file){
        this.enabled        = false
        this.name           = ''
        this.file           = file
        this.scriptCommand  = ''
        this.args           = false
        this.usage          = ''
        this.cooldown       = 0
        this.followerOnly   = false
        this.subscriberOnly = false
        this.modOnly        = false
    }
}


module.exports = Wrapper;