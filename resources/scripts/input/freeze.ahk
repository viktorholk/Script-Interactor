#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.

#SingleInstance force ; Ensures only one instance of the script is running

freezeTime = 6000 ; 6000 ms = 6 s

Blockinput, On ; Blocks all input
Sleep, freezeTime ; Sleeps
Blockinput, Off ; Unblocks all input