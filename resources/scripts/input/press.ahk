#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.

#SingleInstance force ; Ensures only one instance of the script is running
SetKeyDelay,40,20 ; Global delay that will occur after each keystroke
SendMode, input ; Switches to the SendInput method for Send
Blockinput, On ; Block user or computer input to prevent messing with the script

; %1% is the argument that is passed into the script

; check if atleast one argument is passed. Argument 1 is the key to press
if (%0% >= 1){
    Input = %1%

    SendInput, {%Input% down}
    Sleep, 70
    SendInput, {%Input% up}
    Sleep, 45

}