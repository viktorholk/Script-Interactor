

<p align="center">
    <img src="https://i.imgur.com/nWw1pUt.png">
  <b>Script Interactor</b><br>
  Version: <b>1.2.0</b><br>
  Contributors: <a href="https://github.com/viktorholk">viktorholk</a></p>

# Script Interactor
Script Interactor is a twitch chatbot tool built in Node JS. It encourages your viewers to interact with your twitch stream by letting them execute various custom scripts, where you as the broadcaster is the target.<br>

# Installation
Clone the repository and run it with ``node index.js`` in your terminal, or go to [releases](https://github.com/viktorholk/Script-Interactor/releases) and download the latest executable.

# Setup
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

# Usage
The way that this works, is that there is a scripts folder that will be generated on launch. This folder and your ``config.json`` configuation file is the two files that you will be working with.<br >
You will be putting all your scripts in this folder and it will automatically register the script' metadata in your ``config.json``.

<p align="center">
    <img src="https://i.imgur.com/jOxb6Yb.png"></p>
    
    
## Scripts
All script types is welcome.<br>
You can create anything between simple AutoHotkey scripts to advanced python scripts<br>
Configuation of the script and the executable method can be find in your ``config.json``<br>
```
"execute_config": [
    {
        "name": "AutoHotkey",
        "ext": ".ahk",
        "shell": "C:\\Program Files\\AutoHotkey\\autohotkey.exe "
    },
    {
        "name": "python",
        "ext": ".py",
        "shell": "python "
    }
]
```
To add a new custom executable method you create a new item in the list with the fields ``name``
    

## Metadata

``` 
{
    "enabled": true,
    "name": "Freeze the computer for 5 seconds",
    "script": "freeze.ahk",
    "scriptCommand": "freeze",
    "args": false,
    "usage": "!freeze",
    "cooldown": 15,
    "followerOnly": true,
    "subscriberOnly": false,
    "modOnly": false
}
```
