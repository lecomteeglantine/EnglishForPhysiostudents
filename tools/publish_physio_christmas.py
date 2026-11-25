#!/usr/bin/env python3
"""Publish only released Case 2412 content; never commit the private source."""
import argparse
import base64
import datetime as dt
import json
import re
from pathlib import Path
from zoneinfo import ZoneInfo

PAYLOAD = re.compile(r'(<script\s+id="payload"\s+type="application/json">)(.*?)(</script>)', re.S)
ACCUSATION = re.compile(r'function accuse\(\)\{.*?(?=function render\()', re.S)
START = dt.date(2026, 12, 1)

def load(html):
    matches = list(PAYLOAD.finditer(html))
    if len(matches) != 1:
        raise ValueError("Expected exactly one payload")
    data = json.loads(matches[0].group(2))
    # Keep the archival master intact; normalise the approved character name
    # before any dated release or confidential beta is generated.
    if data.get("demo") is True:
        def rename(value):
            if isinstance(value, str):
                return re.sub(r"\bDexter\b", "Grumble", value)
            if isinstance(value, list):
                return [rename(item) for item in value]
            if isinstance(value, dict):
                return {key: rename(item) for key, item in value.items()}
            return value
        data = {key: value if key == "assets" else rename(value)
                for key, value in data.items()}
    return data

def release(template, master, today):
    source = load(master)
    current = load(template)
    if source.get("demo") is not True or current.get("demo") is not False:
        raise ValueError("Wrong source or public template")
    if [d["day"] for d in source["days"]] != list(range(1,25)):
        raise ValueError("Master must contain exactly 24 ordered days")
    limit = max(0, min(24, (today - START).days + 1))
    if any(d["day"] > limit for d in current["days"]):
        raise ValueError("Public file already contains a future day")
    days = source["days"][:limit]
    keys = {"L08"}
    for day in days:
        keys.update(day.get("images", []))
        keys.update(day.get("reveal", {}).get("images", []))
    if limit >= 2:
        keys.update("p"+str(i) for i in range(8))
    if not keys <= source["assets"].keys() or not keys <= source["captions"].keys():
        raise ValueError("A released image or caption is missing")
    out = {"demo": False, "days": days,
           "suspects": source["suspects"] if limit >= 2 else [],
           "assets": {k: source["assets"][k] for k in sorted(keys)},
           "captions": {k: source["captions"][k] for k in sorted(keys)}}
    encoded = json.dumps(out, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")
    result = PAYLOAD.sub(lambda m: m[1]+encoded+m[3], template, count=1)
    if limit >= 23:
        funcs = ACCUSATION.findall(master)
        if len(funcs) != 1 or len(ACCUSATION.findall(result)) != 1:
            raise ValueError("Cannot locate accusation interface")
        result = ACCUSATION.sub(lambda m: funcs[0], result, count=1)
    if load(result) != out:
        raise ValueError("Payload verification failed")
    return result

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--master", required=True, type=Path)
    p.add_argument("--public", required=True, type=Path)
    p.add_argument("--check-all", action="store_true")
    a = p.parse_args()
    template = a.public.read_text(encoding="utf-8")
    master = a.master.read_text(encoding="utf-8")
    if a.check_all:
        source = load(master)
        if len(source["assets"]) != 30 or set(source["assets"]) != set(source["captions"]):
            raise ValueError("Expected 30 matching image/caption records")
        for image in source["assets"].values():
            prefix = "data:image/webp;base64,"
            if not image.startswith(prefix):
                raise ValueError("Unexpected image format")
            raw = base64.b64decode(image[len(prefix):], validate=True)
            if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP" or int.from_bytes(raw[4:8], "little") + 8 != len(raw):
                raise ValueError("Invalid WebP container")
        if len(set(source["assets"].values())) != 30:
            raise ValueError("Duplicate image records")
        if not all(isinstance(d.get("text"), str) and d["text"].strip() for d in source["days"]):
            raise ValueError("Missing day text")
        # Reset only an in-memory copy, never the actual public file.
        initial = {"demo": False, "days": [], "suspects": [],
                   "assets": {"L08": source["assets"]["L08"]},
                   "captions": {"L08": source["captions"]["L08"]}}
        blank = PAYLOAD.sub(lambda m: m[1] + json.dumps(initial) + m[3], template, count=1)
        blank = ACCUSATION.sub("function accuse(){let s=section('Make Your Accusation');notice(s,'Accusations open on 23 December.');}\\n", blank, count=1)
        previous = blank
        previous_days = []
        for n in range(26):
            today = START + dt.timedelta(days=n-1)
            result = release(previous, master, today)
            data = load(result)
            limit = min(n, 24)
            expected_days = source["days"][:limit]
            expected_keys = {"L08"}
            for day in expected_days:
                expected_keys.update(day.get("images", []))
                expected_keys.update(day.get("reveal", {}).get("images", []))
            if limit >= 2:
                expected_keys.update("p" + str(i) for i in range(8))
            if (data["days"] != expected_days or data["days"][:len(previous_days)] != previous_days
                    or data["demo"] is not False
                    or data["suspects"] != (source["suspects"] if limit >= 2 else [])
                    or data["assets"] != {k: source["assets"][k] for k in expected_keys}
                    or data["captions"] != {k: source["captions"][k] for k in expected_keys}):
                raise ValueError("Cumulative content verification failed")
            for k in source["assets"].keys() - expected_keys:
                if source["assets"][k] in result:
                    raise ValueError("Unreleased image found in generated HTML")
            for day in source["days"][limit:]:
                encoded = json.dumps(day["text"], ensure_ascii=False)[1:-1].replace("<", "\\u003c")
                if day["text"] in result or encoded in result:
                    raise ValueError("Unreleased day text found in generated HTML")
            if release(result, master, today) != result:
                raise ValueError("Release is not idempotent")
            previous, previous_days = result, data["days"]
        if len(load(previous)["assets"]) != 30:
            raise ValueError("Final release is missing illustrations")
        print("PASS: 26 dates; cumulative days, 30 WebP images, future-content checks, idempotence")
        return
    today = dt.datetime.now(ZoneInfo("Europe/Paris")).date()
    result = release(template, master, today)
    if result != template:
        a.public.write_text(result, encoding="utf-8")
    print("Public payload validated; released days:", len(load(result)["days"]))

if __name__ == "__main__":
    main()
