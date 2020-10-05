#NoEnv
#SingleInstance, force


; Reverse the controls for 8 sec and then quit
SetTimer, Quit,8000

w::s
s::w
a::d
d::a

Quit:
    ExitApp



