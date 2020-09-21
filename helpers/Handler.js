import Wrapper from './Wrapper';
import Logger from './Logger';
import { extname } from 'path';

console.log(Wrapper);
return;
const logger    = new Logger().Instance();
const wrapper   = new Wrapper().Instance();

class Handler{
    constructor(_script){
        this.scriptObject   = _script;
        this.scriptExt      = extname(_script['script']);

    }

    Execute(){
        
        let _config = wrapper.ReadJson(wrapper.configPath);
        // Check if script exists in [scripts]
        let exists = false;
        for (let i in _config['scripts']){
            if (_config['scripts'][i]['script'] === this.scriptObject['script']){
                exists = true
            }
        }
        if (!exists) this.AppendScript();
        //Read config and see what extensions are avaiable
        let method = null;
        for (let i in _config['execute_config']){
            if (_config['execute_config'][i]['ext'] === this.scriptExt){
                method = _config['execute_config'][i];
            }
        }
        if (!method){
            logger.Log('Not a valid script ' + this.scriptExt);
            return;
        }

        logger.Log('Executing ' + this.scriptObject['script'], 2);
    }

    AppendScript(){
        let _config = wrapper.ReadJson(wrapper.configPath);
        // Check if script already exists
        for (let i in _config['scripts']){
            if (_config['scripts'][i]['script'] === this.scriptObject['script']){
                logger.Log(this.scriptObject['script'] + ' already exists', 3)
                return;
            }
        }
        _config['scripts'].push(this.scriptObject);
        wrapper.WriteJson(wrapper.configPath, _config);
        logger.Log('Added ' + this.scriptObject['script'] + ' metadata to [scripts]', 2);
    }

    RemoveScript(){
        let _config = wrapper.ReadJson(wrapper.configPath);
        for (let i in _config['scripts']){
            if (_config['scripts'][i]['script'] === this.scriptObject['script']){
                const index =  _config['scripts'].indexOf(_config['scripts'][i]);
                if (index > -1){
                    _config['scripts'].splice(index,1)
                }

                wrapper.WriteJson(wrapper.configPath, _config);
                logger.Log('Removed ' + this.scriptObject['script'] + ' from metadata [scripts]',2);
                return;
            }
        }
        logger.Log('Could not find ' + this.scriptObject['script'] + ' in [scripts]');
    }
}

export default Handler;