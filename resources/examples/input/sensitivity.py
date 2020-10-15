import ctypes
from sys import argv
from time import sleep

# Change these variables to your fit
# Speed is between 1 and 20
FAST = 20
SLOW = 1
WAIT = 5

# Only touch the code under here if you know what you're doing

def change_speed(speed):
    set_mouse_speed = 113   # 0x0071 for SPI_SETMOUSESPEED
    ctypes.windll.user32.SystemParametersInfoA(set_mouse_speed, 0, speed, 0)

def get_current_speed():
    get_mouse_speed = 112   # 0x0070 for SPI_GETMOUSESPEED
    speed = ctypes.c_int()
    ctypes.windll.user32.SystemParametersInfoA(get_mouse_speed, 0, ctypes.byref(speed), 0)

    return speed.value

if __name__ == "__main__":
    if (len(argv) > 1):
        setting = argv[1].lower()
        # Get standard speed so we can reset it back
        standard_speed = get_current_speed()
        try:
            if setting in ["fast", "high"]:
                # Change speed to 20 which is fast
                change_speed(FAST)
            elif setting in ["slow", "low"]:
                # Change speed to 1 which is slow
                change_speed(SLOW)
            else:
                # if input is invalid just change sens anyways to high
                change_speed(FAST)
            # Wait 5 seconds
            sleep(WAIT)
            change_speed(standard_speed)
        # if the script gets forcefully stopped we will still reset to standard speed
        finally:
            # Reset sens
            change_speed(standard_speed)