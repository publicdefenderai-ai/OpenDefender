"""Compare four downloaded official TCSS chapter files against the retained DWI evidence."""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re


def check(packet, directory):
    for key, document in packet["sources"].items():
        law, section = key.split(":")
        chapter = section.split(".")[0]
        raw = (directory / f"{law}.{chapter}.htm").read_bytes()
        if hashlib.sha256(raw).hexdigest() != document["chapterSha256"]:
            raise ValueError(f"{key}: source chapter bytes differ; compare versions before reuse")
        marker = f'<p class="left"><a name="{section}">'
        matches = raw.decode("utf-8-sig").split(marker)
        if len(matches) != 2:
            raise ValueError(f"{key}: expected one official section anchor")
        block = matches[1].split('<p class="left"><a name="', 1)[0]
        separated = re.sub(r"<br\s*/?>|</p>", "\n", block, flags=re.I)
        normalized = " ".join(html.unescape(re.sub(r"<[^>]+>", "", separated)).split())
        if normalized != document["text"]:
            raise ValueError(f"{key}: retained section text differs")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path, help="Directory with PE.49.htm, PE.12.htm, TN.541.htm and TN.709.htm")
    args = parser.parse_args()
    packet = json.loads(Path("scripts/data-review/output/texas-dwi-branch-candidate.json").read_text())
    check(packet, args.directory)
