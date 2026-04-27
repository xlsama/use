#!/usr/bin/env python3
"""Maintain manifest.json for a prd-summary session.

States: pending / parsed / feishu_pending / skipped / error
"""
import argparse
import json
import sys
from pathlib import Path

VALID_STATUS = {"pending", "parsed", "feishu_pending", "skipped", "error"}


def load(path: Path) -> dict:
    if not path.exists():
        return {"entries": []}
    return json.loads(path.read_text(encoding="utf-8"))


def save(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def cmd_init(args: argparse.Namespace) -> None:
    save(Path(args.path), {"entries": []})


def cmd_add(args: argparse.Namespace) -> None:
    path = Path(args.path)
    data = load(path)
    entry = {
        "idx": args.idx,
        "kind": args.kind,
        "source": args.source,
        "status": args.status,
        "parsed_md": args.parsed,
        "warnings": [args.warning] if args.warning else [],
    }
    data["entries"] = [e for e in data["entries"] if e["idx"] != args.idx] + [entry]
    data["entries"].sort(key=lambda e: e["idx"])
    save(path, data)
    print(json.dumps(entry, ensure_ascii=False))


def cmd_mark(args: argparse.Namespace) -> None:
    path = Path(args.path)
    data = load(path)
    found = None
    for e in data["entries"]:
        if e["idx"] == args.idx:
            if args.status:
                if args.status not in VALID_STATUS:
                    sys.exit(f"invalid status: {args.status}")
                e["status"] = args.status
            if args.parsed:
                e["parsed_md"] = args.parsed
            if args.warning:
                e.setdefault("warnings", []).append(args.warning)
            found = e
            break
    if not found:
        sys.exit(f"idx {args.idx} not found")
    save(path, data)
    print(json.dumps(found, ensure_ascii=False))


def cmd_dump(args: argparse.Namespace) -> None:
    data = load(Path(args.path))
    print(json.dumps(data, ensure_ascii=False, indent=2))


def main() -> None:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    p_init = sub.add_parser("init")
    p_init.add_argument("path")
    p_init.set_defaults(func=cmd_init)

    p_add = sub.add_parser("add")
    p_add.add_argument("path")
    p_add.add_argument("--idx", type=int, required=True)
    p_add.add_argument("--kind", required=True, choices=["local", "feishu", "unknown"])
    p_add.add_argument("--source", required=True)
    p_add.add_argument("--status", required=True, choices=sorted(VALID_STATUS))
    p_add.add_argument("--parsed", default=None)
    p_add.add_argument("--warning", default=None)
    p_add.set_defaults(func=cmd_add)

    p_mark = sub.add_parser("mark")
    p_mark.add_argument("path")
    p_mark.add_argument("--idx", type=int, required=True)
    p_mark.add_argument("--status", default=None)
    p_mark.add_argument("--parsed", default=None)
    p_mark.add_argument("--warning", default=None)
    p_mark.set_defaults(func=cmd_mark)

    p_dump = sub.add_parser("dump")
    p_dump.add_argument("path")
    p_dump.set_defaults(func=cmd_dump)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
