const tmi           = require('tmi.js');
const path          = require('path');
const fs            = require('fs');
const {Wrapper, Logger, Api} = require('./helpers');
const { exec } = require('child_process');

// Process Title
process.title = "Script Interactor 1.2.4";
console.log(`
  ____            _       _   
 / ___|  ___ _ __(_)_ __ | |_ 
 \\\___ \\\ / __| '__| | '_ \\\| __|
  ___) | (__| |  | | |_) | |_ 
 |____/ \\\___|_|  |_| .__/ \\\__|
  ___       _      |_|             _             
 |_ _|_ __ | |_ ___ _ __ __ _  ___| |_ ___  _ __ 
  | || '_ \\\| __/ _ \\\ '__/ _ |/ __| __/ _ \\\| '__|
  | || | | | ||  __/ | | (_| | (__| || (_) | |   
 |___|_| |_|\\\__\\\___|_|  \\\__,_|\\\___|\\\__\\\___/|_|       
 Version 1.2.4              by viktorholk
 Repository                 https://github.com/viktorholk/Script-Interactor
 Discord for issues & help  https://discord.gg/MZyktMG
`);



//global variables
const wrapper = Wrapper.Instance();
wrapper.validateScripts();
const client = new tmi.client(wrapper.getConfig().opts);

// list of current executing scripts (used to write to obs.txt)
let currentExecutingScripts = [];
// Our cache that holds the date from when a script last was executed
let cache   = {
    scripts:    [] 
};

// Client Events
client.on('connecting', (address, port) => {
    Logger.Instance().log(`Connecting ${address}:${port}`, 1);
})

client.on('connected', () => {
    Logger.Instance().log(`Ready`, 2)
});

client.on('disconnected', (reason) => {
    Logger.Instance().log(`Lost Connection - ${reason}`, 3);
});

client.on('reconnect', () => {
    Logger.Instance().log('Reconnecting', 1);
});

client.on('logon', () => {
    Logger.Instance().log('Connected', 2);
});

client.on('join', (channel, username, self) => {
    if (self) { return }
    Logger.Instance().log(`${username} joined`, 1);
});

client.on('part', (channel, username, self) => {
    if (self) { return }
    Logger.Instance().log(`${username} left`, 1);
});

client.on('message', onMessageHandler);

// Connect
client.connect().catch((err) => {
    switch (err){
        case 'Invalid NICK.':
            Logger.Instance().log('Configure ./config.json with your twitch credentials', 3);
            Logger.Instance().log('username : <Your twitch username>', 1);
            Logger.Instance().log('password : <Your OAuth token>', 1);
            Logger.Instance().log('channels : [ "<Your username>" ]', 1);
            // Wait for input and quit
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', process.exit.bind(process, 0));
        default:
            Logger.Instance().log(err);
            break;
    }
});

async function onMessageHandler(target, context, msg, self){
    // Check if the command starts with the prefix
    const config = wrapper.getConfig();

    if (msg[0] === config['prefix']){
        // Remove the prefix and split it into a list
        const message_list  = msg.replace(config['prefix'], '').split(' ');
        const cmd           = message_list[0];
        let args            = null;
        // Check if any arguments is passed
        if (message_list.length > 1){
            args = message_list.splice(1);
        }
        // Log user command
        Logger.Instance().log(`CHAT: ${context['username']} ${cmd} ` + `${args !== null ? '[ ' + args.join(', ') + ' ]' : ''}`, 4);

        //Check if it's a valid command to a script
        let valid = false;
        for (const i in config['scripts']){
            const script = config['scripts'][i];
            if (script['command'] !== '' & script['enabled'] !== false && script['command'] === cmd){
                valid = true;

                if (await context['isFollowing'] === null){
                   Logger.Instance().log(`${context['username']} follower status could not be checked.`, 1)
                }

                // If the script uses args we will return
                if (script['args'] === true && !args){
                    client.say(target, `@${context['username']}, this script uses arguments. ` +  `${script['usage'] !== null && script['usage'] !== '' ? `Usage: ${script['usage']} ` : ''}`);
                    return;
                }

                //Check if script is follow only
                if (script['followerOnly'] ){
                    // Check if the viewer is following
                    context['isFollowing'] = await Api.Instance().isFollowing(context['user-id']);

                    if (await context['isFollowing'] === false && script['followerOnly'] === true){
                        client.say(target, `@${context['username']}, Sorry! this script is follower only.`);
                        return;
                    }
                }
                //Check if script is sub only
                if (script['subscriberOnly'] && !context['subscriber']){
                    client.say(target, `@${context['username']}, Sorry! this script is subscriber only.`);
                    return;
                }

                //Check if script is mod only
                if (script['modOnly'] && !context['mod']){
                    client.say(target, `@${context['username']}, Sorry! this script is moderator only.`);
                    return;
                }

                const date = new Date().getTime();
                // See if the script already is in the cache
                let _script = null;
                for (let j in cache['scripts']){
                    if (cache['scripts'][j]['file'] === script['file']){
                        _script = cache['scripts'][j];
                    }
                }
                // If there is no script push it to the cache with a date
                if (_script === null){
                    _script = {
                        file: script['file'],
                        date: date
                    }
                    cache['scripts'].push(_script);
                } 

                // Calculate the times
                const scriptCooldownTotal       = parseInt(config['cooldown']) + parseInt(script['cooldown']);
                const scriptCooldownSinceLast   = (date - _script['date']) / 1000;
                const scriptCooldownRemaining   = scriptCooldownTotal - scriptCooldownSinceLast;

                // Check if the script is on cooldown, we check if its 0 since we want to execute the script the first time
                if (scriptCooldownSinceLast < scriptCooldownTotal && scriptCooldownSinceLast !== 0){
                    client.say(target, `@${context['username']}, Sorry! the script is on cooldown ${scriptCooldownRemaining.toFixed(1)} s`)
                    Logger.Instance().log(`${script['file']} is on cooldown ${scriptCooldownRemaining}s remaining`, 1);
                }
                // Execute
                else {
                    if (ExecuteScript(script, args)){
                        //say the script name if it isn't empty else script command
                        client.say(target, `@${context['username']}, successfully executed ${script['name'] !== '' ? script['name'] : _script['file']}`);
                        // Update the date
                        cache['scripts'][cache['scripts'].indexOf(_script)]['date'] = new Date().getTime();
                    }
                }
            }
        }
        if (valid === false){
            Logger.Instance().log(`${context['username']} [${cmd}] is not a valid command.`)
        }
    }
}

const ExecuteScript = (script, args=null) => {
    const filePath  = path.join(Wrapper.scriptsFolder, script['file']);
    const fileExt   = path.extname(filePath);
    const config    = wrapper.getConfig();

    // Check if the script uses arguments and if none is provided
    if (script['requireArgs'] === true && args === null){
        return false;
    }
    // Check if script exists in [scripts]
    let exists = false;
    for (const i in config['scripts']){
        if (config['scripts'][i]['file'] === script['file']){
            exists = true;
        }
    }
    if (!exists){
        Logger.Instance().log(`${script['file']} does not exist`, 3);
        return false;
    }

    // Read config and see what extensions are available
    let method = null;
    for (const i in config['execute_config']){
        if (config['execute_config'][i]['ext'] === fileExt){
            method = config['execute_config'][i];

            // Check if the shell in config is a path, so we can determine to use quotes or not
            let shell = '';
            if (method['shell'] !== path.basename(method['shell'])){
                shell = `"${method['shell']}" "${filePath}" ` + `${args !== null ? args.join(' ') : ''}`;
            }else{
                shell = `${method['shell']} "${filePath}" ` + `${args !== null ? args.join(' ') : ''}`;
            }

            //Append to obs.txt
            addExecutingScript(script['file']);

            // Execute
            exec(shell, (err, stdout) => {
                if (err){
                    Logger.Instance().log(err,3);
                }
                Logger.Instance().log(`${script['file']}: ${stdout}`, 4);
                // Return true since we successfully executed the script
                return true;
            })
        }
    }
    if (!method){
        Logger.Instance().log(`Not a valid script ${script['file']}`)
        return false;
    }

}

const addExecutingScript = (scriptName) => {
    // Add the script name to the list
    currentExecutingScripts.push(scriptName)
    fs.writeFileSync('obs.txt', currentExecutingScripts.join('\n'), (err) => { console.log(err)});
    // Wait 5 secounds and remove it
    setTimeout(() => {
        const index = currentExecutingScripts.indexOf(scriptName);
        if (index > -1){
            currentExecutingScripts.splice(index, 1);
        }
        fs.writeFileSync('obs.txt', currentExecutingScripts.join('\n'), (err) => { console.log(err)});
    }, 5000);
}

