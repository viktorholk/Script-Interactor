const { exception } = require('console');
const path          = require('path');
const tmi           = require('tmi.js');

const { Wrapper, ExecuteScript, Handler, Logger, API } = require('./helpers');
/// Main program
Wrapper.Instance().ValidateScripts();
// Twitch options
// Client

const client = new tmi.client(Wrapper.Instance().GetConfig().opts);

// Events
client.on('connecting', (address, port) => {
    Logger.Instance().Log(`Connecting ${address}:${port}`, 1);
})

client.on('connected', () => {
    Logger.Instance().Log(`Connected`)
});

client.on('disconnected', (reason) => {
    Logger.Instance().Log(`Lost Connection - ${reason}`, 3);
});

client.on('reconnect', () => {
    Logger.Instance().Log('Reconnecting', 1);
});

client.on('logon', () => {
    Logger.Instance().Log('Ready', 2);
});

client.on('join', (channel, username, self) => {
    if (self) { return }
    Logger.Instance().Log(`${username} joined`, 1);
});

client.on('part', (channel, username, self) => {
    if (self) { return }
    Logger.Instance().Log(`${username} left`, 1);
});

client.on('message', onMessageHandler);
// Connect
client.connect().catch((err) => {
    switch (err){
        case 'Invalid NICK.':
            Logger.Instance().Log('Configure ./config.json with your twitch credentials', 3)
            Logger.Instance().Log('username : <Your twitch username>', 1)
            Logger.Instance().Log('password : <Your OAuth token>', 1)
            Logger.Instance().Log('channels : [ "<Your username>" ]', 1)
    }
});


// Our cache that holds the date from when a script last was executed
let cache   = {
    scripts:    [] 
}

async function onMessageHandler(target, context, msg, self){
    //Check if the command starts with the prefix, then its a command
    const prefix = Wrapper.Instance().GetConfig()['prefix'];

    if (msg[0] === prefix){
        // Remove the prefix and split it into a list
        const message_list      = msg.replace(prefix, '').split(' ');
        const cmd               = message_list[0];
        let args                = null;
        // Check if any arguments is parsed
        if (message_list.length > 1){
            args = message_list.splice(1);
        }
        // Log user command
        Logger.Instance().Log(`CHAT: ${context['username']} ${cmd} ` + `${args !== null ? '[ ' + args.join(', ') + ' ]' : ''}`, 4);

        // Check if user is following
        context['isFollowing'] = await API.Instance().isFollowing(context['user-id']);

        // Check if it is a valid command
        let scripts = Wrapper.Instance().GetConfig()['scripts'];

        let scriptFound = false;
        for (let i in scripts){
            let _script = scripts[i];
            if (_script['scriptCommand'] !== '' && _script['enabled'] !== false  && _script['scriptCommand'] === cmd){

                scriptFound = true;

                // If the script is configuered to now allow args we will reset them to null
                if (_script['requireArgs'] === true && !args){
                    client.say(target, `@${context['username']}, this script uses arguments. ` +  `Example: ${_script['argsExample'] !== null && _script['argsExample'] !== '' ? `( ${_script['argsExample']} )` : ''}`)
                    return;
                }

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
                const scriptCooldownTotal       = parseInt(Wrapper.Instance().GetConfig()['cooldown']) + parseInt(_script['cooldown']);
                const scriptCooldownSinceLast   = (_date - __script['date']) / 1000;
                const scriptCooldownRemaining   = scriptCooldownTotal - scriptCooldownSinceLast;


                // Check if the script is on cooldown, we check if its 0 since we want to execute the first command typed
                if (scriptCooldownSinceLast < scriptCooldownTotal && scriptCooldownSinceLast !== 0){
                    client.say(target, `@${context['username']}, Sorry! the script is on cooldown ${scriptCooldownRemaining.toFixed(1)} s`)
                    Logger.Instance().Log(`${_script['script']} is on cooldown ${scriptCooldownRemaining}s remaining`, 1);
                }else{
                    
                if(ExecuteScript(_script, args)){
                    //Print the script name if it isn't empty else script command
                    client.say(target, `@${context['username']}, successfully executed ${_script['name'] !== '' ? _script['name'] : _script['scriptCommand']}`);
                    // Update the date
                    cache['scripts'][cache['scripts'].indexOf(__script)]['date'] = new Date().getTime();
                    return;
                }
                }

            }
        }
        if (scriptFound === false){
            Logger.Instance().Log(`${context['username']} [${cmd}] is not a valid command.`)
        }
    }
}


