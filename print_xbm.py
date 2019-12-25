from __future__ import print_function

import math
import re
import sys


def read_file(path):
    with open(path, "r") as xbm_file:
        return xbm_file.read()


def get_width(xbm):
    regex = re.compile(".*_width ([0-9]+).*", re.DOTALL)
    match = regex.match(xbm)

    width = int(match.group(1))

    if width % 8 == 0:
        return width
    else:
        return math.ceil(width / 8) * 8

def get_data(xbm):
    regex = re.compile(".*\{(.+)\}.*", re.DOTALL)
    match = regex.match(xbm)

    return match.group(1).strip()


def to_bin(n):
    num = bin(n).replace("0b", "")
    return "".join(reversed(("0" * (8 - len(num)) + num)))


def print_xbm(data, width):
    bits = [to_bin(int(n, 16)) for n in data.split(",") if n != ""]
    bitstr = "".join(bits)

    for i, c in enumerate(bitstr):
        print("#" if c == "1" else " ", end="")

        if (i + 1) % width == 0:
            print()


def main(path):
    xbm = read_file(path)

    width = get_width(xbm)
    data = get_data(xbm)

    print_xbm(data, width)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("USAGE:", sys.argv[0], "path")
        sys.exit(1)

    main(sys.argv[1])
