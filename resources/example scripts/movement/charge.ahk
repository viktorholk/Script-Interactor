#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
#SingleInstance force ; Ensures only one instance of the script is running
SetKeyDelay,40,20 ; Global delay that will occur after each keystroke
Blockinput, On ; Block user or computer input to prevent messing with the script

; how long should the key be pressed

direction = w

SendEvent, {%direction% down}
Loop, 40 {
    Click
    Sleep, 250
}
SendEvent, {%direction% up}

