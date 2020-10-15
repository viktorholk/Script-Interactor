#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
#Warn
#SingleInstance force ; Ensures only one instance of the script is running
SetKeyDelay,40,20 ; Global delay that will occur after each keystroke
SendMode, input ; Switches to the SendInput method for Send
Blockinput, On ; Block user or computer input to prevent messing with the script

pressTime = 5000

if (%0% >= 1){
    StringLower, input, 1
    ; Check if the user said forwards or just the key press
    if (input = "forwards" or input = "w")
    {
        input = w
    }
    else if (input = "backwards" or input = "s")
    {
        input = s
    }
    else if (input = "right" or input = "d")
    {
        input = d
    }
    else if (input = "left" or input = "a")
    {
        input = a
    }
    ; if the input is invalid just walk forwards
    else{
        input = w
    }
    SendInput, {%Input% down}
    Sleep, pressTime
    SendInput, {%Input% up}
    
}

