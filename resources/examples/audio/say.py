from sys import argv


def play_through_mic(audioname):
    pass

if __name__ == "__main__":
    # Check if a audio name to play, is passed to the script
    if len(argv) > 1:
        audioname = argv[1]
        play_through_mic(audioname)
    else:
        print("No audio is specified.")