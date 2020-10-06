

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

In the ``config.json`` you can also change the prefix for the commands and the global cooldown for all scripts<br>
```
    "prefix": "!",
    "cooldown": 30,
```
* **prefix** Prefix of the interact commands ``['string']``
* **cooldown** Global cooldown to wait before script can be executed again. ``['number']``

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
To add a new custom executable method you create a new item in the list with the fields ``name``, ``ext``, ``shell``<br >

* **name** Name of the executable method
* **ext**  Extension of the script type
    * *For instance:*
        * pythonscript **.py**
        * ahkscript **.ahk**
        * myjava **.java**
* **shell** The shell to run the script in your terminal
    * *For instance:*
        * To run python in shell we will just use ``python `` since we have it in our windows path (in this example)
        * To run autohotkey, which we don't have in our path, we will use the path to the autohotkey executable as shell
            * ``python myscript.py``
            * ``C:\\Program Files\\AutoHotkey\\autohotkey.exe myscript.ahk``
    

## Metadata
This is the metadata of the script, that will be generated when you put it into your ``scripts/``<br>
``` 
{
    "enabled": true,
    "name": "Freeze",
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
* **enabled** Enable or disable the script. ``[true / false]``
* **name**  The name of the script (this will also be shown on the stream if you set it up) ``['string']``
* **script** The scriptname with extension in the ``scripts/`` folder ``['string']``
* **scriptcommand** The command to execute the script, remember this is without the prefix of the command ``['string']``
* **args** If the script uses arguments ``[true / false]``
* **usage** Example of the script usage, example ``!press w`` ``['string']``
* **cooldown** The cooldown of the script. This will be the sum of the global cooldown and this cooldown ``['number']``
* **followerOnly** Follower only ``[true / false]`
* **subscriberOnly**  Subscriber only ``[true / false]`
* **modOnly** Mod only ``[true / false]`

Remember to restart the bot when you have made changes to the ``config.json``.

# OBS (Open Broadcaster Software®️)
If you want to show the current running scripts on the stream as text.<br>
Go to your scene and `Sources`. Create a new Text Source. Enable ``Read from file``. Browse the path for the directory of ``Script Interactor`` and select ``obs.txt``

<p align="center">
    <img src="https://i.imgur.com/sbd4ZmV.png"></p>


# Resources
In the repository there is a ``resources`` folder.<br>
This will be where i will upload example scripts that you can use on your stream.<br>
If you have an interesting script you want included feel free to ask!
