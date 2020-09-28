import pyautogui

# Not a guaranteed 360, since we can't determine what the ingame sens is

SPEED = 0.2

if __name__ == "__main__":
    screenWidth       = pyautogui.size()[0]
    pyautogui.moveRel(screenWidth,0, SPEED)