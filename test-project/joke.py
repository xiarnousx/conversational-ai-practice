import urllib.request
import json

from config import (
    BANNER,
    EMOJI_JOKE_HEADER,
    EMOJI_JOKE_LINE,
    EMOJI_FETCHING,
    EMOJI_PROMPT,
    EMOJI_GOODBYE,
    EMOJI_WAVE,
)


def fetch_joke():
    url = "https://api.chucknorris.io/jokes/random"
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request) as response:
        data = json.loads(response.read().decode())
    return data["value"]


def display_joke(joke, count):
    width = 60
    border = "═" * width
    print(f"\n{EMOJI_JOKE_HEADER} Joke #{count}:")
    print(f"╔{border}╗")
    words = joke.split()
    line = f"  {EMOJI_JOKE_LINE}  "
    for word in words:
        if len(line) + len(word) + 1 > width + 2:
            print(f"║{line:<{width+2}}║")
            line = "       " + word
        else:
            line += " " + word
    print(f"║{line:<{width+2}}║")
    print(f"╚{border}╝")


if __name__ == "__main__":
    print(BANNER)
    count = 0
    while True:
        print(f"{EMOJI_FETCHING} Fetching a fresh joke...")
        joke = fetch_joke()
        count += 1
        display_joke(joke, count)
        answer = input(f"\n{EMOJI_PROMPT} Want to hear another one? (yes/no): ").strip().lower()
        if answer not in ("yes", "y"):
            print(f"\n{EMOJI_GOODBYE} Thanks for laughing with Chuck! See ya! {EMOJI_WAVE}\n")
            break
