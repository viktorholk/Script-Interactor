

<p align="center">
    <img src="https://i.imgur.com/nWw1pUt.png">
  <b>Script Interactor</b><br>
  Version: <b>1.2.3</b><br>
  Contributors: <a href="https://github.com/viktorholk">viktorholk</a></p>
  
<p align="center">
     <a href="#installation">Installation</a> •
    <a href="#discord">Discord</a> •
     <a href="#features">Features</a> •
    <a href="#setup">Setup</a> •
     <a href="#usage">Usage</a> •
    <a href="#scripts">Scripts</a> •
    <a href="#metadata">Metadata</a> •
    <a href="#obs">OBS</a> •
    <a href="#resources">Resources</a> •
    <a href="#license">License</a>
</p>

# Script Interactor
Script Interactor is a twitch chatbot tool built in Node js. It encourages your viewers to interact with your twitch stream by letting them execute various custom scripts, where you as the broadcaster is the target.<br>
* **How does it work?**<br >
    It works by putting your wanted script in the generated ``scripts/`` folder and then configure the script in the generated ``config.json``.<br>
    You run the program and from the config it will run the script when a viewer types the command in chat.
* **Is it safe?**<br >
    Yes it is safe. It only runs scripts that you have configured yourself.<br >
    The example scripts provided in ``resources/examples`` is completely unharmful. The scripts only take over your computer in a brief moment.

# Discord
Join the discord if you have any issues or questions <br >
* **[Invite](https://discord.gg/MZyktMG)**
# Installation
#### It is recommended to have the following programs installed before proceeding
* [**Node**](https://nodejs.org/en/) Will be used to run the program and install the necessary modules
* [**Python**](https://www.python.org/downloads/) Will be used to execute Python scripts
* [**AutoHotKey**](https://www.autohotkey.com/) Will be used to execute AutoHotKey scripts

<br>

* **Clone** the repository <br>

* **Run** the program <br>
    You can run it with the ``Script Interactor.bat``, which will run ``resources/Script Interactor.exe`` with admin privileges. <br>
    The easiest is the executable.<br>
    **Remember to run with admin privileges** ( Otherwise some scripts will not be working properly )
    
    * Executable
        * Run ``Script Interactor.bat``

    * Node:
        * Install node modules <br>
        In your terminal, type ``npm install`` where both your ``package.json`` & ``package-lock.json`` is located.<br>
        This will install the necessary modules to run the program<br>

        * Run Script-Interactor <br>
            With ``node index.js`` in your terminal <br>
            **Remember to start your terminal with admin privileges**

<br>



# Features
|                            | 📷 Script Interactor  |
| -------------------------- | :----------------: |
| Lightwight tool            |         ✔️         |
| Execute various languages            |         ✔️         |
| Scripts included             |         ✔️         |
| Easy to configure          |         ✔️         |
| Open source                |         ✔️         |
| Made by a legoman                |         🇩🇰         |

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
{
    "identity": {
        "username": "tactoc",
        "password": "oauth:abcdefghijklmopqrstu1234567890"
    },
    "channels": [
        "tactoc"
    ],
...
 
```
*You can also create a seperate account to use as the chatbot instead of your own account*<br>
*Remember then to use the ``"channels": ["<Broadcaster channel>"]`` and your bot credentials for the identity*.<br>

In the ``config.json`` you can also change the prefix for the commands and the global cooldown for all scripts<br>
```
...
"prefix": "!",
"cooldown": 30,
...
```
* **prefix** Prefix of the interact commands ``['string']``
* **cooldown** Global cooldown to wait before script can be executed again. ``['number']``

# Usage
The way that this works, is that there is a scripts folder that will be generated on launch. This folder and your ``config.json`` configuation file is the two files that you will be working with.<br >
You will be putting all your scripts in this folder and it will automatically register the script' metadata into your ``config.json``.

<p align="center">
    <img src="https://i.imgur.com/jOxb6Yb.png"></p>
    
    
## Scripts
All script languages can be configured to execute.<br>
You can create anything between simple AutoHotkey scripts to advanced python scripts<br>
Configuation of the script and the executable method can be find in your ``config.json``<br>
```
...
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
...
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
            * ``python myscript.py``
        * To run autohotkey, which we don't have in our path, we will use the path to the autohotkey executable
            * ``C:\\Program Files\\AutoHotkey\\autohotkey.exe myscript.ahk``
    

## Metadata
This is the metadata of the script, that will be generated when you put it into your ``scripts/``<br>
``` 
{
    "enabled": true,
    "name": "Freeze",
    "file": "freeze.ahk",
    "command": "freeze",
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
* **followerOnly** Follower only ``[true / false]``
* **subscriberOnly**  Subscriber only ``[true / false]``
* **modOnly** Mod only ``[true / false]``

If you're importing a custom script that comes with a ``<script name>.json``<br>
That means that the `json` file contains some default metadata settings for the script.<br>
To add these import both the script and the json file, and it will add the default values to the script' metadata

<p align="center">
    <img src="https://i.imgur.com/0dlkNXy.png"></p>

The json file will then be removed after import.
* Example
```
{
    "file"         : "boom.ahk",
    "modOnly"        : true
}
```
Will turn into 
```
{
    "enabled": false,
    "name": "",
->  "file": "boom.ahk",
    "command": "",
    "args": false,
    "usage": "",
    "cooldown": 15,
    "followerOnly": false,
    "subscriberOnly": false,
->  "modOnly": true
}
```

<br >

``This is a sample``

```
{    
    "enabled"       : true,
    "name"          : "",
    "file"          : "",
    "command"       : "",
    "args"          : false,
    "usage"         : "",
    "cooldown"      : 0,
    "followerOnly"  : false,
    "subscriberOnly": false,
    "modOnly"       : false
}
```

Remember to restart the bot when you have made changes to the ``config.json``.

# OBS
If you want to show the current running scripts on the stream as text.<br>
Go to your scene and `Sources`. Create a new Text Source. Enable ``Read from file``. Browse the path for the directory of ``Script Interactor`` and select ``obs.txt``

<p align="center">
    <img src="https://i.imgur.com/sbd4ZmV.png"></p>


# Resources
In the repository there is a ``resources`` folder.<br>
This will be where i will upload example scripts that you can use on your stream.<br>
If you have an interesting script you want included feel free to ask!

# License
**Script Interactor** is under the [GNU General Public License v3.0](LICENSE)
