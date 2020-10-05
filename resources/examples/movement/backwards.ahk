#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.

#SingleInstance force ; Ensures only one instance of the script is running
SetKeyDelay,40,20 ; Global delay that will occur after each keystroke
SendMode, input ; Switches to the SendInput method for Send
Blockinput, On ; Block user or computer input to prevent messing with the script


Input = s

SendInput, {%Input% down}
Sleep, 5000
SendInput, {%Input% up}
Sleep, 45