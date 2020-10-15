#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
#SingleInstance force ; Ensures only one instance of the script is running
SetKeyDelay,40,20 ; Global delay that will occur after each keystroke
SendMode, input ; Switches to the SendInput method for Send
Blockinput, On ; Block user or computer input to prevent messing with the script

; how long should the key be pressed
pressTime = 5000

if (%0% >= 1){
    StringLower, input, 1
    ; change input from
    if      (input = "forwards" or input = "front" or input = "w"){
        input = w
    }
    else if (input = "left" or input = "a"){
        input = a
    }
    else if (input = "backwards" or input = "back" or input = "s"){
        input = s
    }
    else if (input = "right" or input = "d"){
        input = d
    }
    ; if the argument is invalid just move forwards
    else {
        input = w
    }

    SendInput, {%Input% down}
    Sleep, pressTime
    SendInput, {%Input% up}
    
}

