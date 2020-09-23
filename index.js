const MetadataHandler = require('./helpers/MetadataHandler');

const TwitchJs = require('twitch-js').default;
const config = require('./config.json');
const ScriptHandler = require('./helpers/ScriptHandler');

const username  = config.username;
const token     = config.token;

const { chat } = new TwitchJs({ username, token })
const channel = 'tactoc';

let metadataHandler = new MetadataHandler().Instance();
chat.connect().then(() => {
    chat.join(channel) .then(channelState => {
        chat.on('PRIVMSG', message => {
            console.log(message)
        });
    })
})

