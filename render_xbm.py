from __future__ import print_function, division

import math
import re
import sys

from PIL import Image, ImageDraw


def read_file(path):
    with open(path, "r") as xbm_file:
        return xbm_file.read()


def get_width(xbm):
    regex = re.compile(r".*_width ([0-9]+).*", re.DOTALL)
    match = regex.match(xbm)

    return int(match.group(1))


def get_height(xbm):
    regex = re.compile(r".*_height ([0-9]+).*", re.DOTALL)
    match = regex.match(xbm)

    return int(match.group(1))


def get_data(xbm):
    regex = re.compile(r".*\{(.+)\}.*", re.DOTALL)
    match = regex.match(xbm)

    return match.group(1).strip()


def to_bin(n):
    num = bin(n).replace("0b", "")
    return "".join(reversed(("0" * (8 - len(num)) + num)))


def draw_image(data, width, height, scale=10):
    img = Image.new("RGB", (width * scale, height * scale))
    draw = ImageDraw.Draw(img)

    file_width = math.ceil(width / 8) * 8
    bitstr = "".join(
        to_bin(int(n, 16)) for n in data.split(",")
        if n != ""
    )

    for i, c in enumerate(bitstr):
        y = (i // file_width)
        x = (i % file_width)

        if x > width:
            continue

        fill_color = "#118477" if c == "1" else "#FFFFFF"

        draw.rectangle([
            (x * scale, y * scale),
            (x * scale + scale, y * scale + scale)
        ], fill=fill_color, outline="#E2E2E2")

    img.show()


def main(path):
    xbm = read_file(path)

    draw_image(
        get_data(xbm),
        get_width(xbm),
        get_height(xbm)
    )


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("USAGE:", sys.argv[0], "path")
        sys.exit(1)

    main(sys.argv[1])
