const fs = require('fs');
const path = require('path');
const MetadataHandler = require('./MetadataHandler');
const { exec } = require('child_process');
const config = require('../config.json');
const { stderr } = require('process');
class ScriptHandler{
    constructor(_script){
        this.script = _script
        this.ext = path.extname(_script);
        this.handler = new MetadataHandler().Instance();

        let _config          = this.handler.ReadMetadata();
        this._execute_config = _config['execute_config'];
        this._scripts_config = _config['scripts']
    }

    Execute(){
        // Fint the metadatafile to the _script
        let _execute_ext;
        for (let i in this._scripts_config){
            if (this._scripts_config[i]['script'] === this.script){
                console.log('* Metadata exists')
                _execute_ext = path.extname(this._scripts_config[i]['script']);
            }
        }
        if (!_execute_ext) {
            console.log('* Metadata does not exist');
            return;
        }
       
        switch (_execute_ext){
            case '.py':
                    exec('python  ' +  path.join('scripts', this.script), (err, stdout, stderr) => {
                        if (err){
                            console.log(err);
                        }else{
                            this.ColorPrint(stdout);
                        }
                    }) ;
                break;

            default:
                console.log('Extension ' + _execute_ext + ' is not allowed.');
                break;
        }
    }

    ColorPrint(msg){
        console.log('\x1b[35m' + msg + '\x1b[0m');
    }



}
module.exports = ScriptHandler;