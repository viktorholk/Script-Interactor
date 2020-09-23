const { privateDecrypt } = require('crypto');
const fs = require('fs');
const path = require('path');

class MetadataHandler{
    constructor(){
        this.fileName       = 'metadata.json';
        this.scriptsPath    = 'scripts/'
        // Create metadata file
        if (!fs.existsSync(this.fileName)){
            fs.writeFileSync(this.fileName, JSON.stringify({
                execute_config: [
                    {
                        name: 'python',
                        ext: '.py',
                        shell: 'python '
                    }
                ],
                scripts: []
            }, null, 4));
        }

        this.metadata = {
            enabled: false,
            script: '',
            scriptCommand: '',
            timeOut: 30,
            cost: 0,
            followerOnly: true,
            subscriberOnly: false,
            modOnly: false
        }
        this.UpdateMetadata();
    }

    UpdateMetadata(){
        let _list = this.ReadMetadata();
        fs.readdirSync(this.scriptsPath).forEach((file) => {
            const fileFullName  = path.basename(file);
            // Check if file is already in metadata
            let exists = false;
            for (let i in _list['scripts']){
                 if (_list['scripts'][i]['script'] === fileFullName){
                     return;
                 }
            }
            let scriptMetadata = this.metadata;
            scriptMetadata.script = fileFullName;

            this.AppendScriptMetadata(scriptMetadata);
        })


    }

    ReadMetadata(){
        return JSON.parse(fs.readFileSync(this.fileName));
    }

    AppendScriptMetadata(_script){
        let _metadata = this.ReadMetadata();
        _metadata['scripts'].push(_script);

        fs.writeFileSync(this.fileName, JSON.stringify(
            _metadata, null, 4
        ));

    }
}

class Singleton{
    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new MetadataHandler();
        }
    }
  
    Instance() {
        return Singleton.instance;
    }
}
module.exports = Singleton;