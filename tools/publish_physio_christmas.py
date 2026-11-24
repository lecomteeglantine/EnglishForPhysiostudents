#!/usr/bin/env python3
"""Publish only released Case 2412 content; never commit the private source."""
import argparse
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
    return json.loads(matches[0].group(2))

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
        if load(template)["days"]:
            raise ValueError("Use the original empty public template for full simulation")
        previous = template
        for n in range(26):
            today = START + dt.timedelta(days=n-1)
            previous = release(previous, master, today)
            data = load(previous)
            assert len(data["days"]) == min(n,24)
            assert data["demo"] is False
        print("PASS: 26 dates, cumulative release and payload validation")
        return
    today = dt.datetime.now(ZoneInfo("Europe/Paris")).date()
    result = release(template, master, today)
    if result != template:
        a.public.write_text(result, encoding="utf-8")
    print("Public payload validated; released days:", len(load(result)["days"]))

if __name__ == "__main__":
    main()
