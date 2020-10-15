import ctypes
from time import sleep

def change_speed(speed):
    #   1 - slow
    #   10 - standard
    #   20 - fast

    set_mouse_speed = 113   # 0x0071 for SPI_SETMOUSESPEED
    ctypes.windll.user32.SystemParametersInfoA(set_mouse_speed, 0, speed, 0)

def get_current_speed():
    get_mouse_speed = 112   # 0x0070 for SPI_GETMOUSESPEED
    speed = ctypes.c_int()
    ctypes.windll.user32.SystemParametersInfoA(get_mouse_speed, 0, ctypes.byref(speed), 0)

    return speed.value

if __name__ == "__main__":
    # Get standard speed so we can reset it back
    standard_speed = get_current_speed()
    # Change speed to 20 which is fast
    change_speed(20)
    # Wait 5 seconds
    sleep(5)
    # Reset sens
    change_speed(standard_speed)