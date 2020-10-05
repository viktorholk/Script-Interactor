

<p align="center">
    <img src="https://i.imgur.com/nWw1pUt.png">
  <b>Script Interactor</b><br>
  Version: <b>1.2.0</b><br>
  Contributors: <a href="https://github.com/viktorholk">viktorholk</a></p>

# Script Interactor
Script Interactor is a twitch chatbot tool built in Node JS. It encourages your viewers to interact with your twitch stream by letting them execute various custom scripts, where you as the broadcaster is the target.<br>

# Installation
Clone the repository and run it with ``node index.js`` in your terminal, or go to [releases](https://github.com/viktorholk/Script-Interactor/releases) and download the latest executable.

# Usage
First time you run the program it will create the necessary folders and files.<br>
But you will also be greeted with this following error message.

<p align="center">
    <img src="https://i.imgur.com/0hAEnG7.png"></p>
    
To fix this, you open your new ``config.json`` configuation file and edit your identity and channels.<br>
But first, you have to generate a OAuth token that you need to authenticate the bot<br>
go to [twitchapps.com/tmi](https://twitchapps.com/tmi/) and log in to retrieve your token.<br>
**THIS WORKS LIKE A PASSWORD TO YOUR ACCOUNT SO DONT SHARE IT WITH ANYONE**<br>
Since my twitch username is [tactoc](https://twitch.tv/tactoc) i would configure it as such.
```
        "identity": {
            "username": "tactoc",
            "password": "oauth:abcdefghijklmopqrstu1234567890"
        },
        "channels": [
            "tactoc"
        ]
```
*You can also create a seperate account to use as the chatbot instead of your own account*<br>
*Remember then to use the ``"channels": ["<Broadcaster channel>"]`` and your bot credentials for the identity*.<br>

...
