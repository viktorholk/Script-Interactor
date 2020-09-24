
const tmi           = require('tmi.js');

const { Wrapper, Handler, Logger, API } = require('./helpers');



/// Main program
Wrapper.Instance().ValidateScripts();
// Import the config from config.json with our wrapper
let config = Wrapper.Instance().ReadJson(Wrapper.Instance().configPath);

// Twitch options


// Client
const client = new tmi.client(config.opts);

// Events
client.on('connecting', (address, port) => {
    Logger.Instance().Log(`Connecting ${address}:${port}`, 1);
})

client.on('connected', () => {
    Logger.Instance().Log(`Connected`)
})

client.on('disconnected', (reason) => {
    Logger.Instance().Log(`Lost Connection - ${reason}`, 3);
})

client.on('reconnect', () => {
    Logger.Instance().Log('Reconnecting', 1);
})

client.on('logon', () => {
    Logger.Instance().Log('Ready', 2);
});

client.on('join', (channel, username, self) => {
    if (self) { return }
    Logger.Instance().Log(`${username} joined`, 1);
})

client.on('part', (channel, username, self) => {
    if (self) { return }
    Logger.Instance().Log(`${username} left`, 1);
})

client.on('message', onMessageHandler);
// Connect
client.connect();

// Our cache that holds the date from when a script last was executed
let cache   = {
    scripts:    [] 
}

async function  onMessageHandler (target, context, msg, self){
    // Check if the message is a command
    if (msg.charAt(0) === config.prefix){
        // Print the command
        Logger.Instance().Log(`CHAT: ${context['username']} ${msg}`, 4);

        // get the command without the prefix
        const message_list = msg.replace('!', '').split(' ');
        const cmd   = message_list[0];
        let args = null;

        if (message_list.length > 1){
            args  = message_list.slice(1);
        }
        // Find the script
        for (let i in config['scripts']){
            const _script = config['scripts'][i];
            // Make sure the user isn't on cooldown
            if (_script['scriptCommand'] !== '' && _script['enabled'] !== false  && _script['scriptCommand'] === cmd){
                // Check if user is following
                context['isFollowing'] = await API.Instance().isFollowing(context['user-id']);

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
                const scriptCooldownTotal       = parseInt(config['cooldown']) + parseInt(_script['cooldown']);
                const scriptCooldownSinceLast   = (_date - __script['date']) / 1000;
                const scriptCooldownRemaining   = scriptCooldownTotal - scriptCooldownSinceLast;


                // Check if the script is on cooldown, we check if its 0 since we want to execute the first command typed
                if (scriptCooldownSinceLast < scriptCooldownTotal && scriptCooldownSinceLast !== 0){
                    client.say(target, `@${context['username']}, Sorry! the script is on cooldown ${scriptCooldownRemaining.toFixed(1)} s`)
                    Logger.Instance().Log(`${_script['script']} is on cooldown ${scriptCooldownRemaining}s remaining`, 1);
                }else{
                    // Print the script name if it isn't empty else script command
                    if(new Handler(_script['script']).Execute(args)){
                        client.say(target, `@${context['username']}, Successfully executed ${_script['name'] !== '' ? _script['name'] : _script['scriptCommand']}`);
                    }
                    // Update the date
                    cache['scripts'][cache['scripts'].indexOf(__script)]['date'] = new Date().getTime();
                    return;
                }
            }
        }
    }else{
        // if it isn't a command log it anyways but with Logger.Log(,1)
        Logger.Instance().Log(`CHAT: ${context['username']} ${msg}`, 1);
    }
}   
