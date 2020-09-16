//Module to work with folders and files
const fs = require('fs');
const path = require('path');
// Config
const config = require('../config.json');

class Wrapper {

    constructor(){
        this.CreateFolders();
        this.CreateMetaData();
    }

    CreateFolders(){
        /*
            Create all the neceesary folder
        */
        try{
            let count = 0;
            for (var i in config.paths){
                if (!fs.existsSync(i)){
                    fs.mkdirSync(i);
                    console.log('* Created folder ' + i);
                    count++;
                }
            }
            if (count === 0){
                console.log('* All necessary folders exists')
            }
        }
        catch (e){
            console.log('* Exception raised: ' + e);
        }
    }

    CreateMetaData(){
        /* 
            Check if script files is associated with a metadata file.
        */
       
       try{
           let fileCount = 0;
           fs.readdirSync(config.paths['scripts']).forEach(file => {

               const fileExt   = path.extname(file);
               const fileName  = path.basename(file, fileExt);
               /*
               Metadata file content
               */
                const _metadata = JSON.stringify({
                    scriptFile: '',
                }, null, 4);



                if (fileExt !== '.json'){
                    let _fileName = fileName + '.json';
                    if  (!fs.existsSync(path.join(config.paths['scripts'],_fileName))){
                        let _path = path.join(config.paths['scripts'], _fileName);
                        fs.writeFileSync(_path, _metadata);
                        console.log('* Wrote metadata file for ' + _path);
                    }
                }
            })
            if (fileCount === 0){
                console.log('* All necessary metadata files exists');
            }
        }
        catch (e){
            console.log('* Exception raised: ' + e);
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