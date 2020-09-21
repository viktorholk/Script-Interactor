const TwitchJs      = require('twitch-js').default;
const Wrapper       = require('./helpers/Wrapper')
const ScriptHandler = require('./helpers/ScriptHandler');
const Script        = require('./helpers/Script');

// const config = require('./config.json');
// const username  = config.username;
// const token     = config.token;

// const { chat } = new TwitchJs({ username, token })
//const channel = 'tactoc';
_obj = new Script('myfile.py');
new ScriptHandler(_obj).AppendScript();
// chat.connect().then(() => {
//     chat.join(channel) .then(channelState => {
//         chat.on('PRIVMSG', message => {
//             console.log(message)
//         });
//     })
// })

