const tmi           = require('tmi.js');
const {Wrapper, Logger, Api} = require('./helpers');

const wrapper = new Wrapper();
wrapper.ValidateScripts();

const client = new tmi.client(wrapper.getConfig().opts);

// Events
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

}

