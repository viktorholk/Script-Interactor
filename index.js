var TwitchJs = require('twitch-js').default;
var config = require('./config.json');

const username  = config.username;
const token     = config.token;

const { chat } = new TwitchJs({ username, token })
const channel = 'tactoc';

chat.connect().then(() => {
    chat.join(channel) .then(channelState => {
        chat.on('PRIVMSG', message => {
            console.log(message);
        });
    })
})

