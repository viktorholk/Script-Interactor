//Module to work with folders and files
const fs = require('fs');
const path = require('path');
// Config
const config = require('../config.json');

class Wrapper {

    constructor(){
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

        /*
            Create all the neceesary folders
        */
       for (var i in config.paths){
            if (!fs.existsSync(i)){
                fs.mkdirSync(i);
            }
        }
        /*
            Check all current files and if no metadata file add one.
        */
       fs.readdirSync(config.paths['scripts']).forEach(file => {
            this.CreateMetaData(file);
        })
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