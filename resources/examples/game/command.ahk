#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.

#SingleInstance force ; Ensures only one instance of the script is running
SendMode, input ; Switches to the SendInput method for Send
Blockinput, On ; Block user or computer input to prevent messing with the script

CHAT_KEY        = t
; Keep this in one line >
CHAT_COMMANDS   := { "help": "/help", "spawn_bear": "/spawn bear" }

if (%0% > 1){
    for k, v in CHAT_COMMANDS
        if (%k% == %1%){
            MsgBox, yes
        }
}

