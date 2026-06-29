#!/usr/bin/env python3
"""Mechanical checks for one-shot Remotion scene files.

This script catches project-specific regressions after splitting a multi-shot
scene. It is intentionally conservative; Codex must still inspect storyboard
mapping, timing offsets, and Remotion registration by hand.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


MOTION_NAMES = ("FONT", "clamp", "easeOutExpo", "easeStandard", "easeSoft")
LOCAL_FORBIDDEN = {
    "FONT": re.compile(r"^\s*const\s+FONT\s*=", re.MULTILINE),
    "clamp": re.compile(r"^\s*const\s+clamp\s*=", re.MULTILINE),
    "easeOutExpo": re.compile(r"^\s*const\s+easeOutExpo\s*=", re.MULTILINE),
    "easeStandard": re.compile(r"^\s*const\s+easeStandard\s*=", re.MULTILINE),
    "easeSoft": re.compile(r"^\s*const\s+easeSoft\s*=", re.MULTILINE),
}


def imported_names(source: str, module: str) -> set[str]:
    pattern = re.compile(
        r"import\s*\{(?P<names>[^}]+)\}\s*from\s*[\"']"
        + re.escape(module)
        + r"[\"']",
        re.MULTILINE | re.DOTALL,
    )
    names: set[str] = set()
    for match in pattern.finditer(source):
        for raw in match.group("names").split(","):
            name = raw.strip().split(" as ")[0].strip()
            if name:
                names.add(name)
    return names


def exported_components(source: str) -> list[str]:
    return re.findall(
        r"export\s+const\s+([A-Z][A-Za-z0-9]*)\s*:\s*React\.FC\s*=",
        source,
    )


def used_identifier(source: str, name: str) -> bool:
    source_without_imports = re.sub(r"^\s*import\b.*?;\s*", "", source, flags=re.MULTILINE | re.DOTALL)
    return re.search(rf"\b{re.escape(name)}\b", source_without_imports) is not None


def validate_file(path: Path) -> list[str]:
    errors: list[str] = []
    source = path.read_text(encoding="utf-8")
    stem = path.stem

    if not re.search(r"S\d{2}", stem):
        errors.append("filename must include a two-digit shot marker such as S01")

    components = exported_components(source)
    if len(components) != 1:
        errors.append(f"expected exactly one exported React.FC component, found {len(components)}")
    elif components[0] != stem:
        errors.append(f"exported component {components[0]} must match filename {stem}")

    color_imports = imported_names(source, "../../theme/colors")
    if "NEUTRAL_50" not in color_imports:
        errors.append("must import NEUTRAL_50 from ../../theme/colors")
    if "backgroundColor: NEUTRAL_50" not in source and "background: NEUTRAL_50" not in source:
        errors.append("outer scene should set backgroundColor/background to NEUTRAL_50")

    motion_imports = imported_names(source, "../../theme/motion")
    for name in MOTION_NAMES:
        if LOCAL_FORBIDDEN[name].search(source):
            errors.append(f"must not define local {name}; import it from ../../theme/motion")
        if used_identifier(source, name) and name not in motion_imports:
            errors.append(f"uses {name} but does not import it from ../../theme/motion")

    if re.search(r"background(?:Color)?:\s*[\"']transparent[\"']", source):
        errors.append("must not use a transparent background for split one-shot scenes")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("files", nargs="+", help="Scene .tsx files to validate")
    args = parser.parse_args()

    failed = False
    for raw in args.files:
        path = Path(raw)
        if not path.exists():
            print(f"{path}: missing file", file=sys.stderr)
            failed = True
            continue
        errors = validate_file(path)
        if errors:
            failed = True
            print(f"{path}: FAIL")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"{path}: OK")

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
