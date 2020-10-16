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
        let config      = this.getConfig;
        const entries   = fs.readdirSync(Wrapper.scriptsFolder);
        const _path     = fs.realpathSync(Wrapper.scriptsFolder);
        console.log(_path)
        // for (let i in entries){
        //     // Check if folder then ignore
        //     //if (fs.statSync(entries[i]).isDirectory) { continue }
        //     console.log(_path);
        //     console.log(entries[i])
        // }

    }

}


module.exports = Wrapper;